import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useUser } from "@clerk/tanstack-react-start";
import { useState } from "react";
import {
  Shield,
  Users,
  Clock,
  Activity,
  AlertTriangle,
  Save,
  Loader2,
  UserPlus,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  Settings,
  Eye,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAssessmentStore, useAssessmentProgress, CURRENT_ASSESSMENT_VERSION } from "@/stores/assessmentStore";

// Types for admin data
interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface MergedUser {
  clerkId: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  notes: string;
  isInDatabase: boolean;
}

interface AdminStats {
  totalUsers: number;
  recentSignups: number;
  activeThisWeek: number;
}

interface AdminData {
  userId: string;
  stats: AdminStats;
  users: MergedUser[];
  error?: string;
}

// Server function to check admin role and fetch all data
const getAdminData = createServerFn().handler(async (): Promise<AdminData> => {
  "use server";

  // Dynamic imports of server-only modules
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/" });
  }

  // Get user from Clerk to check publicMetadata
  const client = await clerkClient();
  const currentUser = await client.users.getUser(userId);
  const role = (currentUser.publicMetadata as { role?: string })?.role;

  if (role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }

  // Dynamic import of database module
  const { initializeDatabase, getAllUserNotes } = await import("@/lib/db.server");
  await initializeDatabase();

  try {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({ limit: 100 });
    const dbNotes = await getAllUserNotes();

    const notesMap = new Map<string, UserNote>();
    for (const note of dbNotes) {
      notesMap.set(note.clerk_id, note);
    }

    const mergedUsers: MergedUser[] = usersResponse.data.map((u) => {
      const dbNote = notesMap.get(u.id);
      return {
        clerkId: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || dbNote?.name || null,
        email: u.primaryEmailAddress?.emailAddress || dbNote?.email || null,
        createdAt: new Date(u.createdAt).toISOString(),
        lastActiveAt: u.lastActiveAt ? new Date(u.lastActiveAt).toISOString() : null,
        notes: dbNote?.notes || "",
        isInDatabase: !!dbNote,
      };
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      userId,
      stats: {
        totalUsers: usersResponse.totalCount,
        recentSignups: usersResponse.data.filter((u) => new Date(u.createdAt) > thirtyDaysAgo).length,
        activeThisWeek: usersResponse.data.filter((u) => u.lastActiveAt && new Date(u.lastActiveAt) > sevenDaysAgo).length,
      },
      users: mergedUsers,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      userId,
      stats: { totalUsers: 0, recentSignups: 0, activeThisWeek: 0 },
      users: [],
      error: "Unable to fetch user data",
    };
  }
});

// Server function to save user notes
const saveUserNote = createServerFn({ method: "POST" })
  .inputValidator((input: { clerkId: string; name: string | null; email: string | null; notes: string }) => input)
  .handler(async ({ data }) => {
    "use server";

    const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user from Clerk to check publicMetadata
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const role = (currentUser.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      throw new Error("Not authorized");
    }

    const { upsertUserNote } = await import("@/lib/db.server");
    await upsertUserNote(data.clerkId, data.name, data.email, data.notes);
    return { success: true };
  });

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard | Compass Coaching",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  loader: async () => await getAdminData(),
});

function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const { stats, error, users } = loaderData;
  const clearAll = useAssessmentStore((state) => state.clearAll);
  const storedResults = useAssessmentStore((state) => state.results);
  const progress = useAssessmentProgress();

  // Local state for dirty notes (unsaved changes)
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [savingUsers, setSavingUsers] = useState<Set<string>>(new Set());
  const [savedUsers, setSavedUsers] = useState<Set<string>>(new Set());
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleResetAssessment = () => {
    clearAll();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2000);
  };

  const handleNotesChange = (clerkId: string, notes: string) => {
    setLocalNotes((prev) => ({ ...prev, [clerkId]: notes }));
    // Clear the saved indicator when user starts typing again
    setSavedUsers((prev) => {
      const next = new Set(prev);
      next.delete(clerkId);
      return next;
    });
  };

  const handleSave = async (userRow: MergedUser) => {
    const notes = localNotes[userRow.clerkId] ?? userRow.notes;

    setSavingUsers((prev) => new Set(prev).add(userRow.clerkId));

    try {
      await saveUserNote({
        data: {
          clerkId: userRow.clerkId,
          name: userRow.name,
          email: userRow.email,
          notes,
        },
      });

      // Clear from local state after successful save
      setLocalNotes((prev) => {
        const next = { ...prev };
        delete next[userRow.clerkId];
        return next;
      });

      // Show saved indicator
      setSavedUsers((prev) => new Set(prev).add(userRow.clerkId));

      // Refresh the data to update isInDatabase status
      await router.invalidate();

      // Clear saved indicator after 2 seconds
      setTimeout(() => {
        setSavedUsers((prev) => {
          const next = new Set(prev);
          next.delete(userRow.clerkId);
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userRow.clerkId);
        return next;
      });
    }
  };

  const isDirty = (clerkId: string) => localNotes[clerkId] !== undefined;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="lg">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-700">Admin Dashboard</h1>
          </div>
          <p className="text-stone-600">
            Welcome{isLoaded && user?.firstName ? `, ${user.firstName}` : ""}. View platform statistics and user activity.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Unable to load data</p>
              <p className="text-amber-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Total Users</p>
                  <p className="text-2xl font-bold text-stone-700">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">New This Month</p>
                  <p className="text-2xl font-bold text-stone-700">{stats.recentSignups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Active This Week</p>
                  <p className="text-2xl font-bold text-stone-700">{stats.activeThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-lime-600" />
              Registered Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Last Active</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-stone-500 min-w-64">Notes</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-stone-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userRow) => {
                    const currentNotes = localNotes[userRow.clerkId] ?? userRow.notes;
                    const isSaving = savingUsers.has(userRow.clerkId);
                    const isSaved = savedUsers.has(userRow.clerkId);
                    const hasUnsavedChanges = isDirty(userRow.clerkId);

                    return (
                      <tr
                        key={userRow.clerkId}
                        className={`border-b border-stone-100 ${
                          !userRow.isInDatabase
                            ? "bg-amber-50/50 border-l-4 border-l-amber-400"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {!userRow.isInDatabase && (
                              <div className="shrink-0" title="New user - not yet saved to database">
                                <UserPlus className="w-4 h-4 text-amber-500" />
                              </div>
                            )}
                            <div>
                              <Link
                                to="/admin/user/$userId"
                                params={{ userId: userRow.clerkId }}
                                className="font-medium text-stone-700 hover:text-lime-600 transition-colors"
                              >
                                {userRow.name || "No name"}
                              </Link>
                              <p className="text-sm text-stone-500">{userRow.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-stone-600">
                          {new Date(userRow.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-4 text-sm text-stone-600">
                          {userRow.lastActiveAt
                            ? new Date(userRow.lastActiveAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Never"}
                        </td>
                        <td className="py-4 px-4">
                          <Textarea
                            value={currentNotes}
                            onChange={(e) => handleNotesChange(userRow.clerkId, e.target.value)}
                            placeholder="Add notes about this user..."
                            className={`min-h-16 text-sm ${
                              hasUnsavedChanges ? "border-amber-400 bg-amber-50" : ""
                            }`}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <Link to="/admin/user/$userId" params={{ userId: userRow.clerkId }}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant={isSaved ? "secondary" : hasUnsavedChanges ? "primary" : "outline"}
                              size="sm"
                              onClick={() => handleSave(userRow)}
                              disabled={isSaving}
                              className="w-full"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isSaved ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Saved
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-6 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-500" />
                <span>New user (not yet in database)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-amber-400 bg-amber-50" />
                <span>Unsaved changes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card className="border-stone-200 bg-stone-50/50">
          <CardHeader>
            <CardTitle className="text-lg">How This Platform Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-600">
            <div>
              <h4 className="font-medium text-stone-700 mb-1">Career Assessment</h4>
              <p>
                Visitors take a 5-section assessment covering personality, values, aptitudes, and life challenges.
                Results are stored in their browser—not on our servers—for privacy. Users can download their results
                to share during counseling sessions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-stone-700 mb-1">User Accounts</h4>
              <p>
                Signing in is optional. Logged-in users can save progress across devices and access their
                personalized dashboard. Admin access (like this page) is granted through Clerk user metadata.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-stone-700 mb-1">Admin Notes</h4>
              <p>
                Use the table above to track notes about users you've counseled. Notes are saved to the database
                and persist across sessions. Users cannot see these notes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dev Tools */}
        <Card className="border-stone-700 bg-stone-900 text-stone-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider mb-3">
              <Settings className="w-3.5 h-3.5" />
              Dev Tools
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* State */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="text-stone-500">Your Assessment</span>
                <span>
                  Progress: <span className="text-white font-medium">{progress.percentComplete}%</span>
                </span>
                <span>
                  Results: <span className={storedResults ? "text-lime-400" : "text-stone-500"}>{storedResults ? "Saved" : "None"}</span>
                  {storedResults && storedResults.version !== CURRENT_ASSESSMENT_VERSION && (
                    <span className="text-amber-400 ml-1">(outdated)</span>
                  )}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const state = useAssessmentStore.getState();
                    navigator.clipboard.writeText(JSON.stringify({
                      basic: state.basic,
                      personality: state.personality,
                      values: state.values,
                      aptitude: state.aptitude,
                      challenges: state.challenges,
                      results: state.results,
                    }, null, 2));
                  }}
                  className="p-2 rounded hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                  title="Copy state to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetAssessment}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-stone-700 hover:bg-stone-700 text-sm transition-colors"
                >
                  {resetConfirmed ? (
                    <>
                      <Check className="w-4 h-4 text-lime-400" />
                      <span className="text-lime-400">Done</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 text-stone-400" />
                      <span>Reset Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* External Services */}
            <div className="mt-3 pt-3 border-t border-stone-700">
              <div className="text-xs text-stone-600 mb-2">External Services</div>
              <div className="flex flex-col sm:flex-row gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <a
                    href="https://dashboard.clerk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    Clerk <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-stone-600">— User accounts & login</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    Vercel <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-stone-600">— Website hosting & deploys</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

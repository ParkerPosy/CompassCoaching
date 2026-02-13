import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Save,
  Loader2,
  Check,
  MessageSquare,
  FileText,
  Target,
  Plus,
  Trash2,
} from "lucide-react";
import type { UserGoal } from "@/lib/db.server";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Types
interface SingleUserData {
  clerkId: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  notes: string;
  adminMessage: string;
  goals: UserGoal[];
}

interface LoaderData {
  user: SingleUserData;
  error?: string;
}

// Server function to get single user data with admin check
const getSingleUserData = createServerFn()
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data }): Promise<LoaderData> => {
    "use server";

    const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw redirect({ to: "/" });
    }

    // Check admin role
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const role = (currentUser.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }

    // Initialize database and get user data
    const { initializeDatabase, getUserNote, getUserGoals } = await import("@/lib/db.server");
    await initializeDatabase();

    try {
      // Get user from Clerk
      const targetUser = await client.users.getUser(data.userId);
      const dbNote = await getUserNote(data.userId);
      const goals = await getUserGoals(data.userId);

      return {
        user: {
          clerkId: targetUser.id,
          name: [targetUser.firstName, targetUser.lastName].filter(Boolean).join(" ") || dbNote?.name || null,
          email: targetUser.primaryEmailAddress?.emailAddress || dbNote?.email || null,
          createdAt: new Date(targetUser.createdAt).toISOString(),
          lastActiveAt: targetUser.lastActiveAt ? new Date(targetUser.lastActiveAt).toISOString() : null,
          notes: dbNote?.notes || "",
          adminMessage: dbNote?.admin_message || "",
          goals,
        },
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        user: {
          clerkId: data.userId,
          name: null,
          email: null,
          createdAt: new Date().toISOString(),
          lastActiveAt: null,
          notes: "",
          adminMessage: "",
          goals: [],
        },
        error: "Unable to fetch user data",
      };
    }
  });

// Server function to save admin message
const saveAdminMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { clerkId: string; adminMessage: string }) => input)
  .handler(async ({ data }) => {
    "use server";

    const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check admin role
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const role = (currentUser.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      throw new Error("Not authorized");
    }

    const { updateAdminMessage } = await import("@/lib/db.server");
    await updateAdminMessage(data.clerkId, data.adminMessage);
    return { success: true };
  });

// Server function to save goals
const saveGoals = createServerFn({ method: "POST" })
  .inputValidator((input: { clerkId: string; goals: UserGoal[] }) => input)
  .handler(async ({ data }) => {
    "use server";

    const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const role = (currentUser.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      throw new Error("Not authorized");
    }

    const { saveUserGoals } = await import("@/lib/db.server");
    await saveUserGoals(data.clerkId, data.goals);
    return { success: true };
  });

// Server function to save notes
const saveUserNotes = createServerFn({ method: "POST" })
  .inputValidator((input: { clerkId: string; name: string | null; email: string | null; notes: string }) => input)
  .handler(async ({ data }) => {
    "use server";

    const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check admin role
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

export const Route = createFileRoute("/admin/user/$userId")({
  component: AdminUserPage,
  head: () => ({
    meta: [
      {
        title: "User Details | Admin | Compass Coaching",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  loader: async ({ params }) => await getSingleUserData({ data: { userId: params.userId } }),
});

function AdminUserPage() {
  const router = useRouter();
  const { user, error } = Route.useLoaderData();

  // Local state for edits
  const [adminMessage, setAdminMessage] = useState(user.adminMessage);
  const [notes, setNotes] = useState(user.notes);
  const [goals, setGoals] = useState<UserGoal[]>(user.goals);
  const [savingMessage, setSavingMessage] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  const [savedGoals, setSavedGoals] = useState(false);

  const messageIsDirty = adminMessage !== user.adminMessage;
  const notesIsDirty = notes !== user.notes;
  const goalsIsDirty = JSON.stringify(goals) !== JSON.stringify(user.goals);

  const handleAddGoal = () => {
    setGoals((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", completed: false },
    ]);
    setSavedGoals(false);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setSavedGoals(false);
  };

  const handleGoalTextChange = (id: string, text: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, text } : g)));
    setSavedGoals(false);
  };

  const handleGoalToggle = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
    setSavedGoals(false);
  };

  const handleSaveGoals = async () => {
    setSavingGoals(true);
    try {
      await saveGoals({
        data: {
          clerkId: user.clerkId,
          goals: goals.filter((g) => g.text.trim() !== ""),
        },
      });
      setSavedGoals(true);
      await router.invalidate();
      setTimeout(() => setSavedGoals(false), 2000);
    } catch (err) {
      console.error("Failed to save goals:", err);
    } finally {
      setSavingGoals(false);
    }
  };

  const handleSaveMessage = async () => {
    setSavingMessage(true);
    try {
      await saveAdminMessage({
        data: {
          clerkId: user.clerkId,
          adminMessage,
        },
      });
      setSavedMessage(true);
      await router.invalidate();
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (err) {
      console.error("Failed to save message:", err);
    } finally {
      setSavingMessage(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await saveUserNotes({
        data: {
          clerkId: user.clerkId,
          name: user.name,
          email: user.email,
          notes,
        },
      });
      setSavedNotes(true);
      await router.invalidate();
      setTimeout(() => setSavedNotes(false), 2000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Back Link */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-700">User Details</h1>
          </div>
          <p className="text-stone-600">
            View and manage information for this user.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">{error}</p>
          </div>
        )}

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-lime-600" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-500">Name</p>
                  <p className="text-stone-700 font-medium">{user.name || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-500">Email</p>
                  <p className="text-stone-700 font-medium">{user.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-500">Joined</p>
                  <p className="text-stone-700 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-500">Last Active</p>
                  <p className="text-stone-700 font-medium">
                    {user.lastActiveAt
                      ? new Date(user.lastActiveAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message to User Card (Visible to User) */}
        <Card className="mb-6 border-lime-200 bg-lime-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-lime-600" />
              Message to User
              <span className="text-xs font-normal text-lime-700 bg-lime-100 px-2 py-0.5 rounded">
                Visible on their dashboard
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-stone-600 mb-4">
              This message will be displayed on the user's dashboard. Use it to share personalized guidance,
              resources, or follow-up information after a coaching session.
            </p>
            <Textarea
              value={adminMessage}
              onChange={(e) => {
                setAdminMessage(e.target.value);
                setSavedMessage(false);
              }}
              placeholder="Enter a message for this user..."
              className={`min-h-32 mb-4 ${messageIsDirty ? "border-amber-400 bg-amber-50" : ""}`}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500">
                {messageIsDirty && "You have unsaved changes"}
              </p>
              <Button
                variant={savedMessage ? "secondary" : messageIsDirty ? "primary" : "outline"}
                onClick={handleSaveMessage}
                disabled={savingMessage || !messageIsDirty}
              >
                {savingMessage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : savedMessage ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Message
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Goals
              <span className="text-xs font-normal text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Visible on their dashboard
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-stone-600 mb-4">
              Create actionable goals for this user. They can mark them complete on their dashboard.
            </p>

            {goals.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-lg border border-dashed border-stone-300">
                <Target className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-500">No goals yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {goals.map((goal, index) => (
                  <div key={goal.id} className="flex items-center gap-3 bg-white rounded-lg border border-stone-200 p-3">
                    <span className="text-xs font-semibold text-stone-400 w-5 text-center shrink-0">{index + 1}</span>
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => handleGoalToggle(goal.id)}
                      className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={goal.text}
                      onChange={(e) => handleGoalTextChange(goal.id, e.target.value)}
                      placeholder="Enter a goal..."
                      className={`flex-1 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none text-stone-700 placeholder:text-stone-400 ${goal.completed ? 'line-through text-stone-400' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors shrink-0 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddGoal}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 mb-4 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>

            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500">
                {goalsIsDirty && "You have unsaved changes"}
              </p>
              <Button
                variant={savedGoals ? "secondary" : goalsIsDirty ? "primary" : "outline"}
                onClick={handleSaveGoals}
                disabled={savingGoals || !goalsIsDirty}
              >
                {savingGoals ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : savedGoals ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Goals
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Internal Notes Card (Admin Only) */}
        <Card className="border-stone-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-600" />
              Internal Notes
              <span className="text-xs font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Admin only
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-stone-600 mb-4">
              Private notes about this user. These are only visible to admins.
            </p>
            <Textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSavedNotes(false);
              }}
              placeholder="Add private notes about this user..."
              className={`min-h-32 mb-4 ${notesIsDirty ? "border-amber-400 bg-amber-50" : ""}`}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500">
                {notesIsDirty && "You have unsaved changes"}
              </p>
              <Button
                variant={savedNotes ? "secondary" : notesIsDirty ? "primary" : "outline"}
                onClick={handleSaveNotes}
                disabled={savingNotes || !notesIsDirty}
              >
                {savingNotes ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : savedNotes ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

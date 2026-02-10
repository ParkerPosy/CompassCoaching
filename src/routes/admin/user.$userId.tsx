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
} from "lucide-react";
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
    const { initializeDatabase, getUserNote } = await import("@/lib/db.server");
    await initializeDatabase();

    try {
      // Get user from Clerk
      const targetUser = await client.users.getUser(data.userId);
      const dbNote = await getUserNote(data.userId);

      return {
        user: {
          clerkId: targetUser.id,
          name: [targetUser.firstName, targetUser.lastName].filter(Boolean).join(" ") || dbNote?.name || null,
          email: targetUser.primaryEmailAddress?.emailAddress || dbNote?.email || null,
          createdAt: new Date(targetUser.createdAt).toISOString(),
          lastActiveAt: targetUser.lastActiveAt ? new Date(targetUser.lastActiveAt).toISOString() : null,
          notes: dbNote?.notes || "",
          adminMessage: dbNote?.admin_message || "",
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
  const [savingMessage, setSavingMessage] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);

  const messageIsDirty = adminMessage !== user.adminMessage;
  const notesIsDirty = notes !== user.notes;

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

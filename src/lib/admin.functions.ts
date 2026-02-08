/**
 * Admin server functions
 * These wrap the DB operations and can be safely imported by route files
 */
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

// Types shared with client
export interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MergedUser {
  clerkId: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  notes: string;
  isInDatabase: boolean;
}

export interface AdminStats {
  totalUsers: number;
  recentSignups: number;
  activeThisWeek: number;
}

export interface AdminData {
  userId: string;
  stats: AdminStats;
  users: MergedUser[];
  error?: string;
}

// Server function to check admin role and fetch all data
export const getAdminData = createServerFn().handler(async (): Promise<AdminData> => {
  // Dynamic import of server-only Clerk code
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw redirect({ to: "/" });
  }

  // Check if user has admin role in publicMetadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }

  // Dynamic import of server-only DB code
  const { initializeDatabase, getAllUserNotes } = await import("./db.server");

  // Initialize database (creates table if not exists)
  await initializeDatabase();

  // Fetch data from both Clerk and database
  try {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({ limit: 100 });
    const dbNotes = await getAllUserNotes();

    const totalUsers = usersResponse.totalCount;
    const clerkUsers = usersResponse.data;

    // Create a map of DB notes by clerk_id for quick lookup
    const notesMap = new Map<string, UserNote>();
    for (const note of dbNotes) {
      notesMap.set(note.clerk_id, note);
    }

    // Merge Clerk users with DB notes
    const mergedUsers: MergedUser[] = clerkUsers.map((u) => {
      const dbNote = notesMap.get(u.id);
      return {
        clerkId: u.id,
        name:
          [u.firstName, u.lastName].filter(Boolean).join(" ") ||
          dbNote?.name ||
          null,
        email: u.primaryEmailAddress?.emailAddress || dbNote?.email || null,
        createdAt: new Date(u.createdAt).toISOString(),
        lastActiveAt: u.lastActiveAt
          ? new Date(u.lastActiveAt).toISOString()
          : null,
        notes: dbNote?.notes || "",
        isInDatabase: !!dbNote,
      };
    });

    // Calculate stats
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSignups = clerkUsers.filter(
      (u) => new Date(u.createdAt) > thirtyDaysAgo
    ).length;

    const activeThisWeek = clerkUsers.filter(
      (u) => u.lastActiveAt && new Date(u.lastActiveAt) > sevenDaysAgo
    ).length;

    return {
      userId,
      stats: {
        totalUsers,
        recentSignups,
        activeThisWeek,
      },
      users: mergedUsers,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      userId,
      stats: {
        totalUsers: 0,
        recentSignups: 0,
        activeThisWeek: 0,
      },
      users: [] as MergedUser[],
      error: "Unable to fetch user data",
    };
  }
});

// Server function to save user notes
export const saveUserNote = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      clerkId: string;
      name: string | null;
      email: string | null;
      notes: string;
    }) => input
  )
  .handler(async ({ data }) => {
    // Dynamic import of server-only Clerk code
    const { auth } = await import("@clerk/tanstack-react-start/server");
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== "admin") {
      throw new Error("Not authorized");
    }

    // Dynamic import of server-only DB code
    const { upsertUserNote } = await import("./db.server");
    await upsertUserNote(data.clerkId, data.name, data.email, data.notes);
    return { success: true };
  });

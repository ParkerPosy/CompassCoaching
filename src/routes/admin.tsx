import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { useUser } from "@clerk/tanstack-react-start";
import { Shield, Users, Clock, Activity, AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Server function to check admin role
const adminAuthFn = createServerFn().handler(async () => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw redirect({ to: "/" });
  }

  // Check if user has admin role in publicMetadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }

  // Fetch basic user stats from Clerk
  try {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({ limit: 100 });

    const totalUsers = usersResponse.totalCount;
    const users = usersResponse.data;

    // Calculate stats
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSignups = users.filter(
      (u) => new Date(u.createdAt) > thirtyDaysAgo
    ).length;

    const activeThisWeek = users.filter(
      (u) => u.lastActiveAt && new Date(u.lastActiveAt) > sevenDaysAgo
    ).length;

    return {
      userId,
      stats: {
        totalUsers,
        recentSignups,
        activeThisWeek,
      },
    };
  } catch (error) {
    console.error("Error fetching Clerk stats:", error);
    return {
      userId,
      stats: {
        totalUsers: 0,
        recentSignups: 0,
        activeThisWeek: 0,
      },
      error: "Unable to fetch user statistics",
    };
  }
});

export const Route = createFileRoute("/admin")({
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
  beforeLoad: async () => await adminAuthFn(),
  loader: async ({ context }) => {
    return context;
  },
});

function AdminPage() {
  const { user, isLoaded } = useUser();
  const loaderData = Route.useLoaderData();
  const { stats, error } = loaderData as {
    userId: string;
    stats: { totalUsers: number; recentSignups: number; activeThisWeek: number };
    error?: string;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="default">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
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
              <p className="text-amber-800 font-medium">Unable to load statistics</p>
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
                  <p className="text-2xl font-bold text-stone-900">{stats.totalUsers}</p>
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
                  <p className="text-2xl font-bold text-stone-900">{stats.recentSignups}</p>
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
                  <p className="text-2xl font-bold text-stone-900">{stats.activeThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Results Info */}
        <Card className="border-stone-200 bg-stone-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600">
              Assessment data is stored locally in users' browsers. Users who want to share their
              results with Compass Coaching can download them from their dashboard and send them
              via email or during a counseling session.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

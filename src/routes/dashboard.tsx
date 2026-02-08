import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { SignedIn, useUser } from "@clerk/tanstack-react-start";
import { User, Shield, Clock, BarChart3 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Server function to check authentication
const authStateFn = createServerFn().handler(async () => {
  const { userId } = await auth();

  if (!userId) {
    throw redirect({
      to: "/",
    });
  }

  return { userId };
});

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: "Dashboard | Compass Coaching",
      },
      {
        name: "description",
        content: "Your personal Compass Coaching dashboard. View your assessment progress and saved career matches.",
      },
    ],
  }),
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId };
  },
});

function DashboardPage() {
  const { user, isLoaded } = useUser();
  const loaderData = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Welcome back{isLoaded && user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-stone-600">
            This is your personal dashboard. Here you'll be able to track your progress and access saved results.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Account Status</p>
                  <p className="text-lg font-semibold text-stone-900">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Assessments</p>
                  <p className="text-lg font-semibold text-stone-900">0 Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Member Since</p>
                  <p className="text-lg font-semibold text-stone-900">
                    {isLoaded && user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Today"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-lime-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SignedIn>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-500">Email</p>
                    <p className="text-stone-900">
                      {isLoaded ? user?.primaryEmailAddress?.emailAddress : "Loading..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">User ID</p>
                    <p className="text-stone-900 font-mono text-sm">{loaderData.userId}</p>
                  </div>
                </div>
              </SignedIn>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="border-dashed border-2 border-stone-300 bg-stone-50/50">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-50">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">Coming Soon</h3>
              <p className="text-stone-500 text-sm max-w-xs">
                Save your assessment results, track career matches over time, and get personalized recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

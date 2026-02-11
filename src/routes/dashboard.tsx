import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SignOutButton, useUser } from "@clerk/tanstack-react-start";
import { User, Shield, Clock, BarChart3, Download, CheckCircle, AlertCircle, LogOut, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssessmentStore, useHasHydrated, useSectionCompletion } from "@/stores/assessmentStore";

// Server function to check authentication and get admin message
const getDashboardData = createServerFn().handler(async () => {
  const { auth } = await import("@clerk/tanstack-react-start/server");
  const { userId } = await auth();

  if (!userId) {
    throw redirect({
      to: "/",
    });
  }

  // Get admin message for this user
  const { initializeDatabase, getAdminMessage } = await import("@/lib/db.server");
  await initializeDatabase();
  const adminMessage = await getAdminMessage(userId);

  return { userId, adminMessage };
});

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard | Compass Coaching" },
      { name: "description", content: "Your personal Compass Coaching dashboard. View your assessment progress and saved career matches." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => await getDashboardData(),
  loader: async ({ context }) => {
    return { userId: context.userId, adminMessage: context.adminMessage };
  },
});

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-stone-200 rounded ${className ?? ""}`} />;
}

function DashboardPage() {
  const { user, isLoaded } = useUser();
  const loaderData = Route.useLoaderData();
  const hasHydrated = useHasHydrated();
  const { basic, personality, values, aptitude, challenges, results } = useAssessmentStore();
  const { completedSections: sectionsCompleted, allComplete } = useSectionCompletion();

  const hasAnyData = basic || personality || values || aptitude || challenges || results;
  const adminMessage = loaderData.adminMessage;
  const isLoading = !isLoaded || !hasHydrated;

  const handleDownloadResults = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      basic,
      personality,
      values,
      aptitude,
      challenges,
      results,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compass-assessment-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-h-20 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-stone-700 mb-2">
              {isLoaded ? (
                `Welcome back${user?.firstName ? `, ${user.firstName}` : ""}!`
              ) : (
                <Shimmer className="h-7 w-56 inline-block" />
              )}
            </h1>
            <p className="text-stone-600">
              This is your personal dashboard. Here you'll be able to track your progress and access saved results.
            </p>
          </div>
          <SignOutButton>
            <Button variant="outline" className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Admin Message Card - Only shown if there's a message */}
        {adminMessage && (
          <Card className="mb-8 border-lime-200 bg-gradient-to-r from-lime-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lime-800">
                <MessageSquare className="w-5 h-5 text-lime-600" />
                Message from Your Coach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 whitespace-pre-wrap">{adminMessage}</p>
            </CardContent>
          </Card>
        )}

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
                  <div className="h-7 flex items-center">
                    <p className="text-lg font-semibold text-stone-700">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Assessment Progress</p>
                  <div className="h-7 flex items-center">
                    {isLoading ? (
                      <Shimmer className="h-5 w-28" />
                    ) : (
                      <p className="text-lg font-semibold text-stone-700">
                        {results ? "Completed" : `${sectionsCompleted}/5 Sections`}
                      </p>
                    )}
                  </div>
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
                  <div className="h-7 flex items-center">
                    {!isLoaded ? (
                      <Shimmer className="h-5 w-24" />
                    ) : (
                      <p className="text-lg font-semibold text-stone-700">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Today"}
                      </p>
                    )}
                  </div>
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
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500">Email</p>
                  <div className="h-6 flex items-center">
                    {!isLoaded ? (
                      <Shimmer className="h-4 w-48" />
                    ) : (
                      <p className="text-stone-700">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-lime-600" />
                Download My Results
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-33">
              {!hasHydrated ? (
                <div className="animate-pulse space-y-4">
                  <Shimmer className="h-5 w-40" />
                  <Shimmer className="h-10 w-full" />
                  <Shimmer className="h-10 w-full rounded-lg" />
                </div>
              ) : hasAnyData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    {allComplete ? (
                      <CheckCircle className="w-4 h-4 text-lime-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-stone-600">
                      {sectionsCompleted}/5 sections completed
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm">
                    Download your assessment data as a JSON file. You can share this with a career counselor.
                  </p>
                  <Button onClick={handleDownloadResults} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Assessment Data
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="text-stone-500 text-sm">
                    No assessment data yet. Complete the assessment to download your results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-lime-50 border border-lime-200 rounded-lg">
          <p className="text-stone-600 text-sm">
            <strong className="text-stone-700">Your privacy matters.</strong> Your assessment data is stored only in your browser's
            local storage—we don't collect or store it on our servers. Use the download button above to save
            your results and share them with a career counselor when you're ready.
          </p>
        </div>
      </Container>
    </div>
  );
}

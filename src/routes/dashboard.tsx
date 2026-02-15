import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SignOutButton, useUser } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { User, Shield, Clock, BarChart3, Download, CheckCircle, AlertCircle, LogOut, MessageSquare, Target, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssessmentStore, useHasHydrated, useSectionCompletion } from "@/stores/assessmentStore";
import type { UserGoal } from "@/lib/db.server";

// Server function to check authentication and get admin message
const getDashboardData = createServerFn().handler(async () => {
  const { auth } = await import("@clerk/tanstack-react-start/server");
  const { userId } = await auth();

  if (!userId) {
    throw redirect({
      to: "/",
    });
  }

  // Get admin message and goals for this user
  const { initializeDatabase, getAdminMessage, getUserGoals } = await import("@/lib/db.server");
  await initializeDatabase();
  const adminMessage = await getAdminMessage(userId);
  const goals = await getUserGoals(userId);

  return { userId, adminMessage, goals };
});

// Server function to toggle a goal's completion status
const toggleGoalCompletion = createServerFn({ method: "POST" })
  .inputValidator((input: { goalId: string }) => input)
  .handler(async ({ data }) => {
    "use server";

    const { auth } = await import("@clerk/tanstack-react-start/server");
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const { getUserGoals, saveUserGoals } = await import("@/lib/db.server");
    const goals = await getUserGoals(userId);
    const updated = goals.map((g) =>
      g.id === data.goalId
        ? {
            ...g,
            completed: !g.completed,
            completedAt: !g.completed ? new Date().toISOString() : null,
          }
        : g
    );
    await saveUserGoals(userId, updated);
    return { success: true };
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
    return { userId: context.userId, adminMessage: context.adminMessage, goals: context.goals };
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
  const [goals, setGoals] = useState<UserGoal[]>(loaderData.goals);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const isLoading = !isLoaded || !hasHydrated;

  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length;
  const progressPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const handleToggleGoal = async (goalId: string) => {
    setTogglingId(goalId);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : null } : g)));
    try {
      await toggleGoalCompletion({ data: { goalId } });
    } catch (err) {
      console.error("Failed to toggle goal:", err);
      setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : null } : g)));
    } finally {
      setTogglingId(null);
    }
  };

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

        {/* Goals Section - Only shown if goals exist */}
        {goals.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <Target className="w-5 h-5 text-blue-600" />
                  Your Goals
                </CardTitle>
                <span className="text-sm font-medium text-blue-600">
                  {completedGoals}/{totalGoals} complete
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {completedGoals === totalGoals && totalGoals > 0 && (
                <p className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Amazing — you've completed all your goals!
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleToggleGoal(goal.id)}
                    disabled={togglingId === goal.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      goal.completed
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-stone-200 hover:border-blue-300 hover:shadow-sm'
                    } ${togglingId === goal.id ? 'opacity-60' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      goal.completed
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-stone-300'
                    }`}>
                      {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      {togglingId === goal.id && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${goal.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                        {goal.text}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 shrink-0">{index + 1}</span>
                  </button>
                ))}
              </div>
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

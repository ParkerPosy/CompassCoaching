import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Compass,
  Download,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  Puzzle,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CareerMatchesTable } from "@/components/CareerMatchesTable";
import { analyzeAssessment } from "@/lib/analyzer";
import { getAvailableCounties } from "@/lib/occupationService";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      {
        title: "Your Career Assessment Results - Compass Coaching",
      },
      {
        name: "description",
        content:
          "View your personalized career assessment results and recommendations.",
      },
    ],
  }),
});

function ResultsPage() {
  const navigate = useNavigate();
  const storedResults = useAssessmentStore((state) => state.results);
  const hasHydrated = useHasHydrated();
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  // Fetch available counties (non-blocking, loads in background)
  const { data: counties, isLoading: countiesLoading } = useQuery({
    queryKey: ['counties'],
    queryFn: () => getAvailableCounties(),
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Compute analysis from stored results
  const analysis = useMemo(() => {
    if (!storedResults) return null;
    return analyzeAssessment(storedResults);
  }, [storedResults]);

  // Redirect to intake only after hydration completes and no results found
  useEffect(() => {
    if (hasHydrated && !storedResults) {
      navigate({ to: "/intake" });
    }
  }, [hasHydrated, storedResults, navigate]);

  // Create work style profile from personality answers
  const workStyleProfile = useMemo(() => {
    if (!storedResults?.personality) return null;

    const p = storedResults.personality;
    return {
      environment: ['Office-based', 'Remote/Flexible', 'Outdoor/Field', 'Varied locations'][p.work_environment - 1] || 'Not specified',
      interaction: ['Independent work', 'Small team (2-5)', 'Large team', 'High public interaction'][p.interaction_style - 1] || 'Not specified',
      structure: ['Highly structured', 'Some structure', 'Flexible', 'Unpredictable'][p.structure - 1] || 'Not specified',
      pace: ['Steady & methodical', 'Bursts of activity', 'Slow build-up', 'Fast-paced'][p.pace - 1] || 'Not specified',
      decisionStyle: ['Data-driven', 'Intuitive', 'Collaborative', 'Experience-based'][p.decision_making - 1] || 'Not specified',
      energySource: ['Solo work', 'Working with a partner', 'Leading groups', 'Networking'][p.energy_source - 1] || 'Not specified',
      schedule: ['Standard hours', 'Flexible schedule', 'Shift work', 'On-call'][p.schedule - 1] || undefined,
      travel: ['No travel', 'Occasional travel', 'Regular travel', 'Extensive travel'][p.travel - 1] || undefined,
      physicalDemands: ['Sedentary', 'Light activity', 'Moderate activity', 'Heavy physical'][p.physical_demands - 1] || undefined,
    };
  }, [storedResults]);

  // Calculate top aptitude clusters
  const topAptitudes = useMemo(() => {
    if (!storedResults?.aptitude) return [];

    const clusters = Object.entries(storedResults.aptitude).map(([key, ratings]) => {
      const avg = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
      return { cluster: key, average: avg, score: Math.round(avg * 20) };
    });

    return clusters.sort((a, b) => b.average - a.average).slice(0, 3);
  }, [storedResults]);

  // Get top values (rated 4 or 5)
  const topValues = useMemo(() => {
    if (!storedResults?.values) return [];

    const valueLabels: Record<string, string> = {
      work_life_balance: 'Work-Life Balance',
      income_potential: 'Income Potential',
      helping_others: 'Helping Others',
      creativity: 'Creativity',
      job_security: 'Job Security',
      independence: 'Independence',
      leadership: 'Leadership',
      learning_growth: 'Learning & Growth',
      recognition: 'Recognition',
      physical_activity: 'Physical Activity',
      environmental_impact: 'Environmental Impact',
      variety: 'Variety',
    };

    return Object.entries(storedResults.values)
      .filter(([, rating]) => rating >= 4)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key, rating]) => ({
        label: valueLabels[key] || key,
        rating,
        isTop: rating === 5,
      }));
  }, [storedResults]);

  // Show loading while store is hydrating or results are being processed
  if (!hasHydrated || !storedResults || !analysis) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const clusterNames: Record<string, string> = {
    stem: 'STEM',
    arts: 'Arts & Creative',
    communication: 'Communication',
    business: 'Business',
    healthcare: 'Healthcare',
    trades: 'Skilled Trades',
    socialServices: 'Social Services',
    law: 'Law & Public Service',
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container>
        <SectionHeader
          icon={Award}
          iconBgColor="bg-lime-400"
          title="Your Career Assessment Results"
          subtitle={`Hi ${storedResults.basic.name}! Here's your personalized career insights.`}
        />
        <p className="text-sm text-stone-500 mb-8">
          Completed on{" "}
          {new Date(storedResults.completedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Quick Profile Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-stone-50 via-white to-blue-50 border border-stone-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Your Profile at a Glance</h3>
                  <p className="text-stone-600">Based on your assessment responses</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Top Aptitudes */}
                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Puzzle className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-stone-800">Top Aptitudes</h4>
                  </div>
                  <div className="space-y-2">
                    {topAptitudes.map((apt, i) => (
                      <div key={apt.cluster} className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">
                          {i === 0 && '🥇'} {i === 1 && '🥈'} {i === 2 && '🥉'} {clusterNames[apt.cluster]}
                        </span>
                        <span className="text-sm font-semibold text-purple-700">{apt.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Values */}
                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <h4 className="font-semibold text-stone-800">What Matters Most</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topValues.map((value) => (
                      <span
                        key={value.label}
                        className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                          value.isTop
                            ? 'bg-pink-100 text-pink-700 border border-pink-300'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {value.isTop && <Star className="w-3 h-3 mr-1" />}
                        {value.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education & Status */}
                <div className="bg-white rounded-lg p-4 border border-stone-200">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-stone-800">Current Situation</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span>Education:</span>
                      <span className="font-medium text-stone-800">
                        {storedResults.basic.educationLevel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span>Status:</span>
                      <span className="font-medium text-stone-800">
                        {storedResults.basic.employmentStatus.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Work Style Profile */}
        {workStyleProfile && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-indigo-600" />
              <h2 className="text-3xl font-bold text-stone-900">Your Work Style Profile</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-stone-600 mb-6">
                  Understanding how you prefer to work helps us match you with careers where you'll thrive.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Environment</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.environment}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Interaction</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.interaction}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Structure</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.structure}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Work Pace</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.pace}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Decision Making</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.decisionStyle}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Zap className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Energy From</p>
                      <p className="font-medium text-stone-800">{workStyleProfile.energySource}</p>
                    </div>
                  </div>
                  {workStyleProfile.schedule && (
                    <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                      <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Schedule</p>
                        <p className="font-medium text-stone-800">{workStyleProfile.schedule}</p>
                      </div>
                    </div>
                  )}
                  {workStyleProfile.travel && (
                    <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Travel</p>
                        <p className="font-medium text-stone-800">{workStyleProfile.travel}</p>
                      </div>
                    </div>
                  )}
                  {workStyleProfile.physicalDemands && (
                    <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                      <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Physical Activity</p>
                        <p className="font-medium text-stone-800">{workStyleProfile.physicalDemands}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Top Career Fields */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Top Career Fields
            </h2>
          </div>
          <p className="text-stone-600 mb-6">
            Based on your aptitude ratings, these fields align best with your natural strengths.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis?.topCareerFields.map((field, index) => (
              <Card
                key={index}
                className={`border-2 transition-colors flex flex-col ${
                  index === 0
                    ? 'border-blue-300 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-white'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={index === 0 ? 'primary' : 'default'} size="sm">
                      #{index + 1} Match
                    </Badge>
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-blue-600' : 'text-stone-600'}`}>
                      {field.score}%
                    </span>
                  </div>
                  <CardTitle className="text-xl">{field.field}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-stone-600 mb-4 flex-1">{field.description}</p>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-blue-500' : 'bg-stone-400'}`}
                      style={{ width: `${field.score}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Values */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-rose-500" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Core Values
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {analysis?.topValues.map((value, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-rose-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-stone-900">
                          {value.value}
                        </h3>
                        <span className="text-sm font-medium text-rose-600">
                          {value.score}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5">
                        <div
                          className="bg-rose-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${value.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Personality Insights */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-bold text-stone-900">
              Personality Insights
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {analysis?.personalityInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-stone-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl font-bold text-stone-900">
              Personalized Recommendations
            </h2>
          </div>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {analysis?.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-stone-800">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Career Matches Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Personalized Career Matches
            </h2>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>How we match careers:</strong> We compare your aptitude scores, work style preferences,
              and values against the characteristics of each occupation. Higher match percentages indicate
              stronger alignment. Scores of 60%+ indicate a strong match with your profile.
            </p>
          </div>

          {/* County Filter */}
          <div className="mb-6 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-stone-600" />
            <span className="text-sm font-medium text-stone-700">Show salaries for:</span>
            <Select
              value={selectedCounty}
              onValueChange={setSelectedCounty}
              disabled={countiesLoading}
            >
              <SelectTrigger className="bg-white w-[300px]">
                <SelectValue placeholder="All Pennsylvania" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="All">All Pennsylvania (Statewide)</SelectItem>
                {counties?.map((county: string) => (
                  <SelectItem key={county} value={county}>
                    {county} County
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Career Matches Table */}
          {storedResults ? (
            <CareerMatchesTable
              assessmentResults={storedResults}
              selectedCounty={selectedCounty !== 'All' ? selectedCounty : undefined}
            />
          ) : (
            <div className="text-center py-12 text-stone-600">
              Unable to load career matches. Please try refreshing the page.
            </div>
          )}
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-violet-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Next Steps
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <ol className="space-y-4">
                {analysis?.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-stone-700">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-stone-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Download Results (PDF)
          </Button>
          <Link
            to="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-200 text-stone-900 hover:bg-stone-300 active:bg-stone-400 focus:ring-stone-300 px-6 py-3 text-lg"
          >
            Explore Resources
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/intake/review"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Review
          </Link>
        </div>
      </Container>
    </div>
  );
}

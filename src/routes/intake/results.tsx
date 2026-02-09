import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
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
  RefreshCw,
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
import { useAssessmentStore, useHasHydrated, useIsResultsOutdated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      {
        title: "Your Career Assessment Results | Compass Coaching",
      },
      {
        name: "description",
        content:
          "View your personalized career assessment results and recommendations.",
      },
    ],
  }),
});

// Swoosh pattern for results hero
function ResultsPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Base gradient - celebratory lime/green */}
        <linearGradient id="resultsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#365314" />
          <stop offset="50%" stopColor="#3f6212" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>

        {/* Lime accent gradient */}
        <linearGradient id="resultsAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#bef264" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0.3" />
        </linearGradient>

        {/* Secondary accent */}
        <linearGradient id="resultsAccent2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#a3e635" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#65a30d" stopOpacity="0.3" />
        </linearGradient>

        {/* Filled swoosh gradient */}
        <linearGradient id="resultsSwooshFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#65a30d" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Base fill */}
      <rect width="100%" height="100%" fill="url(#resultsBg)" />

      {/* Filled swoosh area */}
      <path
        d="M0 320 Q200 250 500 280 T900 240 T1200 260 L1200 400 L0 400 Z"
        fill="url(#resultsSwooshFill)"
      />

      {/* Primary swoosh */}
      <path
        d="M0 310 Q180 260 450 290 Q750 320 1000 250 Q1120 220 1200 240"
        fill="none"
        stroke="url(#resultsAccent)"
        strokeWidth="3"
      />

      {/* Secondary swoosh */}
      <path
        d="M0 260 Q250 280 500 230 Q800 170 1050 200 T1200 180"
        fill="none"
        stroke="url(#resultsAccent2)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Third swoosh */}
      <path
        d="M0 370 Q200 340 400 360 Q650 390 850 320 Q1050 260 1200 290"
        fill="none"
        stroke="rgba(163, 230, 53, 0.4)"
        strokeWidth="2"
      />

      {/* White accent lines */}
      <path
        d="M0 340 Q350 290 600 330 Q850 370 1050 300 T1200 310"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />

      {/* Top accent curves */}
      <path
        d="M800 0 Q880 80 980 50 Q1080 20 1200 70"
        fill="none"
        stroke="url(#resultsAccent)"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M900 0 Q960 50 1020 30 Q1100 10 1200 45"
        fill="none"
        stroke="rgba(163, 230, 53, 0.3)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const storedResults = useAssessmentStore((state) => state.results);
  const clearResults = useAssessmentStore((state) => state.clearResults);
  const hasHydrated = useHasHydrated();
  const isOutdated = useIsResultsOutdated();
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  // Handler for retaking the assessment
  const handleRetake = () => {
    clearResults();
    navigate({ to: "/intake" });
  };

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
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section with Extended Swoosh Pattern */}
      <div className="relative overflow-hidden">
        {/* Pattern extends behind both hero and profile card */}
        <div className="absolute inset-0 pb-32">
          <ResultsPattern />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 pt-12 md:pt-16 pb-8">
          <div className="text-center max-w-3xl mx-auto text-white">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <Award className="w-10 h-10 text-lime-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Career Assessment Results
            </h1>
            <p className="text-xl text-lime-100 mb-2">
              Hi {storedResults.basic.name}! Here's your personalized career insights.
            </p>
            <p className="text-sm text-lime-200/70">
              Completed on{" "}
              {new Date(storedResults.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </Container>

        {/* Quick Profile Summary - Glass Card overlapping pattern */}
        <Container className="relative z-10 px-6 pb-12">
          {/* Migration Warning Banner */}
          {isOutdated && (
            <div className="mb-8 p-4 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800">Assessment Updated</h3>
                  <p className="text-sm text-amber-700">
                    Our career assessment has been improved since you last took it.
                    We recommend retaking the assessment for the most accurate career matches.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                className="shrink-0 bg-amber-600 hover:bg-amber-700"
                onClick={handleRetake}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          )}

          <section className="mb-8">
            <Card className="bg-white/20 backdrop-blur-lg border border-white/40 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white drop-shadow-md">Your Profile at a Glance</h3>
                    <p className="text-white/80">Based on your assessment responses</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Top Aptitudes */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Puzzle className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-stone-700">Top Aptitudes</h4>
                    </div>
                    <div className="space-y-2">
                      {topAptitudes.map((apt, i) => (
                        <div key={apt.cluster} className="flex items-center justify-between">
                          <span className="text-sm text-stone-600">
                            {i + 1}. {clusterNames[apt.cluster] || apt.cluster}
                          </span>
                          <span className="text-xs font-bold text-lime-600">{apt.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Values */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <h4 className="font-semibold text-stone-700">What Matters Most</h4>
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
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-lime-600" />
                      <h4 className="font-semibold text-stone-700">Current Situation</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-stone-600">
                        <span>Education:</span>
                        <span className="font-semibold text-stone-700">
                          {storedResults.basic.educationLevel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <span>Status:</span>
                        <span className="font-semibold text-stone-700">
                          {storedResults.basic.employmentStatus.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Container>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="w-full h-8 md:h-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 Q200 60 400 30 Q600 0 800 20 Q1000 40 1200 10 L1200 60 L0 60 Z"
              fill="#fafaf9"
            />
            <path
              d="M0 40 Q200 60 400 30 Q600 0 800 20 Q1000 40 1200 10"
              fill="none"
              stroke="#a3e635"
              strokeWidth="2"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <Container className="py-8 md:py-12 px-6">

        {/* Work Style Profile */}
        {workStyleProfile && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-lime-600" />
              <h2 className="text-3xl font-bold text-stone-700">Your Work Style Profile</h2>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60">
              <CardContent className="p-6">
                <p className="text-stone-600 mb-6">
                  Understanding how you prefer to work helps us match you with careers where you'll thrive.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Briefcase className="w-5 h-5 text-lime-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Environment</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.environment}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Interaction</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.interaction}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Structure</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.structure}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Work Pace</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.pace}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Decision Making</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.decisionStyle}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                    <Zap className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Energy From</p>
                      <p className="font-medium text-stone-700">{workStyleProfile.energySource}</p>
                    </div>
                  </div>
                  {workStyleProfile.schedule && (
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                      <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Schedule</p>
                        <p className="font-medium text-stone-700">{workStyleProfile.schedule}</p>
                      </div>
                    </div>
                  )}
                  {workStyleProfile.travel && (
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                      <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Travel</p>
                        <p className="font-medium text-stone-700">{workStyleProfile.travel}</p>
                      </div>
                    </div>
                  )}
                  {workStyleProfile.physicalDemands && (
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-stone-100">
                      <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Physical Activity</p>
                        <p className="font-medium text-stone-700">{workStyleProfile.physicalDemands}</p>
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
            <TrendingUp className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-700">
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
                    ? 'border-lime-300 hover:border-lime-400 bg-gradient-to-br from-lime-50 to-white'
                    : 'border-stone-200 hover:border-stone-300 bg-white/80 backdrop-blur-sm'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={index === 0 ? 'primary' : 'default'} size="sm">
                      #{index + 1} Match
                    </Badge>
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-lime-600' : 'text-stone-600'}`}>
                      {field.score}%
                    </span>
                  </div>
                  <CardTitle className="text-xl">{field.field}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-stone-600 mb-4 flex-1">{field.description}</p>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-lime-500' : 'bg-stone-400'}`}
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
            <h2 className="text-3xl font-bold text-stone-700">
              Your Core Values
            </h2>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60">
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
                        <h3 className="font-semibold text-stone-700">
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
            <h2 className="text-3xl font-bold text-stone-700">
              Personality Insights
            </h2>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60">
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
            <h2 className="text-3xl font-bold text-stone-700">
              Personalized Recommendations
            </h2>
          </div>
          <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/60">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {analysis?.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-stone-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Career Matches Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-700">
              Your Personalized Career Matches
            </h2>
          </div>
          <div className="bg-lime-50/80 border border-lime-200 rounded-lg p-4 mb-6">
            <p className="text-lime-800 text-sm">
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
            <CheckCircle className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-700">
              Your Next Steps
            </h2>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60">
            <CardContent className="p-6">
              <ol className="space-y-4">
                {analysis?.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-lime-700">
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
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-200 text-stone-700 hover:bg-stone-300 active:bg-stone-400 focus:ring-stone-300 px-6 py-3 text-lg"
          >
            Explore Resources
          </Link>
        </div>

        {/* Retake Assessment */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/intake/review"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Review
          </Link>
        </div>
      </Container>
    </div>
  );
}

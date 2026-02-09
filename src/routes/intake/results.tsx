import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Car,
  CheckCircle,
  ChevronDown,
  Clock,
  Compass,
  DollarSign,
  Download,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  MapPin,
  Puzzle,
  RefreshCw,
  Route as RouteIcon,
  Scale,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// Collapsible section component for streamlined UI
function CollapsibleSection({
  title,
  description,
  icon: Icon,
  iconColor,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof BookOpen;
  iconColor: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group mb-8" open={defaultOpen}>
      <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-stone-50/60 backdrop-blur-sm rounded-xl border border-stone-200/60 hover:from-white hover:to-white/80 transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${iconColor}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-700">{title}</h2>
            {description && <p className="text-sm text-stone-500 group-open:hidden">{description}</p>}
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-stone-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 pl-2">{children}</div>
    </details>
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

  // Generate path forward insights from challenges data
  const pathForwardInsights = useMemo(() => {
    if (!storedResults?.challenges) return [];
    const c = storedResults.challenges;
    const insights: Array<{ icon: typeof DollarSign; title: string; message: string; actionable: string }> = [];

    // Financial guidance
    if (c.financial === 'limited-funds' || c.financial === 'need-financial-aid') {
      insights.push({
        icon: DollarSign,
        title: 'Financial Path',
        message: 'We understand finances are a real consideration for you.',
        actionable: 'Prioritize careers with paid training, apprenticeships, or employer-sponsored education. Check our Financial Aid resources for PA-specific grants and scholarships.',
      });
    } else if (c.financial === 'working-while-learning') {
      insights.push({
        icon: DollarSign,
        title: 'Work + Learn Balance',
        message: 'Balancing work and education takes real dedication.',
        actionable: 'Look for evening/weekend programs, online certifications, or employers offering tuition assistance. Many of your top career matches have flexible training paths.',
      });
    } else if (c.financial === 'some-savings') {
      insights.push({
        icon: DollarSign,
        title: 'Stretch Your Savings',
        message: 'Your savings can go further with the right approach.',
        actionable: 'Combine savings with grants (many PA programs require no repayment), employer tuition programs, or low-cost community college credits. Avoid high-interest loans when free options exist.',
      });
    }

    // Time constraints
    if (c.timeAvailability === 'very-limited' || c.timeAvailability === 'evenings-weekends' || c.timeAvailability === 'part-time') {
      insights.push({
        icon: Clock,
        title: 'Time-Conscious Path',
        message: `With ${c.timeAvailability === 'very-limited' ? 'limited hours' : c.timeAvailability === 'part-time' ? 'part-time availability' : 'only evenings/weekends'} available, efficiency matters.`,
        actionable: 'Focus on shorter certificate programs (3-6 months) or self-paced online learning. Skilled trades apprenticeships often work around schedules.',
      });
    }

    // Location constraints
    if (c.locationFlexibility === 'local-only' || c.locationFlexibility === 'same-region') {
      insights.push({
        icon: Home,
        title: c.locationFlexibility === 'local-only' ? 'Local Opportunities' : 'Regional Focus',
        message: c.locationFlexibility === 'local-only'
          ? 'Staying in your area is completely valid—roots matter.'
          : 'Staying in your region gives you more options while keeping you close to home.',
        actionable: 'We\'ve filtered career matches to show Pennsylvania wage data. Check local community colleges and workforce development boards for area-specific opportunities.',
      });
    } else if (c.locationFlexibility === 'remote-preferred') {
      insights.push({
        icon: Home,
        title: 'Remote-Friendly Paths',
        message: 'Remote work opens doors regardless of location.',
        actionable: 'Your STEM, Communication, and Business aptitudes align well with remote-friendly careers. Look for roles marked "remote" in your career matches.',
      });
    }

    // Family obligations
    if (c.familyObligations === 'childcare' || c.familyObligations === 'elder-care' || c.familyObligations === 'both' || c.familyObligations === 'other') {
      insights.push({
        icon: Users,
        title: 'Caregiving Balance',
        message: 'Caring for family while building a career takes strength.',
        actionable: 'Prioritize careers with predictable schedules, remote options, or good benefits. Many healthcare and education roles understand family needs firsthand.',
      });
    }

    // Transportation
    if (c.transportation === 'limited' || c.transportation === 'none' || c.transportation === 'public-transit') {
      insights.push({
        icon: Car,
        title: 'Transportation Solutions',
        message: 'Getting to work reliably is essential.',
        actionable: 'Look for remote work, positions near public transit, or employers offering transportation assistance. Some trade unions provide rides to job sites.',
      });
    }

    // Support system
    if (c.supportSystem === 'limited' || c.supportSystem === 'independent') {
      insights.push({
        icon: Users,
        title: 'Building Your Network',
        message: 'Going it alone is harder, but you\'re not truly alone.',
        actionable: 'Connect with career mentors through PA CareerLink, join professional associations, or find study groups. Our Networking resources can help you build connections.',
      });
    }

    // Education gaps
    if (c.educationGaps && c.educationGaps.length > 0 && !c.educationGaps.includes('None of the above')) {
      insights.push({
        icon: BookOpen,
        title: 'Skill Building',
        message: `You identified areas for growth: ${c.educationGaps.slice(0, 2).join(', ')}${c.educationGaps.length > 2 ? ', and more' : ''}.`,
        actionable: 'That self-awareness is valuable! Free resources like Khan Academy, local library programs, and PA workforce centers can help you strengthen these areas.',
      });
    }

    // Health considerations
    if (c.healthConsiderations === 'physical') {
      insights.push({
        icon: Heart,
        title: 'Physical Accommodations',
        message: 'Physical considerations shouldn\'t limit your career potential.',
        actionable: 'Look for desk-based, remote, or light-duty roles. Many employers offer accommodations under ADA. PA Office of Vocational Rehabilitation provides free services for job seekers with disabilities.',
      });
    } else if (c.healthConsiderations === 'mental-health') {
      insights.push({
        icon: Heart,
        title: 'Mental Wellbeing at Work',
        message: 'Your mental health matters—the right workplace can support it.',
        actionable: 'Seek employers with mental health benefits, flexible schedules, and supportive cultures. Remote work can reduce stress. Check out our Mental Wellbeing resources section.',
      });
    } else if (c.healthConsiderations === 'chronic-condition') {
      insights.push({
        icon: Heart,
        title: 'Managing Health & Career',
        message: 'Living with a chronic condition requires workplace flexibility.',
        actionable: 'Prioritize roles with comprehensive health insurance, paid sick leave, and understanding management. Government and healthcare sector jobs often have strong benefits.',
      });
    }

    return insights;
  }, [storedResults]);

  // Analyze value tensions/conflicts
  const valueTensions = useMemo(() => {
    if (!storedResults?.values) return [];
    const v = storedResults.values;
    const tensions: Array<{ values: string[]; insight: string }> = [];

    // Income vs Work-Life Balance tension
    if (v.income_potential >= 4 && v.work_life_balance >= 4) {
      tensions.push({
        values: ['High Income', 'Work-Life Balance'],
        insight: 'These can coexist! Look for high-paying roles with boundaries, or consider that higher earnings early can buy flexibility later.',
      });
    }

    // Independence vs Leadership tension
    if (v.independence >= 4 && v.leadership >= 4) {
      tensions.push({
        values: ['Independence', 'Leadership'],
        insight: 'You want autonomy AND influence. Consider roles where you lead projects independently, or entrepreneurship where you set the direction.',
      });
    }

    // Job Security vs Variety tension
    if (v.job_security >= 4 && v.variety >= 4) {
      tensions.push({
        values: ['Job Security', 'Variety'],
        insight: 'Stability and variety can align in large organizations with internal mobility, or government roles with diverse assignments.',
      });
    }

    // Helping Others vs Income
    if (v.helping_others >= 4 && v.income_potential >= 4) {
      tensions.push({
        values: ['Helping Others', 'High Income'],
        insight: 'Healthcare, specialized therapy, and nonprofit leadership combine impact with strong compensation.',
      });
    }

    return tensions.slice(0, 2); // Max 2 tensions to keep it focused
  }, [storedResults]);

  // Age-appropriate insights
  const ageInsights = useMemo(() => {
    if (!storedResults?.basic?.ageRange) return null;
    const age = storedResults.basic.ageRange;

    const insights: Record<string, { title: string; message: string }> = {
      'under-18': {
        title: 'Starting Early',
        message: 'You\'re ahead of the curve exploring careers now! Focus on experiences—internships, job shadows, and clubs—rather than committing to one path. Your interests will evolve, and that\'s perfectly normal.',
      },
      '18-24': {
        title: 'Building Your Foundation',
        message: 'This is prime time for exploration and skill-building. Don\'t fear trying different paths—each experience adds value. Consider positions that offer learning and growth over immediate high pay.',
      },
      '25-34': {
        title: 'Establishing Direction',
        message: 'You likely have some experience to leverage. Career pivots are still very accessible, and you can build on transferable skills. This is often the best time for strategic education investments.',
      },
      '35-44': {
        title: 'Leveraging Experience',
        message: 'Your life experience is a genuine asset—don\'t underestimate it. Focus on careers that value maturity, and consider how your existing skills translate. Many employers specifically value your perspective.',
      },
      '45-54': {
        title: 'Experienced & Valuable',
        message: 'You bring decades of real-world knowledge. Target roles valuing seasoned professionals, consider consulting or mentoring paths, and don\'t let age stereotypes limit your ambitions.',
      },
      '55-plus': {
        title: 'Wisdom in Action',
        message: 'Your experience is irreplaceable. Consider phased transitions, part-time roles that leverage expertise, or encore careers focused on giving back. Many fulfilling opportunities await.',
      },
    };

    return insights[age] || null;
  }, [storedResults]);

  // Acknowledge their primary reason for the assessment
  const reasonMessage = useMemo(() => {
    if (!storedResults?.basic?.primaryReason) return null;
    const reason = storedResults.basic.primaryReason;
    if (!reason || reason.trim() === '') return null;

    return {
      title: 'Why You\'re Here',
      message: reason,
      followUp: 'We\'ve kept this in mind throughout your analysis. Your career matches and recommendations are tailored to help you achieve this goal.',
    };
  }, [storedResults]);

  // Generate personalized resource recommendations
  const recommendedResources = useMemo(() => {
    if (!storedResults) return [];
    const resources: Array<{ title: string; slug: string; reason: string }> = [];
    const c = storedResults.challenges;
    const basic = storedResults.basic;

    // Financial constraints → Financial Aid
    if (c.financial === 'limited-funds' || c.financial === 'need-financial-aid') {
      resources.push({
        title: 'Financial Aid & Planning',
        slug: 'financial-aid',
        reason: 'Find scholarships, grants, and funding options for your education',
      });
    }

    // Career change or exploration → Career Exploration
    if (basic.employmentStatus === 'unemployed' || basic.employmentStatus === 'seeking-change') {
      resources.push({
        title: 'Career Exploration',
        slug: 'career-exploration',
        reason: 'Discover paths that match your unique profile',
      });
    }

    // Limited support → Networking
    if (c.supportSystem === 'limited' || c.supportSystem === 'independent') {
      resources.push({
        title: 'Networking',
        slug: 'networking',
        reason: 'Build connections and find mentors in your field',
      });
    }

    // Education gaps → Skills Development
    if (c.educationGaps && c.educationGaps.length > 0 && !c.educationGaps.includes('None of the above')) {
      resources.push({
        title: 'Skills Development',
        slug: 'skills-development',
        reason: 'Free resources to strengthen foundational skills',
      });
    }

    // Student → Education & Training
    if (basic.employmentStatus === 'student') {
      resources.push({
        title: 'Education & Training',
        slug: 'education-training',
        reason: 'Programs and certifications to build your credentials',
      });
    }

    // Health considerations → Mental Wellbeing or Healthy Living
    if (c.healthConsiderations === 'mental-health') {
      resources.push({
        title: 'Mental Wellbeing',
        slug: 'mental-wellbeing',
        reason: 'Tools and strategies for a healthier mind',
      });
    } else if (c.healthConsiderations === 'physical' || c.healthConsiderations === 'chronic-condition') {
      resources.push({
        title: 'Healthy Living',
        slug: 'healthy-living',
        reason: 'Support your physical wellbeing alongside your career',
      });
    }

    // Job seeking basics for unemployed
    if (basic.employmentStatus === 'unemployed') {
      resources.push({
        title: 'Resume & Cover Letters',
        slug: 'resume-cover-letters',
        reason: 'Create professional applications that stand out',
      });
      resources.push({
        title: 'Interview Preparation',
        slug: 'interview-prep',
        reason: 'Practice questions and strategies to ace interviews',
      });
    }

    // Employed seeking change → Career Transitions
    if (basic.employmentStatus === 'seeking-change' || basic.employmentStatus === 'employed-pt') {
      resources.push({
        title: 'Career Transitions',
        slug: 'career-transitions',
        reason: 'Navigate your career change successfully',
      });
    }

    // Always useful: Professional Development
    if (resources.length < 4) {
      resources.push({
        title: 'Professional Development',
        slug: 'professional-development',
        reason: 'Build skills and advance your career',
      });
    }

    return resources.slice(0, 4); // Max 4 recommendations
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
                  <div className="bg-white/55 backdrop-blur-md rounded-lg p-4 border border-white/40 shadow-md">
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
                  <div className="bg-white/55 backdrop-blur-md rounded-lg p-4 border border-white/40 shadow-md">
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
                  <div className="bg-white/55 backdrop-blur-md rounded-lg p-4 border border-white/40 shadow-md">
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

        {/* Top Career Fields - Compact Display */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-lime-600" />
            <h2 className="text-2xl font-bold text-stone-700">
              Your Top Career Fields
            </h2>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60">
            <CardContent className="p-4">
              <div className="space-y-3">
                {analysis?.topCareerFields.map((field, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      index === 0 ? 'bg-lime-50 border border-lime-200' : 'bg-stone-50'
                    }`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-lime-500 text-white' : 'bg-stone-300 text-stone-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`font-semibold truncate ${index === 0 ? 'text-lime-700' : 'text-stone-700'}`}>
                          {field.field}
                        </h3>
                        <span className={`shrink-0 text-lg font-bold ${index === 0 ? 'text-lime-600' : 'text-stone-500'}`}>
                          {field.score}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${index === 0 ? 'bg-lime-500' : 'bg-stone-400'}`}
                          style={{ width: `${field.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Career Matches Section - Primary Content */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-stone-700">
              Your Personalized Career Matches
            </h2>
          </div>
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
            <p className="text-blue-800">
              <strong>How we match:</strong> Based on your aptitudes, work style, and values.
              Scores of 60%+ indicate strong alignment.
            </p>
          </div>

          {/* County Filter */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <MapPin className="w-4 h-4 text-stone-500" />
            <span className="text-sm text-stone-600">Salaries for:</span>
            <Select
              value={selectedCounty}
              onValueChange={setSelectedCounty}
              disabled={countiesLoading}
            >
              <SelectTrigger className="bg-white w-[250px] h-9 text-sm">
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
            <div className="text-center py-8 text-stone-600">
              Unable to load career matches. Please try refreshing the page.
            </div>
          )}
        </section>

        {/* Understanding Your Profile - Collapsible Deep Dive */}
        <CollapsibleSection
          title="Understanding Your Profile"
          description="Your work style, personality insights & core values"
          icon={User}
          iconColor="from-purple-500 to-indigo-600"
        >
          {workStyleProfile && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-lime-600" />
                Work Style Preferences
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: 'Environment', value: workStyleProfile.environment, icon: Briefcase, color: 'lime' },
                  { label: 'Interaction', value: workStyleProfile.interaction, icon: Users, color: 'purple' },
                  { label: 'Structure', value: workStyleProfile.structure, icon: Target, color: 'green' },
                  { label: 'Work Pace', value: workStyleProfile.pace, icon: Clock, color: 'orange' },
                  { label: 'Decisions', value: workStyleProfile.decisionStyle, icon: Lightbulb, color: 'yellow' },
                  { label: 'Energy From', value: workStyleProfile.energySource, icon: Zap, color: 'pink' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-stone-100 text-sm">
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    <span className="text-stone-500">{item.label}:</span>
                    <span className="font-medium text-stone-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis?.personalityInsights && analysis.personalityInsights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Personality Insights
              </h3>
              <ul className="space-y-2">
                {analysis.personalityInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-stone-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reasonMessage && (
            <div className="mb-6 p-4 bg-violet-50/80 rounded-lg border border-violet-200/60">
              <h3 className="text-lg font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Why You're Here
              </h3>
              <blockquote className="text-stone-600 italic border-l-3 border-violet-400 pl-3 text-sm">
                "{reasonMessage.message}"
              </blockquote>
            </div>
          )}

          {ageInsights && (
            <div className="mb-6 p-4 bg-indigo-50/80 rounded-lg border border-indigo-200/60">
              <h3 className="text-lg font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                {ageInsights.title}
              </h3>
              <p className="text-stone-600 text-sm">{ageInsights.message}</p>
            </div>
          )}

          {valueTensions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-600" />
                Balancing Your Values
              </h3>
              <div className="space-y-3">
                {valueTensions.map((tension, index) => (
                  <div key={index} className="p-3 bg-white/60 rounded-lg border border-cyan-200/60">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {tension.values.map((v, i) => (
                        <span key={v}>
                          <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">
                            {v}
                          </span>
                          {i < tension.values.length - 1 && <span className="text-stone-400 mx-1">+</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-stone-600 text-sm">{tension.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Your Action Plan - Collapsible */}
        <CollapsibleSection
          title="Your Action Plan"
          description="Next steps, resources & personalized recommendations"
          icon={RouteIcon}
          iconColor="from-emerald-500 to-teal-600"
        >
          {pathForwardInsights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-700 mb-3">Based on Your Situation</h3>
              <div className="space-y-3">
                {pathForwardInsights.map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <div key={index} className="p-4 bg-white/80 rounded-lg border border-emerald-200/60">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-700 text-sm">{insight.title}</h4>
                          <p className="text-stone-500 text-sm mb-2">{insight.message}</p>
                          <p className="text-emerald-700 text-xs bg-emerald-50 rounded p-2">
                            <strong>Action:</strong> {insight.actionable}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {storedResults?.challenges?.additionalNotes && storedResults.challenges.additionalNotes.trim() !== '' && (
            <div className="mb-6 p-4 bg-amber-50/80 rounded-lg border border-amber-200/60">
              <h4 className="font-medium text-stone-700 text-sm flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                What You Shared
              </h4>
              <p className="text-stone-600 text-sm italic">"{storedResults.challenges.additionalNotes}"</p>
            </div>
          )}

          {recommendedResources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-700 mb-3">Recommended Resources</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {recommendedResources.map((resource, index) => (
                  <Link
                    key={index}
                    to="/resources/$categorySlug"
                    params={{ categorySlug: resource.slug }}
                    className="group block p-3 bg-white/80 rounded-lg border border-teal-200/60 hover:border-teal-400 transition-colors"
                  >
                    <h4 className="font-medium text-stone-700 group-hover:text-teal-600 transition-colors text-sm">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-stone-500">{resource.reason}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-700 mb-3">Personalized Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <span className="text-stone-600 text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis?.nextSteps && analysis.nextSteps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-stone-700 mb-3">Your Next Steps</h3>
              <ol className="space-y-2">
                {analysis.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-lime-700">{index + 1}</span>
                    </div>
                    <span className="text-stone-600 text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CollapsibleSection>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
        <div className="text-center mb-4">
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

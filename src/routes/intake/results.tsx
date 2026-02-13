import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Compass,
  Download,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  Puzzle,
  RefreshCw,
  Route as RouteIcon,
  Scale,
  Shield,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CareerMatchesTable } from "@/components/CareerMatchesTable";
import { analyzeAssessment } from "@/lib/analyzer";
import { DialogService } from "@/lib/dialogService";
import { getAvailableCounties } from "@/lib/occupationService";
import { RESOURCE_CATEGORIES, CATEGORY_COLOR_STYLES } from "@/data/resources";
import { useAssessmentStore, useHasHydrated, useIsResultsOutdated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Your Career Assessment Results | Compass Coaching" },
      { name: "description", content: "View your personalized career assessment results and recommendations." },
      { name: "robots", content: "noindex, nofollow" },
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
        {/* Light warm gradient */}
        <linearGradient id="resultsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fafaf9" />
          <stop offset="40%" stopColor="#f7fee7" />
          <stop offset="100%" stopColor="#ecfccb" />
        </linearGradient>

        {/* Lime accent gradient */}
        <linearGradient id="resultsAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#a3e635" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.25" />
        </linearGradient>

        {/* Secondary accent */}
        <linearGradient id="resultsAccent2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#65a30d" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#84cc16" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#65a30d" stopOpacity="0.2" />
        </linearGradient>

        {/* Filled swoosh gradient */}
        <linearGradient id="resultsSwooshFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#65a30d" stopOpacity="0.03" />
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
  const handleRetake = async () => {
    const confirmed = await DialogService.confirm({
      title: "Retake Assessment?",
      description:
        "This will permanently erase all of your current answers and results. You'll need to start the assessment from the beginning. Are you sure you want to continue?",
      confirmLabel: "Reset & Retake",
      cancelLabel: "Keep Results",
      intent: "warning",
    });
    if (!confirmed) return;
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
      learningStyle: ['Hands-on learner', 'Self-study reader', 'Visual/video learner', 'Classroom learner'][p.learning_style - 1] || undefined,
      stressTolerance: ['Thrives under pressure', 'Manages but prefers calm', 'Avoids high-stress', 'Depends on context'][p.stress_tolerance - 1] || undefined,
      techComfort: ['Tech enthusiast', 'Comfortable with tech', 'Struggles with tech', 'Prefers minimal screen time'][p.tech_comfort - 1] || undefined,
      conflictStyle: ['Direct & assertive', 'Compromise-seeking', 'Defers to process', 'Avoids confrontation'][p.conflict_resolution - 1] || undefined,
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
      motivation_driver: 'Purpose & Meaning',
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

  const degreeSummary = useMemo(() => {
    const degrees = storedResults?.basic?.degrees || [];
    const levelLabels: Record<string, string> = {
      certificate: "Certificate",
      associate: "Associate",
      bachelor: "Bachelor",
      master: "Master",
      doctorate: "Doctorate",
    };

    return degrees
      .filter((degree) => degree.name?.trim())
      .map((degree) => {
        const levelLabel = degree.level ? levelLabels[degree.level] : "";
        const gpa = degree.gpa ? ` (GPA ${degree.gpa})` : "";
        return { level: levelLabel, name: degree.name, gpa };
      });
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

    // Creativity vs Structure (new)
    if (v.creativity >= 4 && v.job_security >= 4) {
      tensions.push({
        values: ['Creativity', 'Job Security'],
        insight: 'Creative roles within stable industries (UX design, marketing in healthcare, content in government) give you both innovation and predictability.',
      });
    }

    // Independence vs Job Security (new)
    if (v.independence >= 4 && v.job_security >= 4) {
      tensions.push({
        values: ['Independence', 'Job Security'],
        insight: 'Remote-first companies, government consulting, and tenured academic roles offer autonomy with stability. Freelancing within a stable niche is another path.',
      });
    }

    // Environmental Impact vs Income (new)
    if (v.environmental_impact >= 4 && v.income_potential >= 4) {
      tensions.push({
        values: ['Environmental Impact', 'High Income'],
        insight: 'Green tech, renewable energy engineering, and ESG consulting are fast-growing fields where sustainability and strong salaries go hand in hand.',
      });
    }

    // Physical Activity vs Recognition (new)
    if (v.physical_activity >= 4 && v.recognition >= 4) {
      tensions.push({
        values: ['Physical Activity', 'Recognition'],
        insight: 'Trades supervisors, fitness directors, and sports medicine professionals combine active work with visible leadership and professional respect.',
      });
    }

    return tensions.slice(0, 3); // Max 3 tensions to keep it focused
  }, [storedResults]);

  // Generate challenge-aware guidance that goes beyond echoing answers
  const challengeGuidance = useMemo(() => {
    if (!storedResults?.challenges) return [];
    const c = storedResults.challenges;
    const guidance: Array<{ icon: typeof Lightbulb; label: string; tip: string }> = [];

    // Financial
    if (c.financial === 'limited-funds' || c.financial === 'need-financial-aid') {
      guidance.push({
        icon: Target,
        label: 'Finances',
        tip: 'PA offers free workforce training through CareerLink centers and community colleges often waive fees for qualifying residents. Apprenticeships let you earn while you learn — many of your top career matches have these paths.',
      });
    } else if (c.financial === 'working-while-learning') {
      guidance.push({
        icon: Target,
        label: 'Finances',
        tip: 'Many employers offer tuition reimbursement — ask your current employer before paying out of pocket. Evening and online programs from PA community colleges can fit around your work schedule.',
      });
    } else if (c.financial === 'some-savings') {
      guidance.push({
        icon: Target,
        label: 'Finances',
        tip: 'Stretch your savings by starting with low-cost credentials (certifications, community college credits) before committing to a full degree. PA state grants and FAFSA can supplement what you have.',
      });
    }

    // Time
    if (c.timeAvailability === 'very-limited') {
      guidance.push({
        icon: Clock,
        label: 'Time',
        tip: 'Even 30 minutes a day adds up. Focus on one micro-credential or certification at a time. Self-paced platforms like Coursera, edX, and LinkedIn Learning let you learn in small bursts that fit your schedule.',
      });
    } else if (c.timeAvailability === 'evenings-weekends') {
      guidance.push({
        icon: Clock,
        label: 'Time',
        tip: 'Many PA colleges offer evening and Saturday classes designed for working adults. Online certificate programs in your top career fields can often be completed in 3-6 months on a nights-and-weekends schedule.',
      });
    } else if (c.timeAvailability === 'part-time') {
      guidance.push({
        icon: Clock,
        label: 'Time',
        tip: 'With part-time hours, you can pursue accelerated programs or stack short certifications toward your goals. Consider hybrid programs that mix online self-study with occasional in-person sessions.',
      });
    }

    // Location
    if (c.locationFlexibility === 'local-only') {
      guidance.push({
        icon: MapPin,
        label: 'Location',
        tip: 'Your local area likely has more opportunities than you think. PA workforce development boards, community colleges, and libraries offer free career services. Remote-eligible roles in your matches also keep you local while broadening options.',
      });
    } else if (c.locationFlexibility === 'remote-preferred') {
      guidance.push({
        icon: MapPin,
        label: 'Location',
        tip: 'Remote work is growing fast in STEM, business, and communication fields. Build a strong online presence (LinkedIn, portfolio) and target companies with established remote cultures rather than temporary arrangements.',
      });
    }

    // Family obligations
    if (c.familyObligations === 'childcare' || c.familyObligations === 'elder-care' || c.familyObligations === 'both') {
      guidance.push({
        icon: Heart,
        label: 'Caregiving',
        tip: 'Careers with predictable schedules, remote options, and strong benefits will serve you well. Many employers increasingly value caregiving experience as leadership and organization skills — don\'t discount what you already do.',
      });
    }

    // Transportation
    if (c.transportation === 'limited' || c.transportation === 'none' || c.transportation === 'public-transit') {
      guidance.push({
        icon: MapPin,
        label: 'Transportation',
        tip: 'Prioritize remote-eligible roles from your career matches. For in-person positions, many PA counties offer reduced-fare transit programs. Some trade unions and larger employers provide transportation assistance for new hires.',
      });
    }

    // Health
    if (c.healthConsiderations === 'physical') {
      guidance.push({
        icon: Heart,
        label: 'Health',
        tip: 'Focus on desk-based or remote roles from your career matches. Employers must provide reasonable accommodations under ADA, and PA\'s Office of Vocational Rehabilitation offers free career services, training, and job placement support.',
      });
    } else if (c.healthConsiderations === 'mental-health') {
      guidance.push({
        icon: Heart,
        label: 'Wellbeing',
        tip: 'The right work environment makes a real difference. Seek employers with mental health benefits and flexible schedules. Roles with autonomy and low-pressure cultures often align well — many remote positions score high here.',
      });
    } else if (c.healthConsiderations === 'chronic-condition') {
      guidance.push({
        icon: Heart,
        label: 'Health',
        tip: 'Target employers with comprehensive health benefits — government, healthcare, and education sectors often lead here. Flexible and remote roles give you the ability to manage your condition alongside a fulfilling career.',
      });
    }

    // Education gaps
    if (c.educationGaps && c.educationGaps.length > 0 && !c.educationGaps.includes('None of the above')) {
      guidance.push({
        icon: BookOpen,
        label: 'Skill Gaps',
        tip: `You identified growth areas in ${c.educationGaps.slice(0, 2).join(' and ').toLowerCase()}. Free resources like Khan Academy, your local library, and PA CareerLink workshops can close these gaps quickly — often in weeks, not months.`,
      });
    }

    // Support system
    if (c.supportSystem === 'limited' || c.supportSystem === 'independent') {
      guidance.push({
        icon: Users,
        label: 'Support',
        tip: 'Building a professional network is a skill, not a personality trait. Start with one connection: a career counselor at PA CareerLink, a professional association meetup, or an online community in your top career field.',
      });
    }

    // Salary floor
    if (c.salaryMinimum) {
      const salaryLabels: Record<string, string> = {
        'under-25k': 'under $25K', '25k-40k': '$25-40K', '40k-60k': '$40-60K', '60k-80k': '$60-80K', '80k-plus': 'over $80K',
      };
      guidance.push({
        icon: Target,
        label: 'Salary Target',
        tip: `You indicated you need ${salaryLabels[c.salaryMinimum] || c.salaryMinimum} annually. Your career matches are filtered with this in mind — look for roles where PA median wages meet or exceed this floor.`,
      });
    }

    // Timeline urgency
    if (c.timelineUrgency === 'immediately') {
      guidance.push({
        icon: Clock,
        label: 'Timeline',
        tip: 'With an immediate need, prioritize careers with short entry paths — certifications, temp-to-hire roles, and positions that value transferable skills over formal education. PA CareerLink can connect you with employers hiring now.',
      });
    } else if (c.timelineUrgency === 'within-3-months') {
      guidance.push({
        icon: Clock,
        label: 'Timeline',
        tip: 'Three months gives you time for a focused sprint: complete a short certification, build a targeted resume, and apply strategically. Avoid committing to long programs until you\'re settled.',
      });
    } else if (c.timelineUrgency === 'within-a-year') {
      guidance.push({
        icon: Clock,
        label: 'Timeline',
        tip: 'A year is enough time for meaningful preparation — certificate programs, associate degree credits, or building a portfolio. Use the first month to research, then commit to a concrete plan.',
      });
    }

    return guidance;
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

  // Set of recommended resource slugs for highlighting
  const recommendedSlugs = useMemo(() => {
    return new Set(recommendedResources.map(r => r.slug));
  }, [recommendedResources]);

  // Show loading while store is hydrating or results are being processed
  if (!hasHydrated || !storedResults || !analysis) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-stone-100">
      {/* Hero Section - Light & Warm */}
      <div className="relative overflow-hidden">
        {/* Pattern extends behind hero and profile card */}
        <div className="absolute inset-0">
          <ResultsPattern />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 pt-12 md:pt-16 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full border border-white/60 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.95)]">
              <Award className="w-10 h-10 text-lime-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Your Career Assessment Results
            </h1>
            <p className="text-xl text-stone-600 mb-2">
              Hi {storedResults.basic.name}! Here's your personalized career insights.
            </p>
            <p className="text-sm text-stone-400">
              Completed on{" "}
              {new Date(storedResults.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </Container>

        {/* Profile at a Glance */}
        <Container className="relative z-10 px-6 pb-12">
          {/* Migration Warning Banner */}
          {isOutdated && (
            <div className="mb-8 bg-stone-100 rounded-2xl overflow-hidden border border-white/50 shadow-[4px_4px_10px_rgba(0,0,0,0.08),-4px_-4px_10px_rgba(255,255,255,0.9)] print-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center shrink-0 shadow-[2px_2px_5px_rgba(0,0,0,0.08),-2px_-2px_5px_rgba(255,255,255,0.9)]">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800">A Better Assessment Is Here</h3>
                      <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                        We've added new questions for more accurate career matching — including learning style,
                        tech comfort, and salary alignment. Retake it to unlock improved results.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    className="shrink-0 bg-amber-500 hover:bg-amber-600 shadow-[2px_2px_5px_rgba(0,0,0,0.12),-2px_-2px_5px_rgba(255,255,255,0.8)]"
                    onClick={handleRetake}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </div>
          )}

          <section className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div className="bg-stone-100 rounded-2xl p-6 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center shadow-[2px_2px_6px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.9)]">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">Your Profile at a Glance</h3>
                    <p className="text-sm text-stone-500">Based on your assessment responses</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {/* Top Aptitudes */}
                  <div className="bg-purple-50/40 rounded-xl p-5 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/60">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-purple-100/80 rounded-lg flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                        <Puzzle className="w-4 h-4 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-stone-800">Top Aptitudes</h4>
                    </div>
                    <div className="space-y-3">
                      {topAptitudes.map((apt, i) => (
                        <div key={apt.cluster}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-700">
                              {i + 1}. {clusterNames[apt.cluster] || apt.cluster}
                            </span>
                            <span className="text-sm font-bold text-purple-700">{apt.score}%</span>
                          </div>
                          <div className="w-full bg-purple-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${apt.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Values */}
                  <div className="bg-pink-50/40 rounded-xl p-5 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/60">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-pink-100/80 rounded-lg flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                        <Heart className="w-4 h-4 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-stone-800">What Matters Most</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topValues.map((value) => (
                        <span
                          key={value.label}
                          className={`inline-flex items-center text-xs px-2.5 py-1.5 rounded-full font-medium ${
                            value.isTop
                              ? 'bg-pink-100 text-pink-700 border border-pink-300'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {value.isTop && <Star className="w-3 h-3 mr-1" />}
                          {value.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education & Status */}
                  <div className="bg-lime-50/40 rounded-xl p-5 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/60">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-lime-100/80 rounded-lg flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                        <GraduationCap className="w-4 h-4 text-lime-700" />
                      </div>
                      <h4 className="font-semibold text-stone-800">Current Situation</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Education</span>
                        <p className="text-sm font-semibold text-stone-800">
                          {storedResults.basic.educationLevel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                      </div>
                      {degreeSummary.length > 0 && (
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Degrees & Certifications</span>
                          <div className="mt-1 space-y-1">
                            {degreeSummary.map((degree, index) => (
                              <p key={`${degree.name}-${index}`} className="text-sm text-stone-700 leading-snug">
                                {degree.level ? (
                                  <><span className="font-semibold">{degree.level}:</span> {degree.name}{degree.gpa}</>
                                ) : (
                                  <>{degree.name}{degree.gpa}</>
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Employment</span>
                        <p className="text-sm font-semibold text-stone-800">
                          {storedResults.basic.employmentStatus.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
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
              fill="#f5f5f4"
            />
            <path
              d="M0 40 Q200 60 400 30 Q600 0 800 20 Q1000 40 1200 10"
              fill="none"
              stroke="#a3e635"
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <Container className="py-8 md:py-12 px-6">

        {/* Top Career Fields - Compact Display */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-lime-600" />
            <h2 className="text-2xl font-bold text-stone-700">
              Your Top Career Fields
            </h2>
          </div>
          <div className="bg-stone-100 rounded-2xl border border-white/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] p-4">
              <div className="space-y-3">
                {analysis?.topCareerFields.map((field, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      index === 0 ? 'bg-lime-50/80 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] border border-lime-200/50' : 'bg-stone-50/60 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.04),inset_-1px_-1px_3px_rgba(255,255,255,0.6)]'
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
          </div>
        </section>

        {/* Career Matches Section - Primary Content */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-stone-700">
              Your Personalized Career Matches
            </h2>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-3 mb-4 text-sm shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-blue-100/60">
            <p className="text-blue-800">
              <strong>How we match:</strong> Based on your aptitudes, work style, and values.
              Scores of 60%+ indicate strong alignment.
            </p>
          </div>

          {/* County Filter */}
          <div className="mb-4 flex items-center gap-3 flex-wrap print-hidden">
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
          {/* Print-only county indicator */}
          <p className="print-only text-sm text-stone-600 mb-4">
            Showing salaries for: {selectedCounty === 'All' ? 'All Pennsylvania (Statewide)' : `${selectedCounty} County`}
          </p>

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

        {/* How You Work Best */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-700">How You Work Best</h2>
          </div>

          {workStyleProfile && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Environment', value: workStyleProfile.environment, icon: Briefcase, iconColor: 'text-lime-600', tint: 'bg-lime-50/60', accent: 'border-l-lime-400' },
                { label: 'Interaction', value: workStyleProfile.interaction, icon: Users, iconColor: 'text-purple-600', tint: 'bg-purple-50/60', accent: 'border-l-purple-400' },
                { label: 'Structure', value: workStyleProfile.structure, icon: Target, iconColor: 'text-green-600', tint: 'bg-green-50/60', accent: 'border-l-green-400' },
                { label: 'Work Pace', value: workStyleProfile.pace, icon: Clock, iconColor: 'text-orange-600', tint: 'bg-orange-50/60', accent: 'border-l-orange-400' },
                { label: 'Decisions', value: workStyleProfile.decisionStyle, icon: Lightbulb, iconColor: 'text-amber-600', tint: 'bg-amber-50/60', accent: 'border-l-amber-400' },
                { label: 'Energy From', value: workStyleProfile.energySource, icon: Zap, iconColor: 'text-pink-600', tint: 'bg-pink-50/60', accent: 'border-l-pink-400' },
              ].filter((item) => item.value).map((item) => (
                <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl ${item.tint} border-l-[3px] ${item.accent} border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]`}>
                  <div className="shrink-0 w-9 h-9 bg-white/80 rounded-lg flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.06),-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60">
                    <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400 block">{item.label}</span>
                    <span className="text-sm font-semibold text-stone-700">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Work Style Details */}
          {workStyleProfile && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Learning', value: workStyleProfile.learningStyle, icon: BookOpen, iconColor: 'text-blue-600', tint: 'bg-blue-50/60', accent: 'border-l-blue-400' },
                { label: 'Stress', value: workStyleProfile.stressTolerance, icon: Shield, iconColor: 'text-red-600', tint: 'bg-red-50/60', accent: 'border-l-red-400' },
                { label: 'Technology', value: workStyleProfile.techComfort, icon: Zap, iconColor: 'text-cyan-600', tint: 'bg-cyan-50/60', accent: 'border-l-cyan-400' },
                { label: 'Conflict', value: workStyleProfile.conflictStyle, icon: Users, iconColor: 'text-rose-600', tint: 'bg-rose-50/60', accent: 'border-l-rose-400' },
              ].filter((item) => item.value).map((item) => (
                <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl ${item.tint} border-l-[3px] ${item.accent} border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]`}>
                  <div className="shrink-0 w-9 h-9 bg-white/80 rounded-lg flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.06),-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60">
                    <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400 block">{item.label}</span>
                    <span className="text-sm font-semibold text-stone-700">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {analysis?.personalityInsights && analysis.personalityInsights.length > 0 && (
            <div className="bg-amber-50/30 rounded-xl p-4 border-l-[3px] border-l-amber-400 border border-white/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Personality Insights</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {analysis.personalityInsights.map((insight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-stone-800 shrink-0">•</span>
                    <span className="text-stone-600">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Key Insights */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-700">Key Insights</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {ageInsights && (
              <div className="p-5 bg-indigo-50/50 rounded-xl border-l-[3px] border-l-indigo-400 border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-stone-800 text-sm">{ageInsights.title}</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{ageInsights.message}</p>
              </div>
            )}

            {reasonMessage && (
              <div className="p-5 bg-violet-50/50 rounded-xl border-l-[3px] border-l-violet-400 border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold text-stone-800 text-sm">Why You're Here</h3>
                </div>
                <blockquote className="text-stone-600 italic text-sm leading-relaxed">
                  "{reasonMessage.message}"
                </blockquote>
              </div>
            )}

            {valueTensions.map((tension, index) => (
              <div key={index} className="p-5 bg-cyan-50/50 rounded-xl border-l-[3px] border-l-cyan-400 border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Scale className="w-4 h-4 text-cyan-600" />
                  {tension.values.map((v, i) => (
                    <span key={v}>
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">
                        {v}
                      </span>
                      {i < tension.values.length - 1 && <span className="text-stone-400 mx-1">+</span>}
                    </span>
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{tension.insight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigating Your Challenges */}
        {challengeGuidance.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-linear-to-br from-amber-500 to-orange-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-700">Navigating Your Challenges</h2>
                <p className="text-sm text-stone-500">Practical guidance tailored to your situation</p>
              </div>
            </div>

            {storedResults?.challenges?.additionalNotes && storedResults.challenges.additionalNotes.trim() !== '' && (
              <div className="mb-4 p-4 bg-amber-50/40 rounded-xl border-l-[3px] border-l-amber-300 border border-white/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-stone-700 text-sm">You mentioned</span>
                </div>
                <p className="text-stone-600 text-sm italic">"{storedResults.challenges.additionalNotes}"</p>
              </div>
            )}

            <div className="space-y-3">
              {challengeGuidance.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-amber-50/40 rounded-xl border-l-[3px] border-l-amber-400 border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]">
                    <div className="shrink-0">
                      <div className="w-9 h-9 bg-amber-100/80 rounded-lg flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.06),-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60">
                        <IconComponent className="w-4 h-4 text-amber-700" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">{item.label}</span>
                      <p className="text-stone-700 text-sm leading-relaxed mt-0.5">{item.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Your Next Steps */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
              <RouteIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-700">Your Next Steps</h2>
          </div>

          <div className="space-y-3">
            {analysis?.nextSteps && analysis.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-emerald-50/40 rounded-xl border-l-[3px] border-l-emerald-400 border border-white/50 shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]">
                <div className="shrink-0 w-8 h-8 bg-emerald-100/80 rounded-full flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.06),-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60">
                  <span className="text-sm font-bold text-lime-700">{index + 1}</span>
                </div>
                <span className="text-stone-700 text-sm pt-1.5 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Resources - Prominent Section */}
        <section className="mb-16 bg-stone-100 rounded-2xl p-6 md:p-8 border border-white/50 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-50 rounded-full border border-white/60 shadow-[3px_3px_7px_rgba(0,0,0,0.08),-3px_-3px_7px_rgba(255,255,255,0.9)] mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">Explore Resources</h2>
            <p className="text-stone-500 text-sm mt-1">Curated categories to support your journey</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {RESOURCE_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const colors = CATEGORY_COLOR_STYLES[cat.color];
              const isRecommended = recommendedSlugs.has(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  to="/resources/$categorySlug"
                  params={{ categorySlug: cat.slug }}
                  className={`group relative block p-4 rounded-xl border-l-[3px] border border-white/50 transition-all hover:shadow-[5px_5px_12px_rgba(0,0,0,0.1),-5px_-5px_12px_rgba(255,255,255,0.95)] hover:scale-[1.02] ${colors.bg} shadow-[3px_3px_7px_rgba(0,0,0,0.07),-3px_-3px_7px_rgba(255,255,255,0.9)]`}
                  style={{ borderLeftColor: `rgb(${colors.accent})` }}
                >
                  {isRecommended && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-lime-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                      For You
                    </span>
                  )}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colors.iconBg} border border-white/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]`}>
                    <CatIcon className={`w-4 h-4 ${colors.iconText}`} />
                  </div>
                  <h4 className="font-semibold text-stone-700 text-sm leading-tight mb-1 group-hover:text-stone-900">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-snug">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Actions - Hidden in print */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 print-hidden">
          <Button
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Download Results (PDF)
          </Button>
        </div>

        {/* Retake Assessment - Hidden in print */}
        <div className="text-center mb-6 print-hidden">
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-8 p-4 bg-stone-100 border border-white/50 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] text-sm">
          <p className="text-stone-600 leading-relaxed mb-2">
            <strong className="text-stone-700">Important:</strong> These results are for informational purposes only and
            are not professional career counseling or employment advice. Career matches are suggestions based on
            self-reported data and should not be treated as definitive guidance. We recommend consulting with a
            licensed career counselor or advisor before making significant career or educational decisions.
          </p>
          <p className="text-stone-500 text-xs">
            By using this assessment, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Print-only footer */}
        <div className="print-only text-center mt-8 pt-4 border-t border-stone-200">
          <p className="text-xs text-stone-500 mb-2">
            For informational purposes only. Not professional career counseling. Consult a licensed advisor before making career decisions.
          </p>
          <p className="text-sm text-stone-600">
            Generated from compasscoachingpa.org
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Visit compasscoachingpa.org for updated career matches and personalized resources.
          </p>
        </div>
      </Container>
    </div>
  );
}

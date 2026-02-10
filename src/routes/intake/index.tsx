import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle,
  Clock,
  Compass,
  Heart,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentProgress } from "@/hooks";
import { useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/")({
  component: IntakePage,
  head: () => ({
    meta: [
      { title: "Free Career Assessment | Compass Coaching" },
      { name: "description", content: "Take our comprehensive 5-section career assessment covering personality, values, aptitudes, and challenges. Get personalized career recommendations and life guidance resources. 100% free." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Free Career & Life Assessment" },
      { property: "og:description", content: "Discover career paths matched to your personality, values, and goals. 100% free, takes about 10 minutes." },
      { property: "og:url", content: "https://compasscoachingpa.org/intake" },
      { property: "og:site_name", content: "Compass Coaching" },
      { property: "og:image", content: "https://compasscoachingpa.org/discord-icon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Career & Life Assessment | Compass Coaching" },
      { name: "twitter:description", content: "Discover career paths matched to your personality, values, and goals. 100% free." },
      { name: "keywords", content: "free career assessment, career aptitude test, personality career match, career guidance quiz, find your career path" },
    ],
    links: [{ rel: "canonical", href: "https://compasscoachingpa.org/intake" }],
  }),
});

function IntakePage() {
  const hasHydrated = useHasHydrated();
  const progress = useAssessmentProgress();
  // Only show "Continue" if hydrated and has progress
  const hasStarted = hasHydrated && progress.percentComplete > 0;
  const buttonText = hasStarted ? "Continue Assessment" : "Start Assessment";
  const buttonDestination = hasHydrated ? progress.nextSection : "/intake/basic";

  const sections = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Basic Information",
      description: "Tell us about your current situation and goals",
      duration: "2 minutes",
      questions: 5,
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personality & Work Style",
      description:
        "Discover your work environment and collaboration preferences",
      duration: "5 minutes",
      questions: 8,
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Values Assessment",
      description: "Rate what matters most to you in a career",
      duration: "4 minutes",
      questions: 12,
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Aptitude & Interests",
      description: "Rate your interest in 8 career fields",
      duration: "8 minutes",
      questions: 32,
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Challenges & Constraints",
      description: "Share obstacles that may impact your career path",
      duration: "3 minutes",
      questions: 9,
    },
  ];

  const benefits = [
    "Get personalized career matches based on your unique profile",
    "Discover educational paths that align with your goals",
    "Receive customized resource recommendations",
    "Create an actionable plan for your future",
    "Track your progress over time",
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <section className="py-16 md:py-24 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container size="sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <Compass className="w-8 h-8 text-stone-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-700 mb-4">
              Career Assessment
            </h1>
            <p className="text-xl text-stone-600 mb-6">
              Take 20-25 minutes to discover your ideal career path
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge size="md" variant="primary">
                <Clock className="w-4 h-4" />
                20-25 minutes
              </Badge>
              <Badge size="md" variant="primary">
                66 questions
              </Badge>
              <Badge size="md" variant="success">
                Free
              </Badge>
            </div>
          </div>

          <Card variant="elevated" className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-stone-700 mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                  <span className="text-stone-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="text-center">
            <Link
              to={buttonDestination}
              className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-lime-400 text-stone-700 hover:bg-lime-500 active:bg-lime-600 focus:ring-lime-400 px-6 py-3 text-lg mb-4"
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-stone-500">
              {hasStarted
                ? `${Math.round(progress.percentComplete)}% complete - Pick up where you left off`
                : "You can save your progress and resume anytime"}
            </p>
          </div>
        </Container>
      </section>

      {/* Assessment Overview */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">
              Assessment Sections
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Our comprehensive assessment covers five key areas to help us
              understand you better.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sections.map((section) => (
              <Card
                key={section.title}
                variant="outlined"
                className="hover:border-lime-300 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4 text-lime-700">
                    {section.icon}
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 mb-4">{section.description}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {section.duration}
                    </span>
                    <span>{section.questions} questions</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Results Card */}
            <Card variant="outlined" className="bg-lime-50 border-lime-300">
              <CardHeader>
                <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4 text-stone-700">
                  <Compass className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">Your Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 mb-4">
                  Receive personalized career matches and recommended next steps
                </p>
                <div className="flex items-center gap-4 text-sm text-stone-600">
                  <span>Instant results</span>
                  <span>Download PDF</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <Container size="sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center shrink-0 text-stone-700 font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Answer Honestly
                </h3>
                <p className="text-stone-600">
                  There are no right or wrong answers. Choose what feels most
                  natural to you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center shrink-0 text-stone-700 font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Save Your Progress
                </h3>
                <p className="text-stone-600">
                  Create a free account to save your answers and resume later if
                  needed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center shrink-0 text-stone-700 font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Get Your Results
                </h3>
                <p className="text-stone-600">
                  Receive personalized career matches, resource recommendations,
                  and next steps.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-linear-to-br from-lime-400 to-lime-500">
        <Container size="sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-stone-700 mb-8">
              Your journey to clarity begins with one assessment.
            </p>
            <Link
              to={buttonDestination}
              className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-stone-200 text-stone-700 hover:bg-stone-300 active:bg-stone-400 focus:ring-stone-300 px-6 py-3 text-lg"
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

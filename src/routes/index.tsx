import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentProgress } from "@/hooks";

// Geometric Pattern Background Component
function GeometricPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="rgba(163, 230, 53, 0.15)" />
          </pattern>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#0f172a", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#1e3a8a", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Background gradient */}
        <rect width="100%" height="100%" fill="url(#heroGradient)" />

        {/* Dot pattern overlay */}
        <rect width="100%" height="100%" fill="url(#dots)" opacity="0.5" />

        {/* Starfield - looking up at the night sky */}
        {/* Bright stars */}
        <g>
          <circle cx="15%" cy="18%" r="2.5" fill="rgba(255, 255, 255, 0.9)" />
          <circle cx="82%" cy="25%" r="2.2" fill="rgba(255, 255, 255, 0.85)" />
          <circle cx="45%" cy="35%" r="2" fill="rgba(255, 255, 255, 0.8)" />
          <circle cx="68%" cy="48%" r="2.3" fill="rgba(255, 255, 255, 0.9)" />
          <circle cx="25%" cy="62%" r="2" fill="rgba(255, 255, 255, 0.85)" />
          <circle cx="88%" cy="70%" r="2.2" fill="rgba(255, 255, 255, 0.8)" />
          <circle cx="52%" cy="78%" r="2.5" fill="rgba(255, 255, 255, 0.9)" />
        </g>

        {/* Medium stars */}
        <g>
          <circle cx="8%" cy="12%" r="1.5" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="28%" cy="22%" r="1.3" fill="rgba(163, 230, 53, 0.6)" />
          <circle cx="55%" cy="15%" r="1.4" fill="rgba(255, 255, 255, 0.65)" />
          <circle cx="92%" cy="32%" r="1.5" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="18%" cy="38%" r="1.4" fill="rgba(163, 230, 53, 0.6)" />
          <circle cx="72%" cy="28%" r="1.3" fill="rgba(255, 255, 255, 0.65)" />
          <circle cx="38%" cy="52%" r="1.5" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="62%" cy="58%" r="1.4" fill="rgba(163, 230, 53, 0.6)" />
          <circle cx="12%" cy="72%" r="1.5" fill="rgba(255, 255, 255, 0.65)" />
          <circle cx="78%" cy="82%" r="1.3" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="35%" cy="88%" r="1.4" fill="rgba(163, 230, 53, 0.6)" />
          <circle cx="48%" cy="65%" r="1.5" fill="rgba(255, 255, 255, 0.65)" />
        </g>

        {/* Small distant stars */}
        <g>
          <circle cx="5%" cy="25%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="22%" cy="15%" r="0.8" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="42%" cy="20%" r="0.9" fill="rgba(163, 230, 53, 0.4)" />
          <circle cx="65%" cy="18%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="85%" cy="15%" r="0.8" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="95%" cy="22%" r="0.9" fill="rgba(163, 230, 53, 0.4)" />
          <circle cx="12%" cy="45%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="32%" cy="42%" r="0.8" fill="rgba(163, 230, 53, 0.4)" />
          <circle cx="58%" cy="38%" r="0.9" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="75%" cy="55%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="90%" cy="48%" r="0.8" fill="rgba(163, 230, 53, 0.4)" />
          <circle cx="8%" cy="58%" r="0.9" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="28%" cy="75%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="48%" cy="85%" r="0.8" fill="rgba(163, 230, 53, 0.4)" />
          <circle cx="70%" cy="68%" r="0.9" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="85%" cy="85%" r="1" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="92%" cy="75%" r="0.8" fill="rgba(255, 255, 255, 0.45)" />
          <circle cx="15%" cy="85%" r="0.9" fill="rgba(163, 230, 53, 0.4)" />
        </g>

        {/* Tiny stars for depth */}
        <g>
          <circle cx="18%" cy="8%" r="0.6" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="35%" cy="12%" r="0.5" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="60%" cy="8%" r="0.6" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="78%" cy="12%" r="0.5" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="25%" cy="28%" r="0.6" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="50%" cy="25%" r="0.5" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="88%" cy="38%" r="0.6" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="8%" cy="48%" r="0.5" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="42%" cy="48%" r="0.6" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="65%" cy="42%" r="0.5" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="20%" cy="55%" r="0.6" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="82%" cy="62%" r="0.5" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="55%" cy="72%" r="0.6" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="38%" cy="68%" r="0.5" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="72%" cy="78%" r="0.6" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="15%" cy="92%" r="0.5" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="45%" cy="95%" r="0.6" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="68%" cy="92%" r="0.5" fill="rgba(163, 230, 53, 0.3)" />
          <circle cx="88%" cy="95%" r="0.6" fill="rgba(255, 255, 255, 0.35)" />
        </g>
      </svg>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "Compass Coaching - Free Career & Life Guidance Assessment",
      },
      {
        name: "description",
        content:
          "Navigate your career and life with our free assessment. Access 90+ resources for career exploration, mental wellbeing, financial aid, and personal growth. Helping 1000+ individuals find their path.",
      },
    ],
  }),
});

function HomePage() {
  const progress = useAssessmentProgress();
  const hasStarted = progress.percentComplete > 0;
  // For new users, go to intake intro page. For returning users, go directly to next section.
  const assessmentDestination = hasStarted ? progress.nextSection : "/intake";

  const features = [
    {
      icon: <Compass className="w-12 h-12 text-lime-400" />,
      title: "Find Your Direction",
      description:
        "Take our comprehensive assessment to discover career paths that align with your personality, values, and goals.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-lime-400" />,
      title: "Access Free Resources",
      description:
        "Explore our library of career and life guidance resources—from resume building to mental wellbeing and healthy living.",
    },
    {
      icon: <Target className="w-12 h-12 text-lime-400" />,
      title: "Create Your Plan",
      description:
        "Build a personalized action plan with clear steps to achieve your professional and personal goals.",
    },
    {
      icon: <Users className="w-12 h-12 text-lime-400" />,
      title: "Get Expert Guidance",
      description:
        "Connect with experienced coaches who can provide personalized support for your career and life journey.",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-lime-400" />,
      title: "Track Your Progress",
      description:
        "Monitor your journey with our dashboard and celebrate milestones as you work toward your future.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-lime-400" />,
      title: "Whole-Person Support",
      description:
        "Beyond careers—find resources for mental wellbeing, building relationships, and living a healthier life.",
    },
  ];

  const stats = [
    { value: "90+", label: "Free Resources" },
    { value: "15+", label: "Career Paths" },
    { value: "5-Min", label: "Quick Start" },
    { value: "100%", label: "Free Forever" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section with Geometric Pattern */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <GeometricPattern />

        {/* Content overlay */}
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Compass Icon with animation */}
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-xl p-3">
              <Compass className="w-full h-full text-lime-600 animate-compass" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Navigate Your{" "}
              <span className="text-lime-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Discover your path with personalized career and life guidance,
              free resources, and expert support—no matter your starting point.
            </p>
            <p className="text-base md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              A donation-funded non-profit dedicated to helping those who need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={assessmentDestination}
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-lime-700 hover:bg-lime-50 focus:ring-white shadow-xl hover:shadow-2xl hover:scale-105 transform px-8 py-4 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm focus:ring-white px-8 py-4 text-lg"
              >
                Browse Resources
              </Link>
            </div>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 md:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 C300,90 600,10 900,50 C1050,70 1150,70 1200,50 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-stone-50 via-blue-50/40 to-stone-50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-4 md:p-6 rounded-xl bg-white border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-700 mb-2 leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-slate-600 font-medium leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              How Compass Coaching Works
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              A simple three-step process to help you discover your direction
              and build a fulfilling life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              variant="outlined"
              className="text-center p-8 hover:border-lime-400 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-linear-to-br from-lime-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">
                Discover
              </h3>
              <p className="text-stone-600">
                Complete our assessment to understand your personality, values,
                and career aptitudes.
              </p>
            </Card>

            <Card
              variant="outlined"
              className="text-center p-8 hover:border-teal-400 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">
                Explore
              </h3>
              <p className="text-stone-600">
                Access personalized resources and guidance tailored to your
                unique career path and life goals.
              </p>
            </Card>

            <Card
              variant="outlined"
              className="text-center p-8 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">
                Achieve
              </h3>
              <p className="text-stone-600">
                Take action with your personalized plan and get support from our
                coaches along the way.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to support your career and
              personal growth journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="outlined"
                className="hover:border-lime-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-lime-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Gradient background with geometric elements */}
        <div className="absolute inset-0 bg-linear-to-br from-lime-400 via-teal-500 to-cyan-600">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cta-dots"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.2)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />

            {/* Decorative triangles */}
            <polygon
              points="10%,20% 15%,35% 5%,35%"
              fill="rgba(255, 255, 255, 0.1)"
            />
            <polygon
              points="88%,60% 95%,80% 81%,80%"
              fill="rgba(255, 255, 255, 0.08)"
            />
            <polygon
              points="50%,10% 54%,18% 46%,18%"
              fill="rgba(255, 255, 255, 0.12)"
            />
          </svg>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full animate-pulse-slow">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Ready to Find Your Path?
            </h2>
            <p className="text-lg text-white mb-8 max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Start your journey today with our free assessment. Discover your
              career path and build a life you love. Completely free—powered by donations
              from people who believe everyone deserves a chance to thrive.
            </p>
            <Link
              to={assessmentDestination}
              className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-lime-700 hover:bg-lime-50 focus:ring-white shadow-xl hover:shadow-2xl hover:scale-105 transform px-8 py-4 text-lg"
            >
              Start Your Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

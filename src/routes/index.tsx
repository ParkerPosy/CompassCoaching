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
import { HOME_SEO } from "@/lib/seo";

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
        title: HOME_SEO.titleShort,
      },
      {
        name: "description",
        content: HOME_SEO.description,
      },
      // Open Graph tags for social media
      {
        property: "og:title",
        content: HOME_SEO.ogTitle,
      },
      {
        property: "og:description",
        content: HOME_SEO.ogDescription,
      },
      {
        property: "og:type",
        content: "website",
      },
      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: HOME_SEO.ogTitle,
      },
      {
        name: "twitter:description",
        content: HOME_SEO.ogDescription,
      },
      // Keywords for older search engines
      {
        name: "keywords",
        content: "Pennsylvania career guidance, free career assessment, life guidance PA, personalized coaching, career resources Pennsylvania, mental wellbeing, career and life support",
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
      icon: <Compass className="w-8 h-8 text-blue-600" />,
      title: "Personalized Assessment",
      description:
        "Take our comprehensive 5-step assessment covering personality, values, aptitudes, and goals to discover your unique path forward.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Tailored Resources",
      description:
        "Get matched to the right resources from our library of 90+ guides, tools, and articles for career growth and life wellbeing.",
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Career & Life Support",
      description:
        "Beyond job search: find guidance for mental wellbeing, relationships, salary negotiation, and building your best life.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Local to Pennsylvania",
      description:
        "Resources and insights tailored to Pennsylvania across all 67 counties, including occupation data specific to your region.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Track Your Journey",
      description:
        "See your progress through the assessment and watch as you move closer to clarity on your career and life direction.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Whole-Person Approach",
      description:
        "Career success and life wellbeing go together. Access resources for professional growth, mental health, relationships, and healthy living.",
    },
  ];

  const stats = [
    { value: "90+", label: "Free Resources" },
    { value: "5-Step", label: "Assessment" },
    { value: "810+", label: "PA Careers" },
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
            {/* Compass Icon in Keystone shape - matching favicon */}
            <div className="mb-6 inline-flex items-center justify-center">
              <svg className="w-36 h-36 drop-shadow-xl" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="white"
                  stroke="#65a30d"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
                />
                <g
                  className="animate-compass"
                  style={{ transformOrigin: '122.5px 127.5px' }}
                >
                  {/* Lime (NE half): full needle underneath */}
                  <path
                    d="M97 113 Q100 103 110 100 L170 80 L148 142 Q145 152 136 155"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Cyan (SW half): overlaps at exact midpoints */}
                  <path
                    d="M144 150 Q140.5 153.5 136 155 L75 175 L97 113 Q98.5 108 102 105"
                    fill="none"
                    stroke="#164e63"
                    strokeWidth="15"
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Navigate Your{" "}
              <span className="text-lime-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-4 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Personalized career and life guidance for all Pennsylvanians. Discover your path through our free assessment.
            </p>
            <p className="text-base md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {HOME_SEO.heroSubheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={assessmentDestination}
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-lime-700 hover:bg-lime-50 focus:ring-white shadow-xl hover:shadow-2xl hover:scale-105 transform px-8 py-4 text-lg"
              >
                Start Free Assessment
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
      <section className="py-16 bg-linear-to-b from-stone-50 via-blue-50/40 to-stone-50">
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
      <section className="py-16 md:py-24 px-6 bg-linear-to-b from-white to-blue-50/30">
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
                className="hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-700 transition-colors text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 leading-relaxed text-center">
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
        {/* Abstract flowing background inspired by organic shapes */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMin slice"
          >
            <defs>
              {/* Main gradient background - darker teal for better contrast */}
              <linearGradient id="ctaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>

              {/* Lime accent gradient - more saturated */}
              <linearGradient id="limeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#65a30d" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#84cc16" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#a3e635" stopOpacity="0.5" />
              </linearGradient>

              {/* Teal flowing gradient */}
              <linearGradient id="tealFlow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.3" />
              </linearGradient>

              {/* White accent gradient */}
              <linearGradient id="whiteFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>

              {/* Center darkening for text contrast */}
              <radialGradient id="centerDark" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0f766e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base background */}
            <rect width="100%" height="100%" fill="url(#ctaBg)" />

            {/* Teal wave - subtle background depth */}
            <path
              d="M-100,80 C150,120 300,180 500,160 C700,140 900,60 1300,20"
              fill="none"
              stroke="url(#tealFlow)"
              strokeWidth="120"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* Large lime shape - main trending up curve (dip then rise) */}
            <path
              d="M-200,280 C0,320 150,380 350,360 C550,340 650,280 800,200 C950,120 1100,80 1400,20"
              fill="none"
              stroke="url(#limeFlow)"
              strokeWidth="160"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Secondary lime flow - parallel trending up */}
            <path
              d="M-150,350 C50,400 200,460 400,440 C600,420 750,340 900,260 C1050,180 1200,120 1450,60"
              fill="none"
              stroke="url(#limeFlow)"
              strokeWidth="100"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* Center overlay for text contrast */}
            <rect width="100%" height="100%" fill="url(#centerDark)" />

            {/* White accent line 1 - main trending up stroke */}
            <path
              d="M-80,300 C80,340 200,400 380,380 C560,360 680,280 820,200 C960,120 1100,80 1280,30"
              fill="none"
              stroke="url(#whiteFlow)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* White accent line 2 - inner parallel */}
            <path
              d="M-40,260 C120,290 220,340 380,330 C540,320 680,260 800,190 C920,120 1050,90 1220,50"
              fill="none"
              stroke="url(#whiteFlow)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* White accent line 3 - subtle outer glow */}
            <path
              d="M-120,340 C60,390 200,470 420,440 C640,410 780,310 920,220 C1060,130 1180,90 1350,40"
              fill="none"
              stroke="url(#whiteFlow)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Lower teal depth layer 1 - sweeping wave */}
            <path
              d="M-200,480 C100,440 300,500 550,460 C800,420 950,380 1200,340 C1350,310 1450,350 1500,320"
              fill="none"
              stroke="url(#tealFlow)"
              strokeWidth="100"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* Lower teal depth layer 2 - deeper subtle wave */}
            <path
              d="M-150,550 C150,520 350,580 600,540 C850,500 1000,440 1250,400 C1400,370 1500,410 1550,380"
              fill="none"
              stroke="url(#tealFlow)"
              strokeWidth="80"
              strokeLinecap="round"
              opacity="0.15"
            />

            {/* Lower white accent - subtle depth indicator */}
            <path
              d="M-100,420 C100,400 280,440 480,410 C680,380 850,340 1050,300 C1200,270 1300,290 1400,260"
              fill="none"
              stroke="url(#whiteFlow)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Organic flowing top edge - wavy cutout that matches page background */}
            <path
              d="M-10,-10 L-10,30 Q200,60 450,35 Q750,5 1000,40 Q1150,55 1210,25 L1210,-10 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/25 backdrop-blur-sm rounded-full animate-pulse-slow border border-white/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Ready to Find Your Path?
            </h2>
            <p className="text-lg text-white mb-8 max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Start your journey today with our free assessment. Discover your
              career path and build a life you love. Completely free, powered by donations
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

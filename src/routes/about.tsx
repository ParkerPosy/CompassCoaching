import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Heart, Linkedin, Users, Sparkles, Target, MessageCircle, Palette, Dumbbell } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HOSTNAME = "https://compasscoachingpa.org";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Compass Coaching" },
      { name: "description", content: "Meet the team behind Compass Coaching. Free career and life guidance for Pennsylvania residents, founded on the belief that everyone deserves support finding their path." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "About Compass Coaching" },
      { property: "og:description", content: "Meet the team behind Compass Coaching. Free career and life guidance for Pennsylvania residents." },
      { property: "og:url", content: `${HOSTNAME}/about` },
      { property: "og:site_name", content: "Compass Coaching" },
      { property: "og:image", content: `${HOSTNAME}/discord-icon.png` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About Compass Coaching" },
      { name: "twitter:description", content: "Meet the team behind Compass Coaching. Free career and life guidance for Pennsylvania residents." },
    ],
    links: [{ rel: "canonical", href: `${HOSTNAME}/about` }],
  }),
});

// Swoosh pattern for about page - warm violet theme for founders
function AboutPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Main gradient background - warm violet theme */}
          <linearGradient id="aboutBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* Violet accent gradient */}
          <linearGradient id="aboutVioletFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.25" />
          </linearGradient>

          {/* White flowing gradient */}
          <linearGradient id="aboutWhiteFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Base background */}
        <rect width="100%" height="100%" fill="url(#aboutBg)" />

        {/* Main flowing wave - violet accent */}
        <path
          d="M-100,180 C150,220 300,280 500,260 C700,240 850,160 1300,120"
          fill="none"
          stroke="url(#aboutVioletFlow)"
          strokeWidth="140"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Secondary wave - softer parallel */}
        <path
          d="M-150,280 C50,330 200,380 400,360 C600,340 750,260 900,200 C1050,140 1200,120 1450,90"
          fill="none"
          stroke="url(#aboutVioletFlow)"
          strokeWidth="100"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* White accent line */}
        <path
          d="M-80,200 C100,240 240,300 420,280 C600,260 780,180 920,140 C1060,100 1180,100 1280,80"
          fill="none"
          stroke="url(#aboutWhiteFlow)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function AboutPage() {
  const founders = [
    {
      name: "James Zagurskie",
      nickname: "Jimmy",
      role: "Co-Founder & Executive Director",
      image: "/jimmy-profile.png",
      bio: "Jimmy is the visionary leader behind Compass Coaching. With three years of experience as a Resident Advisor, including one year as Senior RA overseeing a full staff, he developed exceptional skills in mediation, communication, and mentorship. His natural ability to connect with people and guide them through challenges makes him the heart of our organization.",
      expertise: [
        "Leadership & Team Development",
        "Civil Engineering Guidance",
        "Conflict Mediation",
        "Mental Health Support",
      ],
      linkedin: "https://www.linkedin.com/in/james-zagurskie-81731b21b/",
      icon: Users,
      color: "lime",
    },
    {
      name: "Parker Conn",
      nickname: null,
      role: "Co-Founder & Technology Director",
      image: "/parker-profile.jpg",
      bio: "Parker brings eight years of software development experience to Compass Coaching. Also a former Resident Advisor, he combines technical expertise with a genuine passion for helping others succeed. He designed and built this platform from the ground up, creating a personalized assessment system that matches users with resources tailored to their unique goals, values, and challenges.",
      expertise: [
        "Full-Stack Development",
        "User Experience Design",
        "IT Career Guidance",
        "Technical Mentorship",
      ],
      linkedin: "https://www.linkedin.com/in/parkerconn/",
      icon: Code,
      color: "teal",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Accessible to All",
      description: "Free guidance for every Pennsylvanian, regardless of financial circumstances.",
    },
    {
      icon: Target,
      title: "Personalized Approach",
      description: "Tailored recommendations based on your unique personality, values, and goals.",
    },
    {
      icon: MessageCircle,
      title: "Holistic Support",
      description: "Career guidance paired with life skills, because success means more than a paycheck.",
    },
  ];

  const coaches = [
    {
      name: "Duncan Wentzel",
      role: "Coach",
      image: "/duncan-profile.jpg",
      bio: "Duncan brings a unique blend of creative and physical expertise to Compass Coaching. With a strong background in graphic design, he helps clients explore careers in creative fields and visual communication. As a dedicated fitness enthusiast, Duncan also guides those interested in health, wellness, and fitness-related career paths.",
      expertise: [
        "Graphic Design",
        "Visual Communication",
        "Fitness & Wellness",
        "Creative Industries",
      ],
      linkedin: "https://www.linkedin.com/in/duncan-wentzel-5605081b6/",
      icon: Palette,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pb-40 px-6 overflow-hidden">
        <AboutPattern />

        <Container className="relative z-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-28 h-28 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-white/40">
              <svg className="w-16 h-16" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="none"
                  stroke="#4c1d95"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
                />
                <g style={{ transformOrigin: '122.5px 127.5px' }}>
                  {/* NE half */}
                  <path
                    d="M97 113 Q100 103 110 100 L170 80 L148 142 Q145 152 136 155"
                    fill="none"
                    stroke="#4c1d95"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* SW half */}
                  <path
                    d="M144 150 Q140.5 153.5 136 155 L75 175 L97 113 Q98.5 108 102 105"
                    fill="none"
                    stroke="#4c1d95"
                    strokeWidth="18"
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              About Compass Coaching
            </h1>
            <p className="text-xl text-violet-100 max-w-2xl mx-auto">
              Two friends united by a shared mission: helping Pennsylvanians navigate their careers and lives with confidence.
            </p>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,50 C300,90 600,10 900,50 C1050,70 1150,70 1200,50 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-blue-900 mx-auto rounded-full" />
          </div>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-8 md:p-10">
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                Compass Coaching was born from a friendship forged in the residence halls. Jimmy and Parker served together on the same Resident Advisor staff for two years, watching each other grow as mentors and leaders. They saw firsthand how the right guidance at the right time can transform someone's trajectory.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                After Parker graduated and Jimmy stepped into the Senior RA role, they stayed connected, sharing stories of students they'd helped, challenges they'd navigated, and dreams of making a bigger impact. That dream became Compass Coaching: a free platform combining Jimmy's natural coaching abilities with Parker's technical skills.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed">
                Today, we're building something we wish we'd had: a comprehensive resource that meets people where they are, whether they're exploring career paths, negotiating salaries, or simply trying to find balance in life.
              </p>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* Founders Section */}
      <section className="py-16 px-6 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">Meet the Founders</h2>
            <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder) => {
              const Icon = founder.icon;
              return (
                <Card
                  key={founder.name}
                  className="border-0 overflow-hidden h-full bg-stone-100 rounded-2xl shadow-[10px_10px_30px_#c8c8c7,-10px_-10px_30px_#ffffff]"
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Photo section with gradient background */}
                    <div className={`relative pt-8 pb-16 bg-gradient-to-br ${founder.color === "lime" ? "from-lime-400 via-lime-500 to-lime-600" : "from-teal-400 via-teal-500 to-teal-600"}`}>
                      <div className="flex justify-center">
                        {founder.image ? (
                          <img
                            src={founder.image}
                            alt={founder.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                            <Icon className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name and role - overlapping section */}
                    <div className={`relative -mt-8 mx-4 mb-4 rounded-xl p-4 text-center ${founder.color === "lime" ? "bg-[#f5f8f0] shadow-[inset_4px_4px_12px_#b8c5a0,inset_-4px_-4px_12px_#ffffff]" : "bg-[#f0f8f7] shadow-[inset_4px_4px_12px_#a8c8c4,inset_-4px_-4px_12px_#ffffff]"}`}>
                      <h3 className="text-xl font-bold text-stone-800">
                        {founder.nickname ? `${founder.name} "${founder.nickname}"` : founder.name}
                      </h3>
                      <p className={`text-sm font-semibold ${founder.color === "lime" ? "text-lime-800" : "text-teal-800"}`}>
                        {founder.role}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 flex flex-col flex-grow">
                      <p className="text-stone-600 mb-6 leading-relaxed flex-grow">
                        {founder.bio}
                      </p>

                      {/* Expertise tags */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-stone-500 mb-2">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {founder.expertise.map((skill) => (
                            <span
                              key={skill}
                              className={`px-3 py-1 rounded-full text-sm border ${founder.color === "lime" ? "bg-lime-100 text-lime-800 border-lime-800" : "bg-teal-100 text-teal-800 border-teal-800"}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* LinkedIn link */}
                      <div className="flex justify-center">
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors shadow-md hover:shadow-lg"
                        >
                          <Linkedin className="w-5 h-5" />
                          Connect on LinkedIn
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">What We Believe</h2>
            <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-stone-200 text-center hover:border-lime-300 transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-lime-100 rounded-full mb-4">
                      <Icon className="w-7 h-7 text-lime-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-700 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-stone-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Coaches Section */}
      <section className="py-16 px-6 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-700 mb-4">Meet Our Coaches</h2>
            <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full" />
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Our volunteer coaches bring diverse expertise to help you explore different career paths.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {coaches.map((coach) => {
              const Icon = coach.icon;
              return (
                <Card
                  key={coach.name}
                  className="border-0 overflow-hidden bg-stone-100 rounded-2xl shadow-[10px_10px_30px_#c8c8c7,-10px_-10px_30px_#ffffff]"
                >
                  <CardContent className="p-0">
                    {/* Photo section with gradient background */}
                    <div className="relative pt-8 pb-16 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
                      <div className="flex justify-center">
                        {coach.image ? (
                          <img
                            src={coach.image}
                            alt={coach.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                            <Icon className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name and role - overlapping section */}
                    <div className="relative -mt-8 mx-4 mb-4 bg-[#f3f0f8] rounded-xl shadow-[inset_4px_4px_12px_#b5a8c8,inset_-4px_-4px_12px_#ffffff] p-4 text-center">
                      <h3 className="text-xl font-bold text-stone-800">{coach.name}</h3>
                      <p className="text-sm font-semibold text-purple-800">{coach.role}</p>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                      <p className="text-stone-600 mb-6 leading-relaxed">
                        {coach.bio}
                      </p>

                      {/* Expertise tags */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-stone-500 mb-2">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {coach.expertise.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-sm border bg-purple-100 text-purple-800 border-purple-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* LinkedIn link */}
                      <div className="flex justify-center">
                        <a
                          href={coach.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors shadow-md hover:shadow-lg"
                        >
                          <Linkedin className="w-5 h-5" />
                          Connect on LinkedIn
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-lime-500 to-lime-600">
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="aboutCtaDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aboutCtaDots)" />
          </svg>

          {/* Flowing shapes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
            <path
              d="M-100,150 C200,200 400,100 700,150 C1000,200 1100,100 1300,150"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="80"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Wavy top edge */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <svg className="w-full h-12 md:h-16 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,20 600,100 900,60 C1050,40 1150,40 1200,60 L1200,0 L0,0 Z"
              fill="#f5f5f4"
            />
          </svg>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              Ready to Find Your Path?
            </h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Take our free assessment and discover personalized resources tailored just for you.
            </p>
            <Link to="/intake">
              <Button
                size="lg"
                className="bg-white text-lime-700 hover:bg-lime-50 focus-visible:ring-lime-400 active:bg-lime-100 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                Start Your Assessment
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

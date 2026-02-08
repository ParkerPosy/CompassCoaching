import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Compass, Heart, Linkedin, Users, Sparkles, Target, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

// Hero pattern for about page
function AboutPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfccb" stopOpacity="1" />
            <stop offset="50%" stopColor="#d9f99d" stopOpacity="1" />
            <stop offset="100%" stopColor="#bef264" stopOpacity="0.7" />
          </linearGradient>
          <pattern id="aboutDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(163, 230, 53, 0.2)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#aboutGradient)" />
        <rect width="100%" height="100%" fill="url(#aboutDots)" />

        {/* Soft floating shapes */}
        <circle cx="10%" cy="30%" r="80" fill="rgba(163, 230, 53, 0.1)" />
        <circle cx="85%" cy="60%" r="100" fill="rgba(163, 230, 53, 0.08)" />
        <circle cx="70%" cy="20%" r="60" fill="rgba(163, 230, 53, 0.12)" />
      </svg>
    </div>
  );
}

function AboutPage() {
  const founders = [
    {
      name: "James Zagurski",
      nickname: "Jimmy",
      role: "Co-Founder & Executive Director",
      image: "/jimmy-profile.png",
      bio: "Jimmy is the visionary leader behind Compass Coaching. With three years of experience as a Resident Advisor, including one year as Senior RA overseeing a full staff, he developed exceptional skills in mediation, communication, and counseling. His natural ability to connect with people and guide them through challenges makes him the heart of our organization.",
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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <AboutPattern />

        <Container className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg border-2 border-lime-200">
              <Compass className="w-10 h-10 text-lime-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              About Compass Coaching
            </h1>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto">
              Two friends united by a shared mission: helping Pennsylvanians navigate their careers and lives with confidence.
            </p>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-10 md:h-14" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,80 1200,60 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full" />
          </div>

          <Card className="border-lime-200 bg-linear-to-br from-lime-50 to-white">
            <CardContent className="p-8 md:p-10">
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                Compass Coaching was born from a friendship forged in the residence halls. Jimmy and Parker served together on the same Resident Advisor staff for two years, watching each other grow as mentors and leaders. They saw firsthand how the right guidance at the right time can transform someone's trajectory.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                After Parker graduated and Jimmy stepped into the Senior RA role, they stayed connected, sharing stories of students they'd helped, challenges they'd navigated, and dreams of making a bigger impact. That dream became Compass Coaching: a free platform combining Jimmy's natural counseling abilities with Parker's technical skills.
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
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Meet the Founders</h2>
            <div className="w-16 h-1 bg-lime-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder) => {
              const Icon = founder.icon;
              return (
                <Card
                  key={founder.name}
                  className="border-stone-200 hover:border-lime-300 transition-all duration-300 hover:shadow-lg overflow-hidden h-full"
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Header with photo */}
                    <div className={`p-6 bg-linear-to-r ${founder.color === "lime" ? "from-lime-500 to-lime-600" : "from-teal-500 to-teal-600"}`}>
                      <div className="flex items-center gap-4">
                        {founder.image ? (
                          <img
                            src={founder.image}
                            alt={founder.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {founder.nickname ? `${founder.name} "${founder.nickname}"` : founder.name}
                          </h3>
                          <p className="text-white/90 text-sm">{founder.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-stone-700 mb-6 leading-relaxed flex-grow">
                        {founder.bio}
                      </p>

                      {/* Expertise tags */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-stone-500 mb-2">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {founder.expertise.map((skill) => (
                            <span
                              key={skill}
                              className={`px-3 py-1 rounded-full text-sm ${founder.color === "lime" ? "bg-lime-100 text-lime-700" : "bg-teal-100 text-teal-700"}`}
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
            <h2 className="text-3xl font-bold text-stone-900 mb-4">What We Believe</h2>
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
                    <h3 className="text-lg font-semibold text-stone-900 mb-2">
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
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,20 600,100 900,60 C1050,40 1150,40 1200,60 L1200,0 L0,0 Z"
              fill="#fafaf9"
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Send, Heart, HelpCircle, Lightbulb, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  Input,
  Textarea,
} from "@/components/ui";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      {
        title: "Contact Us | Compass Coaching",
      },
      {
        name: "description",
        content:
          "Have questions about career coaching or our free resources? Contact Compass Coaching for guidance and support. We're here to help you navigate your future.",
      },
    ],
  }),
});

const conversationTopics = [
  {
    icon: HelpCircle,
    label: "Question about the assessment",
    subject: "Question about the assessment",
  },
  {
    icon: Lightbulb,
    label: "Resource suggestion",
    subject: "I have a resource suggestion",
  },
  {
    icon: Users,
    label: "Partnership inquiry",
    subject: "Partnership inquiry",
  },
  {
    icon: Heart,
    label: "Just saying thanks",
    subject: "Thank you!",
  },
];

const faqs = [
  {
    question: "Is Compass Coaching really free?",
    answer: "Yes, 100% free. We're donation-funded and believe everyone deserves access to quality career and life guidance.",
  },
  {
    question: "How long does the assessment take?",
    answer: "About 20-25 minutes. You can save your progress and return anytime.",
  },
  {
    question: "Is my information private?",
    answer: "Absolutely. Your assessment data stays in your browser. We don't sell or share personal information.",
  },
];

function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleTopicClick = (subject: string) => {
    setSelectedTopic(subject);
    // Scroll to form
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section - Conversational Style */}
      <section className="relative py-16 md:py-24 px-6 bg-stone-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-lime-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Chat bubble style */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-lime-500/20">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="bg-stone-800 rounded-2xl rounded-tl-none p-6 shadow-xl">
                <p className="text-xl md:text-2xl text-white font-medium">
                  Hey there! 👋
                </p>
                <p className="text-stone-300 mt-2">
                  We're Jimmy and Parker, the founders of Compass Coaching.
                  We read every message personally and would love to hear from you.
                </p>
              </div>
            </div>

            {/* Response bubble */}
            <div className="flex items-start gap-4 justify-end">
              <div className="bg-lime-500 rounded-2xl rounded-tr-none p-6 shadow-xl max-w-md">
                <p className="text-stone-900 font-medium">
                  What would you like to chat about?
                </p>
              </div>
              <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">🧭</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Topics */}
      <section className="py-12 px-6 bg-white border-b border-stone-200">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-stone-600 mb-6">Pick a topic or scroll down to send a custom message</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {conversationTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.label}
                    onClick={() => handleTopicClick(topic.subject)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      selectedTopic === topic.subject
                        ? "border-lime-500 bg-lime-50"
                        : "border-stone-200 hover:border-lime-300 bg-white"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${selectedTopic === topic.subject ? "text-lime-600" : "text-stone-400"}`} />
                    <p className={`text-sm font-medium ${selectedTopic === topic.subject ? "text-lime-700" : "text-stone-700"}`}>
                      {topic.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-16 px-6">
        <Container>
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
            {/* Left Column - Form */}
            <div className="lg:col-span-3" id="contact-form">
              {formSubmitted ? (
                <Card className="border-lime-200 bg-lime-50">
                  <CardContent className="p-10 text-center">
                    <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-3">Message Sent!</h2>
                    <p className="text-stone-600 mb-6">
                      Thanks for reaching out. We'll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setSelectedTopic(null);
                      }}
                      className="text-lime-600 hover:text-lime-700 font-medium"
                    >
                      Send another message
                    </button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-stone-200 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Send us a message</h2>
                    <p className="text-stone-600 mb-6">
                      We read everything and respond to everyone.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Your name
                          </label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="First name is fine"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Email address
                          </label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1.5">
                          What's this about?
                        </label>
                        <Input
                          type="text"
                          id="subject"
                          name="subject"
                          placeholder="Brief subject line"
                          value={selectedTopic || ""}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
                          Your message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Don't be shy, tell us what's on your mind..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-stone-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-stone-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 flex items-center justify-center gap-2 group"
                      >
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Direct email option */}
              <div className="mt-6 text-center">
                <p className="text-stone-500 text-sm">
                  Prefer email? Write directly to{" "}
                  <a href="mailto:hello@compasscoaching.org" className="text-lime-600 hover:text-lime-700 font-medium">
                    hello@compasscoaching.org
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column - FAQs & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* FAQ Section */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-lime-600" />
                  Common Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="bg-white rounded-xl p-4 border border-stone-200">
                      <p className="font-medium text-stone-900 text-sm">{faq.question}</p>
                      <p className="text-stone-600 text-sm mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Promise */}
              <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-stone-900">Our Promise</h3>
                </div>
                <p className="text-stone-600 text-sm">
                  Every message is read by a real person (hi, that's us!).
                  We respond within 24-48 hours because your questions deserve thoughtful answers.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-stone-900 rounded-xl p-6 text-white">
                <p className="font-medium mb-2">Haven't taken the assessment yet?</p>
                <p className="text-stone-400 text-sm mb-4">
                  Discover your career matches and get personalized guidance.
                </p>
                <Link
                  to="/intake"
                  className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 font-medium text-sm group"
                >
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

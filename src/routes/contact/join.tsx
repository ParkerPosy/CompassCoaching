import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  Briefcase,
  Users,
  Presentation,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";

export const Route = createFileRoute("/contact/join")({
  component: JoinTeamPage,
  head: () => ({
    meta: [
      {
        title: "Join Our Team | Compass Coaching",
      },
      {
        name: "description",
        content:
          "Join the Compass Coaching team as a volunteer coach, presenter, or mentor. Help Pennsylvanians navigate their careers and lives.",
      },
    ],
  }),
});

const interestOptions = [
  {
    id: "coaching",
    icon: Users,
    label: "Coaching",
    description: "One-on-one guidance sessions with people seeking career direction",
  },
  {
    id: "presentations",
    icon: Presentation,
    label: "Oral Presentations",
    description: "Speaking at schools, community centers, or career fairs",
  },
  {
    id: "job-shadow",
    icon: Eye,
    label: "Job Shadowing Host",
    description: "Allow someone to shadow you at your workplace",
  },
];

const contactPreferences = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "either", label: "Either is fine" },
];

function JoinTeamPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState<string>("");

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add Web3Forms access key
    formData.append("access_key", "7b4352b3-25e5-4f4d-9389-b7e7474f565f");
    formData.append("from_name", "Compass Coaching - Volunteer Application");
    formData.append("subject", "New Volunteer Application");

    // Add interests as a formatted string
    const interestLabels = selectedInterests.map(
      (id) => interestOptions.find((opt) => opt.id === id)?.label
    );
    formData.append("interests", interestLabels.join(", ") || "None selected");
    formData.append("contact_preference", contactPreference || "Not specified");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormSubmitted(true);
        form.reset();
        setSelectedInterests([]);
        setContactPreference("");
      } else {
        alert(
          "Something went wrong. Please email us directly at hello@compasscoachingpa.org"
        );
      }
    } catch {
      alert(
        "Something went wrong. Please email us directly at hello@compasscoachingpa.org"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-lime-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl" />

        <Container className="relative z-10">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contact
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl">
              Help Pennsylvanians navigate their careers and lives. Share your
              expertise as a volunteer coach, presenter, or mentor.
            </p>
          </div>
        </Container>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <Container>
          <div className="max-w-3xl mx-auto">
            {formSubmitted ? (
              <Card className="border-lime-200 bg-lime-50">
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-700 mb-3">
                    Application Received!
                  </h2>
                  <p className="text-stone-600 mb-6">
                    Thank you for your interest in joining our team! We'll review
                    your application and reach out within a few days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setFormSubmitted(false);
                      }}
                      variant="outline"
                    >
                      Submit Another Application
                    </Button>
                    <Link to="/">
                      <Button>Back to Home</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="pl-10"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Phone Number (Work or Cell)
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="pl-10"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          City You Work In <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            required
                            className="pl-10"
                            placeholder="Philadelphia, PA"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Background */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      Professional Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label
                        htmlFor="profession"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Current Profession / Job Title{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="profession"
                        name="profession"
                        type="text"
                        required
                        placeholder="e.g., Software Engineer, Nurse, Teacher, Electrician"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="employer"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Employer / Company (Optional)
                      </label>
                      <Input
                        id="employer"
                        name="employer"
                        type="text"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Years of Experience in Your Field
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        className="w-full h-11 rounded-lg border border-stone-200 bg-white px-3 text-stone-700 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                      >
                        <option value="">Select...</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-20">11-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="expertise"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Areas of Expertise
                      </label>
                      <Textarea
                        id="expertise"
                        name="expertise"
                        rows={3}
                        placeholder="What topics or skills could you help others with? (e.g., resume writing, interview prep, career transitions, specific technical skills)"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      How Would You Like to Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-stone-600">
                      Select all that interest you. Don't worry—we'll discuss
                      details before committing you to anything!
                    </p>
                    <div className="grid gap-3">
                      {interestOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedInterests.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleInterest(option.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-start gap-4 ${
                              isSelected
                                ? "border-purple-500 bg-purple-50"
                                : "border-stone-200 hover:border-purple-300 bg-white"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-purple-500 text-white"
                                  : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  isSelected
                                    ? "text-purple-700"
                                    : "text-stone-700"
                                }`}
                              >
                                {option.label}
                              </p>
                              <p className="text-sm text-stone-500 mt-0.5">
                                {option.description}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-purple-500 bg-purple-500"
                                  : "border-stone-300"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Preference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      Contact Preference
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-stone-600">
                      How would you prefer we reach out to you?
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {contactPreferences.map((pref) => (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => setContactPreference(pref.id)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium ${
                            contactPreference === pref.id
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-stone-200 hover:border-purple-300 text-stone-700"
                          }`}
                        >
                          {pref.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Availability & Additional Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Availability & Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label
                        htmlFor="availability"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        General Availability
                      </label>
                      <Textarea
                        id="availability"
                        name="availability"
                        rows={2}
                        placeholder="e.g., Weekday evenings, Saturday mornings, flexible schedule"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="motivation"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Why are you interested in helping? (Optional)
                      </label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        rows={3}
                        placeholder="Tell us a bit about why you'd like to volunteer with Compass Coaching"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        LinkedIn Profile URL (Optional)
                      </label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                  <p className="text-sm text-stone-500">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}

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
  Sun,
  Sunrise,
  Moon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

const timeOfDayOptions = [
  { id: "morning", icon: Sunrise, label: "Mornings", hint: "Before noon" },
  { id: "afternoon", icon: Sun, label: "Afternoons", hint: "12pm - 5pm" },
  { id: "evening", icon: Moon, label: "Evenings", hint: "After 5pm" },
];

const dayOptions = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

// Geometric pattern for join page - purple version of careers pattern
function JoinPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Base gradient - deep purple */}
        <linearGradient id="joinBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="50%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>

        {/* Blue accent gradient */}
        <linearGradient id="joinAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
        </linearGradient>

        {/* Secondary blue gradient - reversed */}
        <linearGradient id="joinAccent2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
        </linearGradient>

        {/* Filled swoosh gradient */}
        <linearGradient id="joinSwooshFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Base fill */}
      <rect width="100%" height="100%" fill="url(#joinBg)" />

      {/* Filled swoosh area - subtle wave shape */}
      <path
        d="M0 320 Q200 250 500 280 T900 240 T1200 260 L1200 400 L0 400 Z"
        fill="url(#joinSwooshFill)"
      />

      {/* Primary swoosh line - blue accent (main) - gentle curve */}
      <path
        d="M0 310 Q180 260 450 290 Q750 320 1000 250 Q1120 220 1200 240"
        fill="none"
        stroke="url(#joinAccent)"
        strokeWidth="3"
      />

      {/* Secondary blue swoosh - steeper descent */}
      <path
        d="M0 260 Q250 280 500 230 Q800 170 1050 200 T1200 180"
        fill="none"
        stroke="url(#joinAccent2)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Third blue swoosh - rising then falling */}
      <path
        d="M0 370 Q200 340 400 360 Q650 390 850 320 Q1050 260 1200 290"
        fill="none"
        stroke="rgba(96, 165, 250, 0.4)"
        strokeWidth="2"
      />

      {/* Fourth blue swoosh - dramatic dip */}
      <path
        d="M0 390 Q300 380 500 350 Q700 310 900 340 Q1100 380 1200 350"
        fill="none"
        stroke="rgba(147, 197, 253, 0.25)"
        strokeWidth="1.5"
      />

      {/* White accent swooshes for depth - varied curves */}
      <path
        d="M0 340 Q350 290 600 330 Q850 370 1050 300 T1200 310"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />
      <path
        d="M0 380 Q250 350 450 370 Q700 400 950 350 Q1100 320 1200 340"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* Top accent curves - blue, dynamic varied angles */}
      <path
        d="M700 0 Q800 120 950 80 Q1100 40 1200 110"
        fill="none"
        stroke="url(#joinAccent)"
        strokeWidth="2.5"
        opacity="0.45"
      />
      <path
        d="M850 0 Q900 60 1000 40 Q1150 10 1200 60"
        fill="none"
        stroke="url(#joinAccent2)"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M950 0 Q980 80 1050 50 Q1120 20 1200 80"
        fill="none"
        stroke="rgba(147, 197, 253, 0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M1020 0 Q1070 35 1100 60 Q1150 90 1200 45"
        fill="none"
        stroke="rgba(96, 165, 250, 0.35)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function JoinTeamPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState<string>("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>("");

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleTime = (id: string) => {
    setSelectedTimes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleDay = (id: string) => {
    setSelectedDays((prev) =>
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

    // Add availability as formatted strings
    const timeLabels = selectedTimes.map(
      (id) => timeOfDayOptions.find((opt) => opt.id === id)?.label
    );
    const dayLabels = selectedDays.map(
      (id) => dayOptions.find((opt) => opt.id === id)?.label
    );
    formData.append("available_times", timeLabels.join(", ") || "Not specified");
    formData.append("available_days", dayLabels.join(", ") || "Not specified");

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
        setSelectedTimes([]);
        setSelectedDays([]);
        setExperience("");
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
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <JoinPattern />

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
                      <input type="hidden" name="experience" value={experience} />
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="11-20">11-20 years</SelectItem>
                          <SelectItem value="20+">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <CardContent className="space-y-6">
                    {/* Time of Day */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        When are you typically available?
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {timeOfDayOptions.map((time) => {
                          const Icon = time.icon;
                          const isSelected = selectedTimes.includes(time.id);
                          return (
                            <button
                              key={time.id}
                              type="button"
                              onClick={() => toggleTime(time.id)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center ${
                                isSelected
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-stone-200 hover:border-purple-300 bg-white"
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 mb-1 ${
                                  isSelected ? "text-purple-600" : "text-stone-400"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? "text-purple-700" : "text-stone-700"
                                }`}
                              >
                                {time.label}
                              </span>
                              <span className="text-xs text-stone-400 mt-0.5">
                                {time.hint}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Days of Week */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Which days work best?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {dayOptions.map((day) => {
                          const isSelected = selectedDays.includes(day.id);
                          return (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => toggleDay(day.id)}
                              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? "border-purple-500 bg-purple-500 text-white"
                                  : "border-stone-200 hover:border-purple-300 bg-white text-stone-600"
                              }`}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
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

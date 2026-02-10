import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/basic")({
  component: BasicInfoPage,
  head: () => ({
    meta: [
      { title: "Basic Information | Compass Coaching Assessment" },
      { name: "description", content: "Start your career assessment journey with basic information about yourself." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function BasicInfoPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();

  // Read directly from store - auto-updates on any change
  const basic = useAssessmentStore((state) => state.basic);
  const updateBasic = useAssessmentStore((state) => state.updateBasic);

  // Safe accessors with defaults
  const formData = {
    name: basic?.name || "",
    ageRange: basic?.ageRange || "",
    educationLevel: basic?.educationLevel || "",
    employmentStatus: basic?.employmentStatus || "",
    primaryReason: basic?.primaryReason || "",
  };

  const handleChange = (field: string, value: string) => {
    updateBasic({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/personality" });
  };

  const isValid =
    formData.name &&
    formData.ageRange &&
    formData.educationLevel &&
    formData.employmentStatus;

  // Calculate section progress (4 required fields)
  const requiredFields = [formData.name, formData.ageRange, formData.educationLevel, formData.employmentStatus];
  const filledFields = requiredFields.filter(Boolean).length;
  const sectionProgress = (filledFields / requiredFields.length) * 100;

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-6 pb-40">
        <Container size="sm">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-stone-200 rounded w-1/3" />
            <div className="h-4 bg-stone-200 rounded w-2/3" />
            <Card>
              <CardContent className="space-y-6 pt-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-1/4" />
                    <div className="h-10 bg-stone-200 rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6 pb-40">
      <Container size="sm">
        <SectionHeader
          icon={User}
          title="Basic Information"
          subtitle="Let's start with some basic information about you."
          estimatedTime="2 minutes"
        />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your name? <span className="text-error-500">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Age Range */}
              <div>
                <label
                  htmlFor="ageRange"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your age range?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.ageRange || undefined}
                  onValueChange={(value) => handleChange("ageRange", value)}
                >
                  <SelectTrigger id="ageRange">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-18">Under 18</SelectItem>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-plus">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education Level */}
              <div>
                <label
                  htmlFor="educationLevel"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your education level?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.educationLevel || undefined}
                  onValueChange={(value) =>
                    handleChange("educationLevel", value)
                  }
                >
                  <SelectTrigger id="educationLevel">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">
                      Currently in High School
                    </SelectItem>
                    <SelectItem value="hs-graduate">
                      High School Graduate
                    </SelectItem>
                    <SelectItem value="some-college">Some College</SelectItem>
                    <SelectItem value="associates">
                      Associate's Degree
                    </SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">
                      Master's Degree or Higher
                    </SelectItem>
                    <SelectItem value="trade-cert">
                      Trade School/Certification
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Status */}
              <div>
                <label
                  htmlFor="employmentStatus"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your current employment status?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.employmentStatus || undefined}
                  onValueChange={(value) =>
                    handleChange("employmentStatus", value)
                  }
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select your employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Full-time Student</SelectItem>
                    <SelectItem value="employed-ft">
                      Employed Full-time
                    </SelectItem>
                    <SelectItem value="employed-pt">
                      Employed Part-time
                    </SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Reason */}
              <div>
                <label
                  htmlFor="primaryReason"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What brings you to Compass Coaching? (Optional)
                </label>
                <Textarea
                  id="primaryReason"
                  value={formData.primaryReason}
                  onChange={(e) =>
                    handleChange("primaryReason", e.target.value)
                  }
                  rows={4}
                  placeholder="Tell us about your goals, challenges, or what you hope to gain from this assessment..."
                />
                <p className="text-sm text-stone-500 mt-1">
                  This helps us provide more personalized recommendations.
                </p>
              </div>
            </CardContent>
          </Card>

          <AssessmentFooter
            currentStep={1}
            nextLabel="Next: Personality"
            nextDisabled={!isValid}
            sectionProgress={sectionProgress}
          />
        </form>
      </Container>
    </div>
  );
}

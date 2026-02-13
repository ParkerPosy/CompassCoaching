import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/challenges")({
  component: ChallengesPage,
  head: () => ({
    meta: [
      { title: "Challenges & Constraints | Compass Coaching" },
      { name: "description", content: "Tell us about your circumstances so we can tailor career recommendations to your situation." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ChallengesPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();

  // Read directly from store - auto-updates on any change
  const challenges = useAssessmentStore((state) => state.challenges);
  const updateChallenges = useAssessmentStore((state) => state.updateChallenges);

  // Safe accessors with defaults
  const formData = {
    financial: challenges?.financial || "",
    timeAvailability: challenges?.timeAvailability || "",
    locationFlexibility: challenges?.locationFlexibility || "",
    familyObligations: challenges?.familyObligations || "",
    transportation: challenges?.transportation || "",
    healthConsiderations: challenges?.healthConsiderations || "",
    educationGaps: challenges?.educationGaps || [],
    supportSystem: challenges?.supportSystem || "",
    additionalNotes: challenges?.additionalNotes || "",
    salaryMinimum: challenges?.salaryMinimum || "",
    timelineUrgency: challenges?.timelineUrgency || "",
  };

  const handleChange = (field: string, value: string | string[]) => {
    updateChallenges({ [field]: value });
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean,
  ) => {
    const current = formData.educationGaps;
    if (checked) {
      updateChallenges({ [field]: [...current, value] });
    } else {
      updateChallenges({ [field]: current.filter((v) => v !== value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/review" });
  };

  const requiredFields = [
    "financial",
    "timeAvailability",
    "locationFlexibility",
    "supportSystem",
  ];
  const filledRequired = requiredFields.filter(
    (field) => formData[field as keyof typeof formData],
  );
  const isValid = filledRequired.length === requiredFields.length;
  const sectionProgress = (filledRequired.length / requiredFields.length) * 100;

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-6 pb-40">
        <Container size="sm">
          <div className="animate-pulse space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 bg-stone-200 rounded w-1/2" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-1/3" />
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
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                Challenges & Constraints
              </CardTitle>
              <p className="text-stone-600 mt-2">
                Understanding your constraints helps us provide realistic
                recommendations. All information is confidential.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Financial Situation */}
              <div>
                <label
                  htmlFor="financial"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your current financial situation for
                  education/training? <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.financial || undefined}
                  onValueChange={(value) => handleChange("financial", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-constraints">
                      No major financial constraints
                    </SelectItem>
                    <SelectItem value="some-savings">
                      Some savings available
                    </SelectItem>
                    <SelectItem value="need-financial-aid">
                      Will need financial aid/loans
                    </SelectItem>
                    <SelectItem value="limited-funds">
                      Very limited funds available
                    </SelectItem>
                    <SelectItem value="working-while-learning">
                      Must work while learning
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Availability */}
              <div>
                <label
                  htmlFor="timeAvailability"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  How much time can you dedicate to training/education?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.timeAvailability || undefined}
                  onValueChange={(value) =>
                    handleChange("timeAvailability", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">
                      Full-time (40+ hours/week)
                    </SelectItem>
                    <SelectItem value="part-time">
                      Part-time (20-40 hours/week)
                    </SelectItem>
                    <SelectItem value="evenings-weekends">
                      Evenings and weekends only
                    </SelectItem>
                    <SelectItem value="very-limited">
                      Very limited (under 10 hours/week)
                    </SelectItem>
                    <SelectItem value="flexible">Flexible schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Flexibility */}
              <div>
                <label
                  htmlFor="locationFlexibility"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Are you able to relocate for work or education?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.locationFlexibility || undefined}
                  onValueChange={(value) =>
                    handleChange("locationFlexibility", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes-anywhere">
                      Yes, willing to relocate anywhere
                    </SelectItem>
                    <SelectItem value="same-region">
                      Yes, within same region/state
                    </SelectItem>
                    <SelectItem value="local-only">
                      Must stay in current area
                    </SelectItem>
                    <SelectItem value="remote-preferred">
                      Prefer remote opportunities
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Family Obligations */}
              <div>
                <label
                  htmlFor="familyObligations"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Do you have significant family or caregiving responsibilities?
                </label>
                <Select
                  value={formData.familyObligations || undefined}
                  onValueChange={(value) =>
                    handleChange("familyObligations", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      No significant obligations
                    </SelectItem>
                    <SelectItem value="childcare">
                      Childcare responsibilities
                    </SelectItem>
                    <SelectItem value="elder-care">
                      Elder care responsibilities
                    </SelectItem>
                    <SelectItem value="both">
                      Both childcare and elder care
                    </SelectItem>
                    <SelectItem value="other">
                      Other family obligations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transportation */}
              <div>
                <label
                  htmlFor="transportation"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's your transportation situation?
                </label>
                <Select
                  value={formData.transportation || undefined}
                  onValueChange={(value) =>
                    handleChange("transportation", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="own-vehicle">
                      Own reliable vehicle
                    </SelectItem>
                    <SelectItem value="public-transit">
                      Rely on public transportation
                    </SelectItem>
                    <SelectItem value="limited">
                      Limited transportation options
                    </SelectItem>
                    <SelectItem value="none">
                      No reliable transportation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Health Considerations */}
              <div>
                <label
                  htmlFor="healthConsiderations"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Are there any health considerations that might affect career
                  choices?
                </label>
                <Select
                  value={formData.healthConsiderations || undefined}
                  onValueChange={(value) =>
                    handleChange("healthConsiderations", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No limitations</SelectItem>
                    <SelectItem value="physical">
                      Physical limitations
                    </SelectItem>
                    <SelectItem value="mental-health">
                      Mental health considerations
                    </SelectItem>
                    <SelectItem value="chronic-condition">
                      Chronic health condition
                    </SelectItem>
                    <SelectItem value="prefer-not-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education Gaps */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Which areas might you need additional preparation in? (Select
                  all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    "Basic computer skills",
                    "Math fundamentals",
                    "Reading/writing skills",
                    "English language proficiency",
                    "Study skills and time management",
                    "Test-taking strategies",
                    "Professional communication",
                    "None of the above",
                  ].map((gap) => (
                    <label
                      key={gap}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.educationGaps.includes(gap)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "educationGaps",
                            gap,
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5 text-lime-600 rounded focus:ring-lime-600 focus:ring-offset-0"
                      />
                      <span className="text-stone-700">{gap}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Support System */}
              <div>
                <label
                  htmlFor="supportSystem"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  How would you describe your support system?{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Select
                  value={formData.supportSystem || undefined}
                  onValueChange={(value) =>
                    handleChange("supportSystem", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strong">
                      Strong family/friend support
                    </SelectItem>
                    <SelectItem value="some">Some support available</SelectItem>
                    <SelectItem value="limited">Limited support</SelectItem>
                    <SelectItem value="independent">
                      Mostly independent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Minimum */}
              <div>
                <label
                  htmlFor="salaryMinimum"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  What's the minimum annual salary you need to meet your
                  financial obligations?
                </label>
                <Select
                  value={formData.salaryMinimum || undefined}
                  onValueChange={(value) =>
                    handleChange("salaryMinimum", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-40k">$25,000 – $40,000</SelectItem>
                    <SelectItem value="40k-60k">$40,000 – $60,000</SelectItem>
                    <SelectItem value="60k-80k">$60,000 – $80,000</SelectItem>
                    <SelectItem value="80k-plus">$80,000+</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-stone-500 mt-1">
                  This helps us filter career matches to realistic salary ranges.
                </p>
              </div>

              {/* Timeline Urgency */}
              <div>
                <label
                  htmlFor="timelineUrgency"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  When do you need to be in a new role or career path?
                </label>
                <Select
                  value={formData.timelineUrgency || undefined}
                  onValueChange={(value) =>
                    handleChange("timelineUrgency", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="within-3-months">
                      Within 3 months
                    </SelectItem>
                    <SelectItem value="within-a-year">
                      Within a year
                    </SelectItem>
                    <SelectItem value="no-rush">
                      No rush — exploring long-term
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-stone-500 mt-1">
                  This helps us recommend career paths that match your timeline.
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Any other challenges or considerations we should know about?
                </label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    handleChange("additionalNotes", e.target.value)
                  }
                  rows={4}
                  placeholder="Share anything else that might help us provide better recommendations..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <AssessmentFooter
            currentStep={5}
            backTo="/intake/aptitude"
            backLabel="Back to Aptitude"
            nextDisabled={!isValid}
            nextButtonType="submit"
            nextLabel="Review Answers"
            sectionProgress={sectionProgress}
          />
        </form>
      </Container>
    </div>
  );
}

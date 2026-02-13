import { useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Award, Trash2, User } from "lucide-react";
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
import type { Degree } from "@/types/assessment";

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
    degrees: basic?.degrees || [],
    workExperience: basic?.workExperience || [],
  };

  const isCollegeEducation = ["some-college", "associates", "bachelors", "masters", "trade-cert"].includes(formData.educationLevel);

  // Stable unique IDs for degree rows to avoid remount on edit
  const degreeIdCounter = useRef(formData.degrees.length);
  const degreeKeys = useRef<number[]>(formData.degrees.map((_, i) => i));
  // Sync keys array length with degrees array
  while (degreeKeys.current.length < formData.degrees.length) {
    degreeKeys.current.push(++degreeIdCounter.current);
  }
  if (degreeKeys.current.length > formData.degrees.length) {
    degreeKeys.current = degreeKeys.current.slice(0, formData.degrees.length);
  }

  const handleChange = (field: string, value: string) => {
    updateBasic({ [field]: value });
    // Clear degrees when switching away from college education
    if (field === "educationLevel" && !["some-college", "associates", "bachelors", "masters", "trade-cert"].includes(value)) {
      updateBasic({ degrees: [] });
    }
    // Initialize with one empty degree when selecting college education
    if (field === "educationLevel" && ["some-college", "associates", "bachelors", "masters", "trade-cert"].includes(value) && formData.degrees.length === 0) {
      updateBasic({ degrees: [{ level: "", name: "" }] });
    }
  };

  const handleExperienceToggle = (value: string, checked: boolean) => {
    const current = formData.workExperience;
    if (checked) {
      updateBasic({ workExperience: [...current, value] });
    } else {
      updateBasic({ workExperience: current.filter((v) => v !== value) });
    }
  };

  const updateDegree = (index: number, field: keyof Degree, value: string) => {
    const updated = [...formData.degrees];
    updated[index] = { ...updated[index], [field]: value };

    const current = updated[index];
    const isLastRow = index === updated.length - 1;
    const requiredFilled = !!(current.level && current.name?.trim());

    // Auto-add a new empty row when required fields are filled on the last row
    if (isLastRow && requiredFilled) {
      updated.push({ level: "", name: "" });
    }

    updateBasic({ degrees: updated });
  };

  const removeDegree = (index: number) => {
    const updated = formData.degrees.filter((_, i) => i !== index);
    degreeKeys.current = degreeKeys.current.filter((_, i) => i !== index);
    // Always keep at least one row
    if (updated.length === 0) {
      updateBasic({ degrees: [{ level: "", name: "" }] });
    } else {
      updateBasic({ degrees: updated });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/personality" });
  };

  const degreeRequirementMet = !isCollegeEducation || !!(
    formData.degrees[0]?.level &&
    formData.degrees[0]?.name?.trim()
  );

  const isValid =
    formData.name &&
    formData.ageRange &&
    formData.educationLevel &&
    formData.employmentStatus &&
    degreeRequirementMet;

  // Calculate section progress
  const requiredFields = [
    formData.name,
    formData.ageRange,
    formData.educationLevel,
    formData.employmentStatus,
    ...(isCollegeEducation
      ? [formData.degrees[0]?.level, formData.degrees[0]?.name?.trim()]
      : []),
  ];
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

              {/* Dynamic Degree Fields */}
              {isCollegeEducation && formData.degrees.length > 0 && (
                <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Degrees & Certifications</span>
                  </div>

                  {formData.degrees.map((degree, index) => {
                    const isLastEmpty =
                      index === formData.degrees.length - 1 &&
                      !(degree.level && degree.name?.trim());
                    return (
                      <div
                        key={degreeKeys.current[index]}
                        className={`flex gap-3 items-center ${isLastEmpty ? "opacity-60" : ""}`}
                      >
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_120px] gap-2 items-center">
                            <Select
                              size="sm"
                              value={degree.level || undefined}
                              onValueChange={(value) => updateDegree(index, "level", value)}
                            >
                              <SelectTrigger className={index === 0 ? "[&_[data-placeholder]]:text-stone-700" : ""}>
                                <SelectValue placeholder={index === 0 ? "Degree level *" : "Level"} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="associate">Associate</SelectItem>
                                <SelectItem value="bachelor">Bachelor</SelectItem>
                                <SelectItem value="master">Master</SelectItem>
                                <SelectItem value="doctorate">Doctorate</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="text"
                              placeholder={index === 0 ? "Major or program *" : "Add another degree..."}
                              value={degree.name}
                              onChange={(e) => updateDegree(index, "name", e.target.value)}
                              className={`h-8 text-sm px-2.5 ${index === 0 ? "placeholder:text-stone-700" : ""}`}
                            />
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="GPA (optional)"
                              value={degree.gpa || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                  updateDegree(index, "gpa", val);
                                }
                              }}
                              className="h-8 text-sm px-2.5"
                            />
                          </div>
                        </div>
                        {/* Show remove button for all filled rows except if it's the only one */}
                        {degree.name && formData.degrees.filter(d => d.name).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDegree(index)}
                            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove degree"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

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

              {/* Work Experience */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Which of these have you done in a work or volunteer setting? (Optional, select all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    "Managed people or led a team",
                    "Handled money or budgets",
                    "Used specialized software or tools",
                    "Worked with customers or clients",
                    "Built or repaired things",
                    "Taught or trained others",
                    "Wrote reports or documents",
                    "Analyzed data or solved technical problems",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workExperience.includes(item)}
                        onChange={(e) =>
                          handleExperienceToggle(item, e.target.checked)
                        }
                        className="w-5 h-5 text-lime-600 rounded focus:ring-lime-600 focus:ring-offset-0"
                      />
                      <span className="text-stone-700">{item}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-stone-500 mt-2">
                  This helps us identify transferable skills you already have.
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

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Edit2, Sparkles } from "lucide-react";
import { useState } from "react";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

// Label mappings for displaying human-readable values
const ageRangeLabels: Record<string, string> = {
  "under-18": "Under 18",
  "18-24": "18-24",
  "25-34": "25-34",
  "35-44": "35-44",
  "45-54": "45-54",
  "55-plus": "55+",
};

const educationLabels: Record<string, string> = {
  "high-school": "Currently in High School",
  "hs-graduate": "High School Graduate",
  "some-college": "Some College",
  "associates": "Associate's Degree",
  "bachelors": "Bachelor's Degree",
  "masters": "Master's Degree or Higher",
  "trade-cert": "Trade School/Certification",
};

const employmentLabels: Record<string, string> = {
  "student": "Full-time Student",
  "employed-ft": "Employed Full-time",
  "employed-pt": "Employed Part-time",
  "unemployed": "Unemployed",
  "self-employed": "Self-employed",
  "retired": "Retired",
  "other": "Other",
};

// Challenges label mappings
const financialLabels: Record<string, string> = {
  "no-constraints": "No major financial constraints",
  "some-savings": "Some savings available",
  "need-financial-aid": "Will need financial aid/loans",
  "limited-funds": "Very limited funds available",
  "working-while-learning": "Must work while learning",
};

const timeLabels: Record<string, string> = {
  "full-time": "Full-time (40+ hours/week)",
  "part-time": "Part-time (20-40 hours/week)",
  "evenings-weekends": "Evenings and weekends only",
  "very-limited": "Very limited (under 10 hours/week)",
  "flexible": "Flexible schedule",
};

const locationLabels: Record<string, string> = {
  "yes-anywhere": "Willing to relocate anywhere",
  "same-region": "Within same region/state",
  "local-only": "Must stay in current area",
  "remote-preferred": "Prefer remote opportunities",
};

const familyLabels: Record<string, string> = {
  "none": "No significant obligations",
  "childcare": "Childcare responsibilities",
  "elder-care": "Elder care responsibilities",
  "both": "Both childcare and elder care",
  "other": "Other family obligations",
};

const transportationLabels: Record<string, string> = {
  "own-vehicle": "Own reliable vehicle",
  "public-transit": "Rely on public transportation",
  "limited": "Limited transportation options",
  "none": "No reliable transportation",
};

const healthLabels: Record<string, string> = {
  "none": "No limitations",
  "physical": "Physical limitations",
  "mental-health": "Mental health considerations",
  "chronic-condition": "Chronic health condition",
  "prefer-not-say": "Prefer not to say",
};

const supportLabels: Record<string, string> = {
  "strong": "Strong family/friend support",
  "some": "Some support available",
  "limited": "Limited support",
  "independent": "Mostly independent",
};

// Personality questions for displaying answers
const personalityQuestions: Record<string, { text: string; options: Record<number, string> }> = {
  work_environment: {
    text: "Work Environment",
    options: {
      1: "Traditional office with structured hours",
      2: "Remote/flexible location and schedule",
      3: "Outdoors or field-based work",
      4: "Mix of office and external locations",
    },
  },
  interaction_style: {
    text: "Interaction Style",
    options: {
      1: "Mostly solo with occasional collaboration",
      2: "Small team of 2-5 people",
      3: "Large team with defined roles",
      4: "Constantly interacting with new people",
    },
  },
  decision_making: {
    text: "Decision Making",
    options: {
      1: "Logic, data, and objective analysis",
      2: "Intuition and gut feelings",
      3: "Input from others and consensus",
      4: "Past experiences and proven methods",
    },
  },
  structure: {
    text: "Work Structure",
    options: {
      1: "Highly structured with clear routines",
      2: "Some structure with room for flexibility",
      3: "Flexible with minimal rigid schedules",
      4: "Constantly changing and unpredictable",
    },
  },
  energy_source: {
    text: "Energy Source",
    options: {
      1: "Working independently on focused tasks",
      2: "Collaborating closely with a partner",
      3: "Leading or presenting to groups",
      4: "Networking and meeting new people",
    },
  },
  problem_solving: {
    text: "Problem Solving",
    options: {
      1: "Research thoroughly before taking action",
      2: "Jump in and learn by doing",
      3: "Brainstorm multiple creative solutions",
      4: "Follow established best practices",
    },
  },
  communication: {
    text: "Communication Style",
    options: {
      1: "Written (emails, documents, reports)",
      2: "Verbal one-on-one conversations",
      3: "Group discussions and meetings",
      4: "Visual (presentations, diagrams)",
    },
  },
  pace: {
    text: "Work Pace",
    options: {
      1: "Steady and consistent throughout the day",
      2: "Intense bursts with breaks in between",
      3: "Slow build to deadlines",
      4: "Fast-paced and constantly shifting",
    },
  },
  schedule: {
    text: "Preferred Schedule",
    options: {
      1: "Standard weekday hours (9-5 or similar)",
      2: "Flexible hours I can set myself",
      3: "Rotating shifts (including nights/weekends)",
      4: "On-call or variable as needed",
    },
  },
  travel: {
    text: "Travel Preference",
    options: {
      1: "Prefer no travel, stay in one location",
      2: "Occasional day trips are fine",
      3: "Regular travel (few times per month)",
      4: "Extensive travel or constantly on-the-go",
    },
  },
  physical_demands: {
    text: "Physical Activity Level",
    options: {
      1: "Sedentary - desk/computer work",
      2: "Light - occasional standing/walking",
      3: "Moderate - regular physical activity",
      4: "Heavy - physically demanding work",
    },
  },
};

// Values labels
const valuesLabels: Record<string, string> = {
  work_life_balance: "Work-Life Balance",
  income_potential: "High Income Potential",
  helping_others: "Helping Others",
  creativity: "Creativity & Innovation",
  job_security: "Job Security & Stability",
  independence: "Independence & Autonomy",
  leadership: "Leadership Opportunities",
  learning_growth: "Learning & Growth",
  recognition: "Recognition & Status",
  physical_activity: "Physical Activity",
  environmental_impact: "Environmental Impact",
  variety: "Work Variety",
};

// Aptitude category labels
const aptitudeLabels: Record<string, string> = {
  stem: "STEM",
  arts: "Arts & Creative",
  communication: "Communication & Media",
  business: "Business & Finance",
  healthcare: "Healthcare & Medicine",
  trades: "Skilled Trades",
  socialServices: "Social Services & Education",
  law: "Law & Public Service",
};

export const Route = createFileRoute("/intake/review")({
  component: ReviewPage,
  head: () => ({
    meta: [
      {
        title: "Review Your Assessment | Compass Coaching",
      },
    ],
  }),
});

function ReviewPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();
  const basicData = useAssessmentStore((state) => state.basic);
  const personalityData = useAssessmentStore((state) => state.personality);
  const valuesData = useAssessmentStore((state) => state.values);
  const aptitudeData = useAssessmentStore((state) => state.aptitude);
  const challengesData = useAssessmentStore((state) => state.challenges);
  const compileResults = useAssessmentStore((state) => state.compileResults);
  const isComplete = useAssessmentStore((state) => state.isComplete);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Compile and save results
      const results = compileResults();

      if (!results) {
        alert("Please complete all sections before submitting.");
        setIsSubmitting(false);
        return;
      }

      // Simulate API submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to results page
      navigate({ to: "/intake/results" });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("There was an error submitting your assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const allSectionsComplete = isComplete();

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-6 pb-40">
        <Container size="sm">
          <div className="animate-pulse space-y-6">
            <div className="p-6 bg-stone-100 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-stone-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-stone-200 rounded w-1/3" />
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                </div>
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-200 rounded-full" />
                    <div className="h-5 bg-stone-200 rounded w-1/4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                    <div className="h-4 bg-stone-200 rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6 pb-40">
      <Container size="sm">

        {/* Review Header */}
        <div className="mb-8 p-6 bg-linear-to-br from-lime-50 to-stone-50 border-2 border-lime-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-stone-700 mb-2">
                Review Your Answers
              </h1>
              <p className="text-stone-700">
                Take a moment to review your responses. You can edit any section
                before submitting. Once you submit, we'll generate your
                personalized career recommendations!
              </p>
            </div>
          </div>
        </div>

        {/* Review Sections */}
        <div className="space-y-6 mb-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <CardTitle>Basic Information</CardTitle>
                </div>
                <Link
                  to="/intake/basic"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {basicData ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-stone-600">Name</dt>
                    <dd className="text-stone-700 mt-1">{basicData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Age Range
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {ageRangeLabels[basicData.ageRange] || basicData.ageRange}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Education Level
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {educationLabels[basicData.educationLevel] || basicData.educationLevel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Employment Status
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {employmentLabels[basicData.employmentStatus] || basicData.employmentStatus}
                    </dd>
                  </div>
                  {basicData.primaryReason && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-stone-600">
                        Primary Reason
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {basicData.primaryReason}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-stone-500 italic">No data saved yet</p>
              )}
            </CardContent>
          </Card>

          {/* Personality */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <CardTitle>Personality & Work Style</CardTitle>
                </div>
                <Link
                  to="/intake/personality"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {personalityData ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(personalityData).map(([key, value]) => {
                    const question = personalityQuestions[key];
                    if (!question) return null;
                    return (
                      <div key={key}>
                        <dt className="text-sm font-medium text-stone-600">
                          {question.text}
                        </dt>
                        <dd className="text-stone-700 mt-1">
                          {question.options[value as number] || value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="text-stone-500 italic">No data saved yet</p>
              )}
            </CardContent>
          </Card>

          {/* Values */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <CardTitle>Core Values</CardTitle>
                </div>
                <Link
                  to="/intake/values"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {valuesData ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-stone-600 mb-2">Top Priorities (rated 4-5)</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(valuesData)
                        .filter(([_, rating]) => (rating as number) >= 4)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([key, rating]) => (
                          <Badge key={key} variant="success">
                            {valuesLabels[key] || key.replace(/_/g, " ")} ({rating})
                          </Badge>
                        ))}
                      {Object.entries(valuesData).filter(([_, r]) => (r as number) >= 4).length === 0 && (
                        <span className="text-stone-500 text-sm">None rated highly</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-stone-600 mb-2">Lower Priority (rated 1-2)</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(valuesData)
                        .filter(([_, rating]) => (rating as number) <= 2)
                        .map(([key, rating]) => (
                          <Badge key={key} variant="default">
                            {valuesLabels[key] || key.replace(/_/g, " ")} ({rating})
                          </Badge>
                        ))}
                      {Object.entries(valuesData).filter(([_, r]) => (r as number) <= 2).length === 0 && (
                        <span className="text-stone-500 text-sm">None rated low</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-stone-500 italic">No data saved yet</p>
              )}
            </CardContent>
          </Card>

          {/* Aptitude */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <CardTitle>Skills & Interests</CardTitle>
                </div>
                <Link
                  to="/intake/aptitude"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {aptitudeData ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-stone-600">Interest by Category (avg score)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(aptitudeData)
                      .map(([key, ratings]) => {
                        const arr = ratings as number[];
                        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
                        return { key, avg };
                      })
                      .sort((a, b) => b.avg - a.avg)
                      .map(({ key, avg }) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg text-center ${
                            avg >= 3.5
                              ? "bg-lime-100 border border-lime-300"
                              : avg >= 2.5
                                ? "bg-stone-100 border border-stone-200"
                                : "bg-stone-50 border border-stone-100"
                          }`}
                        >
                          <div className="text-sm font-medium text-stone-700">
                            {aptitudeLabels[key] || key}
                          </div>
                          <div className={`text-lg font-bold ${avg >= 3.5 ? "text-lime-700" : "text-stone-600"}`}>
                            {avg.toFixed(1)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-stone-500 italic">No data saved yet</p>
              )}
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <CardTitle>Challenges & Constraints</CardTitle>
                </div>
                <Link
                  to="/intake/challenges"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {challengesData ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Financial Situation
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {financialLabels[challengesData.financial] || challengesData.financial}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Time Availability
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {timeLabels[challengesData.timeAvailability] || challengesData.timeAvailability}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Location Flexibility
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {locationLabels[challengesData.locationFlexibility] || challengesData.locationFlexibility}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Support System
                    </dt>
                    <dd className="text-stone-700 mt-1">
                      {supportLabels[challengesData.supportSystem] || challengesData.supportSystem}
                    </dd>
                  </div>
                  {challengesData.familyObligations && (
                    <div>
                      <dt className="text-sm font-medium text-stone-600">
                        Family Obligations
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {familyLabels[challengesData.familyObligations] || challengesData.familyObligations}
                      </dd>
                    </div>
                  )}
                  {challengesData.transportation && (
                    <div>
                      <dt className="text-sm font-medium text-stone-600">
                        Transportation
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {transportationLabels[challengesData.transportation] || challengesData.transportation}
                      </dd>
                    </div>
                  )}
                  {challengesData.healthConsiderations && (
                    <div>
                      <dt className="text-sm font-medium text-stone-600">
                        Health Considerations
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {healthLabels[challengesData.healthConsiderations] || challengesData.healthConsiderations}
                      </dd>
                    </div>
                  )}
                  {challengesData.educationGaps && challengesData.educationGaps.length > 0 && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-stone-600">
                        Areas Needing Preparation
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {challengesData.educationGaps.join(", ")}
                      </dd>
                    </div>
                  )}
                  {challengesData.additionalNotes && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-stone-600">
                        Additional Notes
                      </dt>
                      <dd className="text-stone-700 mt-1">
                        {challengesData.additionalNotes}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-stone-500 italic">No data saved yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Section */}
        <Card className="border-2 border-lime-200 bg-linear-to-br from-lime-50 to-stone-50">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-600 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-stone-700 mb-3">
                Ready to Get Your Results?
              </h2>
              <p className="text-stone-700 mb-6 max-w-2xl mx-auto">
                We'll analyze your responses and provide personalized career
                recommendations, educational pathways, and next steps tailored
                specifically for you.
              </p>

              <AssessmentFooter
                currentStep={5}
                isReview
                backTo="/intake/challenges"
                backLabel="Back to Challenges"
                nextLabel={
                  isSubmitting ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Generating Results...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get My Results
                    </>
                  )
                }
                nextDisabled={!allSectionsComplete || isSubmitting}
                nextButtonType="button"
                onNext={handleSubmit}
                showNextArrow={false}
              />

              {!allSectionsComplete && (
                <p className="text-error-600 mt-4 text-sm text-center">
                  Please complete all sections before submitting
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

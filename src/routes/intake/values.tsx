import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/values")({
  component: ValuesPage,
  head: () => ({
    meta: [
      { title: "Values Assessment | Compass Coaching" },
      { name: "description", content: "Identify your core career values and what matters most to you in a work environment." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const values = [
  {
    id: "work_life_balance",
    label: "Work-Life Balance",
    description: "Having time for personal life, hobbies, and family",
  },
  {
    id: "income_potential",
    label: "High Income Potential",
    description: "Earning a substantial salary and financial security",
  },
  {
    id: "helping_others",
    label: "Helping Others",
    description: "Making a positive impact on people's lives",
  },
  {
    id: "creativity",
    label: "Creativity & Innovation",
    description: "Expressing creativity and developing new ideas",
  },
  {
    id: "job_security",
    label: "Job Security & Stability",
    description: "Having a stable, predictable career path",
  },
  {
    id: "independence",
    label: "Independence & Autonomy",
    description: "Working independently with minimal supervision",
  },
  {
    id: "leadership",
    label: "Leadership Opportunities",
    description: "Leading teams and influencing decisions",
  },
  {
    id: "learning_growth",
    label: "Learning & Growth",
    description: "Continuous learning and professional development",
  },
  {
    id: "recognition",
    label: "Recognition & Status",
    description: "Being recognized for achievements and expertise",
  },
  {
    id: "physical_activity",
    label: "Physical Activity",
    description: "Staying active and moving throughout the day",
  },
  {
    id: "environmental_impact",
    label: "Environmental Impact",
    description: "Contributing to sustainability and protecting nature",
  },
  {
    id: "variety",
    label: "Work Variety",
    description: "Diverse tasks and new challenges regularly",
  },
];

function ValuesPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();

  // Read directly from store - auto-updates on any change
  const valuesData = useAssessmentStore((state) => state.values);
  const updateValues = useAssessmentStore((state) => state.updateValues);

  // Safe accessor with default
  const ratings = valuesData || {};

  const handleRating = (valueId: string, rating: number) => {
    updateValues({ [valueId]: rating });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/aptitude" });
  };

  const progress = (Object.keys(ratings).length / values.length) * 100;
  const isComplete = Object.keys(ratings).length === values.length;

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
                    <div className="h-5 bg-stone-200 rounded w-1/3" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-8 w-8 bg-stone-200 rounded-full" />
                      ))}
                    </div>
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
              <CardTitle className="text-2xl">Your Core Values</CardTitle>
              <p className="text-stone-600 mt-2">
                Rate how important each value is to you in your ideal career. Be
                honest - there are no right answers!
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-stone-500">Scale:</span>
                <span className="text-stone-700 font-medium">
                  1 = Not Important
                </span>
                <span className="text-stone-400">→</span>
                <span className="text-stone-700 font-medium">
                  5 = Extremely Important
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="pb-6 border-b border-stone-200 last:border-0 last:pb-0"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-stone-700">
                      {value.label}
                    </h3>
                    <p className="text-sm text-stone-600">
                      {value.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRating(value.id, rating)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                          ratings[value.id] === rating
                            ? "border-lime-600 bg-lime-600 text-white"
                            : "border-stone-200 text-stone-600 hover:border-lime-300 hover:bg-lime-50"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>

                  {ratings[value.id] && (
                    <div className="mt-2 text-sm text-stone-600">
                      Selected:{" "}
                      <span className="font-medium text-lime-700">
                        {ratings[value.id] === 1 && "Not Important"}
                        {ratings[value.id] === 2 && "Somewhat Important"}
                        {ratings[value.id] === 3 && "Moderately Important"}
                        {ratings[value.id] === 4 && "Very Important"}
                        {ratings[value.id] === 5 && "Extremely Important"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <AssessmentFooter
            currentStep={3}
            backTo="/intake/personality"
            backLabel="Back to Personality"
            nextLabel="Next: Aptitude"
            nextDisabled={!isComplete}
            nextButtonType="submit"
            sectionProgress={progress}
          />
        </form>
      </Container>
    </div>
  );
}

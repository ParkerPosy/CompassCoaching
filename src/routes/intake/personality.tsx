import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/personality")({
  component: PersonalityPage,
  head: () => ({
    meta: [
      {
        title: "Personality Assessment | Compass Coaching",
      },
    ],
  }),
});

const questions = [
  {
    id: "work_environment",
    text: "What type of work environment appeals to you most?",
    options: [
      { value: 1, label: "Traditional office with structured hours" },
      { value: 2, label: "Remote/flexible location and schedule" },
      { value: 3, label: "Outdoors or field-based work" },
      { value: 4, label: "Mix of office and external locations" },
    ],
  },
  {
    id: "interaction_style",
    text: "How do you prefer to work with others?",
    options: [
      { value: 1, label: "Mostly solo with occasional collaboration" },
      { value: 2, label: "Small team of 2-5 people" },
      { value: 3, label: "Large team with defined roles" },
      { value: 4, label: "Constantly interacting with new people" },
    ],
  },
  {
    id: "decision_making",
    text: "When making important decisions, you tend to rely more on:",
    options: [
      { value: 1, label: "Logic, data, and objective analysis" },
      { value: 2, label: "Intuition and gut feelings" },
      { value: 3, label: "Input from others and consensus" },
      { value: 4, label: "Past experiences and proven methods" },
    ],
  },
  {
    id: "structure",
    text: "Which work style suits you best?",
    options: [
      { value: 1, label: "Highly structured with clear routines" },
      { value: 2, label: "Some structure with room for flexibility" },
      { value: 3, label: "Flexible with minimal rigid schedules" },
      { value: 4, label: "Constantly changing and unpredictable" },
    ],
  },
  {
    id: "energy_source",
    text: "You feel most energized when:",
    options: [
      { value: 1, label: "Working independently on focused tasks" },
      { value: 2, label: "Collaborating closely with a partner" },
      { value: 3, label: "Leading or presenting to groups" },
      { value: 4, label: "Networking and meeting new people" },
    ],
  },
  {
    id: "problem_solving",
    text: "When faced with a challenge, you prefer to:",
    options: [
      { value: 1, label: "Research thoroughly before taking action" },
      { value: 2, label: "Jump in and learn by doing" },
      { value: 3, label: "Brainstorm multiple creative solutions" },
      { value: 4, label: "Follow established best practices" },
    ],
  },
  {
    id: "communication",
    text: "Your preferred communication style is:",
    options: [
      { value: 1, label: "Written (emails, documents, reports)" },
      { value: 2, label: "Verbal one-on-one conversations" },
      { value: 3, label: "Group discussions and meetings" },
      { value: 4, label: "Visual (presentations, diagrams)" },
    ],
  },
  {
    id: "pace",
    text: "What work pace suits you best?",
    options: [
      { value: 1, label: "Steady and consistent throughout the day" },
      { value: 2, label: "Intense bursts with breaks in between" },
      { value: 3, label: "Slow build to deadlines" },
      { value: 4, label: "Fast-paced and constantly shifting" },
    ],
  },
  {
    id: "schedule",
    text: "What type of work schedule would you prefer?",
    options: [
      { value: 1, label: "Standard weekday hours (9-5 or similar)" },
      { value: 2, label: "Flexible hours I can set myself" },
      { value: 3, label: "Rotating shifts (including nights/weekends)" },
      { value: 4, label: "On-call or variable as needed" },
    ],
  },
  {
    id: "travel",
    text: "How do you feel about travel for work?",
    options: [
      { value: 1, label: "Prefer no travel, stay in one location" },
      { value: 2, label: "Occasional day trips are fine" },
      { value: 3, label: "Regular travel (few times per month)" },
      { value: 4, label: "Extensive travel or constantly on-the-go" },
    ],
  },
  {
    id: "physical_demands",
    text: "What level of physical activity do you want in your work?",
    options: [
      { value: 1, label: "Sedentary - desk/computer work" },
      { value: 2, label: "Light - occasional standing/walking" },
      { value: 3, label: "Moderate - regular physical activity" },
      { value: 4, label: "Heavy - physically demanding work" },
    ],
  },
];

function PersonalityPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();

  // Read directly from store - auto-updates on any change
  const personality = useAssessmentStore((state) => state.personality);
  const updatePersonality = useAssessmentStore((state) => state.updatePersonality);

  // Safe accessor with default
  const answers = personality || {};

  const handleAnswer = (questionId: string, value: number) => {
    updatePersonality({ [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/values" });
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isComplete = Object.keys(answers).length === questions.length;

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
              <CardContent className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-5 bg-stone-200 rounded w-2/3" />
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-10 bg-stone-200 rounded flex-1" />
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
              <CardTitle className="text-2xl">
                Personality & Work Style
              </CardTitle>
              <p className="text-stone-600 mt-2">
                These questions help us understand your preferred work
                environment and style.
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-6 border-b border-stone-200 last:border-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-stone-700 mb-4">
                    {index + 1}. {question.text}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[question.id] === option.value
                            ? "border-lime-600 bg-lime-50"
                            : "border-stone-200 hover:border-lime-300 hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() =>
                            handleAnswer(question.id, option.value)
                          }
                          className="mt-1 w-4 h-4 text-lime-600 focus:ring-lime-600 focus:ring-offset-0"
                        />
                        <span className="text-stone-700 flex-1">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <AssessmentFooter
            currentStep={2}
            backTo="/intake/basic"
            backLabel="Back to Basic Info"
            nextLabel="Next: Values"
            nextDisabled={!isComplete}
            nextButtonType="submit"
            sectionProgress={progress}
          />
        </form>
      </Container>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/personality")({
  component: PersonalityPage,
  head: () => ({
    meta: [
      {
        title: "Personality Assessment - Compass Coaching",
      },
    ],
  }),
});

interface PersonalityAnswers {
  [key: string]: number;
}

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
];

function PersonalityPage() {
  const navigate = useNavigate();
  const personality = useAssessmentStore((state) => state.personality);
  const setPersonality = useAssessmentStore((state) => state.setPersonality);

  // Initialize form with store data or empty values
  const [answers, setAnswers] = useState<PersonalityAnswers>(
    () => personality || {},
  );

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonality(answers);
    navigate({ to: "/intake/values" });
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-600">
              Section 2 of 5
            </span>
            <span className="text-sm font-medium text-stone-600">
              40% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-600 transition-all duration-500"
              style={{ width: "40%" }}
            />
          </div>
          <div className="mt-2 text-sm text-stone-600">
            {Object.keys(answers).length} of {questions.length} questions
            answered
          </div>
        </div>

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
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">
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

          {/* Section Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone-600">
                Section Progress
              </span>
              <span className="text-sm font-medium text-lime-700">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/intake/basic"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Link>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                Save Progress
              </button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isComplete}
                className="inline-flex items-center gap-2"
              >
                Next: Values
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

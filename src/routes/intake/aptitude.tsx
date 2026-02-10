import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentFooter } from "@/components/assessment/AssessmentFooter";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore, useHasHydrated } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/aptitude")({
  component: AptitudeAssessmentPage,
  head: () => ({
    meta: [
      {
        title: "Aptitude Assessment | Compass Coaching",
      },
      {
        name: "description",
        content:
          "Discover your natural aptitudes and interests across various career fields.",
      },
    ],
  }),
});

interface AptitudeData {
  stem: number[];
  arts: number[];
  communication: number[];
  business: number[];
  healthcare: number[];
  trades: number[];
  socialServices: number[];
  law: number[];
}

const aptitudeCategories = [
  {
    key: "stem" as keyof AptitudeData,
    title: "STEM (Science, Technology, Engineering, Math)",
    items: [
      "Working with numbers and data",
      "Solving technical problems",
      "Using technology and computers",
      "Conducting experiments or research",
    ],
  },
  {
    key: "arts" as keyof AptitudeData,
    title: "Arts & Creative Fields",
    items: [
      "Creating visual art or design",
      "Writing or storytelling",
      "Performing (music, theater, dance)",
      "Working with my hands to create things",
    ],
  },
  {
    key: "communication" as keyof AptitudeData,
    title: "Communication & Media",
    items: [
      "Public speaking or presenting",
      "Writing professionally",
      "Marketing or advertising",
      "Journalism or broadcasting",
    ],
  },
  {
    key: "business" as keyof AptitudeData,
    title: "Business & Finance",
    items: [
      "Managing projects or teams",
      "Analyzing financial data",
      "Sales or customer relations",
      "Entrepreneurship",
    ],
  },
  {
    key: "healthcare" as keyof AptitudeData,
    title: "Healthcare & Medicine",
    items: [
      "Helping people with health concerns",
      "Medical or scientific research",
      "Physical or mental health counseling",
      "Emergency response or crisis intervention",
    ],
  },
  {
    key: "trades" as keyof AptitudeData,
    title: "Skilled Trades",
    items: [
      "Building or construction",
      "Mechanical repair and maintenance",
      "Electrical or plumbing work",
      "Working with tools and equipment",
    ],
  },
  {
    key: "socialServices" as keyof AptitudeData,
    title: "Social Services & Education",
    items: [
      "Teaching or training others",
      "Social work or counseling",
      "Community organizing",
      "Child or elder care",
    ],
  },
  {
    key: "law" as keyof AptitudeData,
    title: "Law, Policy & Public Service",
    items: [
      "Legal research and advocacy",
      "Public policy or government work",
      "Law enforcement or security",
      "Environmental or social justice",
    ],
  },
];

function AptitudeAssessmentPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();

  // Read directly from store - auto-updates on any change
  const aptitudeData = useAssessmentStore((state) => state.aptitude);
  const updateAptitude = useAssessmentStore((state) => state.updateAptitude);

  const defaultFormData: AptitudeData = {
    stem: [0, 0, 0, 0],
    arts: [0, 0, 0, 0],
    communication: [0, 0, 0, 0],
    business: [0, 0, 0, 0],
    healthcare: [0, 0, 0, 0],
    trades: [0, 0, 0, 0],
    socialServices: [0, 0, 0, 0],
    law: [0, 0, 0, 0],
  };

  // Safe accessor with defaults
  const formData: AptitudeData = {
    stem: aptitudeData?.stem || defaultFormData.stem,
    arts: aptitudeData?.arts || defaultFormData.arts,
    communication: aptitudeData?.communication || defaultFormData.communication,
    business: aptitudeData?.business || defaultFormData.business,
    healthcare: aptitudeData?.healthcare || defaultFormData.healthcare,
    trades: aptitudeData?.trades || defaultFormData.trades,
    socialServices: aptitudeData?.socialServices || defaultFormData.socialServices,
    law: aptitudeData?.law || defaultFormData.law,
  };

  const handleRatingChange = (
    category: keyof AptitudeData,
    index: number,
    rating: number,
  ) => {
    const currentCategoryRatings = formData[category];
    const updatedRatings = currentCategoryRatings.map((val, i) =>
      i === index ? rating : val
    );
    updateAptitude({ [category]: updatedRatings });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/intake/challenges" });
  };

  const allQuestionsAnswered = Object.values(formData).every(
    (categoryRatings) => categoryRatings.every((rating: number) => rating > 0),
  );

  // Calculate section progress
  const totalQuestions = Object.values(formData).reduce(
    (sum, categoryRatings) => sum + categoryRatings.length,
    0,
  );
  const answeredQuestions = Object.values(formData).reduce(
    (sum, categoryRatings) =>
      sum + categoryRatings.filter((rating: number) => rating > 0).length,
    0,
  );
  const sectionProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

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
                    <div className="h-5 bg-stone-200 rounded w-1/4" />
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-1/2" />
                        <div className="h-2 bg-stone-200 rounded" />
                      </div>
                    ))}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Aptitude & Interests</CardTitle>
              <p className="text-stone-600 mt-2">
                Rate your interest and aptitude in different career fields. Be
                honest about what genuinely interests you, not just what you
                think you "should" pursue.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {aptitudeCategories.map((category) => (
                <div key={category.key} className="space-y-4">
                  <h3 className="text-lg font-semibold text-stone-700">
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={item} className="space-y-2">
                        <label
                          htmlFor={`${category.key}-${item}`}
                          className="block text-sm font-medium text-stone-700"
                        >
                          {item}
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                handleRatingChange(
                                  category.key,
                                  itemIndex,
                                  rating,
                                )
                              }
                              className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                                formData[category.key][itemIndex] === rating
                                  ? "bg-lime-600 text-white border-lime-600"
                                  : "bg-white text-stone-700 border-stone-300 hover:border-lime-600"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>Not interested</span>
                          <span>Very interested</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <AssessmentFooter
            currentStep={4}
            backTo="/intake/values"
            backLabel="Back to Values"
            nextLabel="Next: Challenges"
            nextDisabled={!allQuestionsAnswered}
            nextButtonType="submit"
            sectionProgress={sectionProgress}
          />
        </form>
      </Container>
    </div>
  );
}

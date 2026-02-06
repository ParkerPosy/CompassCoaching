import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Edit2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore } from "@/stores/assessmentStore";

export const Route = createFileRoute("/intake/review")({
  component: ReviewPage,
  head: () => ({
    meta: [
      {
        title: "Review Your Assessment - Compass Coaching",
      },
    ],
  }),
});

function ReviewPage() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-lime-700">
              Assessment Complete!
            </span>
            <span className="text-sm font-medium text-lime-700">100%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-600 transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Review Header */}
        <div className="mb-8 p-6 bg-linear-to-br from-lime-50 to-stone-50 border-2 border-lime-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
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
                    <dd className="text-stone-900 mt-1">{basicData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Age Range
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {basicData.ageRange}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Education Level
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {basicData.educationLevel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Employment Status
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {basicData.employmentStatus}
                    </dd>
                  </div>
                  {basicData.primaryReason && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-stone-600">
                        Primary Reason
                      </dt>
                      <dd className="text-stone-900 mt-1">
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
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    {Object.keys(personalityData).length} questions answered
                  </Badge>
                  <span className="text-stone-600 text-sm">
                    All questions completed
                  </span>
                </div>
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
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="success">
                      {Object.keys(valuesData).length} values rated
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(valuesData)
                      .filter(([_, rating]) => (rating as number) >= 4)
                      .slice(0, 5)
                      .map(([key]) => (
                        <Badge key={key} variant="default">
                          {key.replace(/_/g, " ")}
                        </Badge>
                      ))}
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
                <Badge variant="success">
                  {Object.keys(aptitudeData).length} items rated
                </Badge>
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
                    <dd className="text-stone-900 mt-1">
                      {challengesData.financial}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Time Availability
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {challengesData.timeAvailability}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Location Flexibility
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {challengesData.locationFlexibility}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-600">
                      Support System
                    </dt>
                    <dd className="text-stone-900 mt-1">
                      {challengesData.supportSystem}
                    </dd>
                  </div>
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
              <h2 className="text-2xl font-bold text-stone-900 mb-3">
                Ready to Get Your Results?
              </h2>
              <p className="text-stone-700 mb-6 max-w-2xl mx-auto">
                We'll analyze your responses and provide personalized career
                recommendations, educational pathways, and next steps tailored
                specifically for you.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/intake/challenges"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-white transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Edit
                </Link>

                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="lg"
                  disabled={!allSectionsComplete || isSubmitting}
                  className="inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Generating Results...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get My Results
                    </>
                  )}
                </Button>
              </div>

              {!allSectionsComplete && (
                <p className="text-error-600 mt-4 text-sm">
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

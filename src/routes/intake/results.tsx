import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Download,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeAssessment } from "@/lib/analyzer";
import { useAssessmentStore } from "@/stores/assessmentStore";
import type { AssessmentAnalysis, AssessmentResults } from "@/types/assessment";

export const Route = createFileRoute("/intake/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      {
        title: "Your Career Assessment Results - Compass Coaching",
      },
      {
        name: "description",
        content:
          "View your personalized career assessment results and recommendations.",
      },
    ],
  }),
});

function ResultsPage() {
  const navigate = useNavigate();
  const storedResults = useAssessmentStore((state) => state.results);
  const [analysis, setAnalysis] = useState<AssessmentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from store
    if (!storedResults) {
      // No results found, redirect to intake
      navigate({ to: "/intake" });
      return;
    }

    // Analyze results
    const analyzedData = analyzeAssessment(storedResults);
    setAnalysis(analyzedData);
    setLoading(false);
  }, [navigate, storedResults]);

  if (loading || !storedResults || !analysis) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container>
        <SectionHeader
          icon={Award}
          iconBgColor="bg-lime-400"
          title="Your Career Assessment Results"
          subtitle={`Hi ${storedResults.basic.name}! Here's what we discovered about you.`}
        />
        <p className="text-sm text-stone-500">
          Completed on{" "}
          {new Date(storedResults.completedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Top Career Fields */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Top Career Fields
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis?.topCareerFields.map((field, index) => (
              <Card
                key={index}
                className="border-2 border-lime-200 hover:border-lime-400 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="primary" size="sm">
                      #{index + 1} Match
                    </Badge>
                    <span className="text-2xl font-bold text-lime-600">
                      {field.score}%
                    </span>
                  </div>
                  <CardTitle className="text-xl">{field.field}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 mb-4">{field.description}</p>
                  <ProgressBar
                    value={field.score}
                    color="lime"
                    size="md"
                    showPercentage={false}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Values */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Core Values
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {analysis?.topValues.map((value, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-lime-700">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-stone-900">
                          {value.value}
                        </h3>
                        <span className="text-sm font-medium text-lime-600">
                          {value.score}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5">
                        <div
                          className="bg-lime-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${value.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Personality Insights */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Personality Insights
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {analysis?.personalityInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <span className="text-stone-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Personalized Recommendations
            </h2>
          </div>
          <Card className="bg-lime-50 border-2 border-lime-200">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {analysis?.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-stone-800">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-lime-600" />
            <h2 className="text-3xl font-bold text-stone-900">
              Your Next Steps
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <ol className="space-y-4">
                {analysis?.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-stone-700">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-stone-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Download Results (PDF)
          </Button>
          <Link
            to="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-200 text-stone-900 hover:bg-stone-300 active:bg-stone-400 focus:ring-stone-300 px-6 py-3 text-lg"
          >
            Explore Resources
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/intake/review"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Review
          </Link>
        </div>
      </Container>
    </div>
  );
}

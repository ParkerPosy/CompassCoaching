import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Download, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CATEGORY_COLOR_STYLES,
  getResourcesByCategory,
  RESOURCE_CATEGORIES,
  type CategoryColor,
  type Resource,
} from "@/data/resources";

// Category hero pattern - uses color from category data
function CategoryPattern({ color }: { color: CategoryColor }) {
  const colorStyle = CATEGORY_COLOR_STYLES[color];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="categoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStyle.gradient[0]} stopOpacity="1" />
            <stop offset="50%" stopColor={colorStyle.gradient[1]} stopOpacity="1" />
            <stop offset="100%" stopColor={colorStyle.gradient[2]} stopOpacity="0.7" />
          </linearGradient>
          <pattern id="categoryDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(${colorStyle.accent}, 0.2)`} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#categoryGradient)" />
        <rect width="100%" height="100%" fill="url(#categoryDots)" />

        {/* Soft floating shapes */}
        <circle cx="15%" cy="40%" r="60" fill={`rgba(${colorStyle.accent}, 0.1)`} />
        <circle cx="80%" cy="50%" r="80" fill={`rgba(${colorStyle.accent}, 0.08)`} />
        <circle cx="60%" cy="25%" r="50" fill={`rgba(${colorStyle.accent}, 0.12)`} />
      </svg>
    </div>
  );
}

// Resource type styling
function getResourceTypeStyle(type: string) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    GUIDE: { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
    TOOL: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    ARTICLE: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    TEMPLATE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    WORKSHEET: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    DIRECTORY: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  };
  return styles[type] || styles.GUIDE;
}

export const Route = createFileRoute("/resources/$categorySlug")({
  component: ResourceCategoryPage,
});

function ResourceCategoryPage() {
  const { categorySlug } = Route.useParams();

  // Get category metadata from centralized data
  const category = RESOURCE_CATEGORIES.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-stone-600 mb-6">
            The resource category you're looking for doesn't exist.
          </p>
          <Link to="/resources">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get resources and color styling for this category
  const resources = getResourcesByCategory(category.title);
  const CategoryIcon = category.icon;
  const colors = CATEGORY_COLOR_STYLES[category.color];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <CategoryPattern color={category.color} />

        {/* Back link - floating pill */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-stone-200/50 text-stone-700 hover:text-stone-900 hover:bg-white font-medium transition-all hover:shadow-lg"
          >
            <ArrowLeft className={`w-4 h-4 ${colors.iconText}`} />
            All Resources
          </Link>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center pt-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 ${colors.iconBg} rounded-full mb-6 shadow-lg border-2 ${colors.iconBorder}`}>
              <CategoryIcon className={`w-10 h-10 ${colors.iconText}`} />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              {category.title}
            </h1>
            <p className="text-xl text-stone-700">{category.description}</p>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-10 md:h-14" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,80 1200,60 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-6">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource: Resource) => {
              const typeStyle = getResourceTypeStyle(resource.type);
              return (
                <Card
                  key={resource.title}
                  variant="outlined"
                  className={`${colors.borderHover} transition-all duration-300 hover:shadow-lg hover:scale-[1.01] transform cursor-pointer group`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                        {resource.type}
                      </span>
                      <Badge variant="default" size="sm" className="bg-stone-100 text-stone-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {resource.title}
                      <Download className={`w-5 h-5 text-stone-400 ${colors.iconHoverText} transition-colors`} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600">
                      Download and explore this {resource.type.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-linear-to-br ${colors.ctaFrom} ${colors.ctaTo}`}>
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ctaCategoryDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaCategoryDots)" />
          </svg>

          {/* Flowing shapes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
            <path
              d="M-100,150 C200,200 400,100 700,150 C1000,200 1100,100 1300,150"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="80"
              strokeLinecap="round"
            />
            <path
              d="M-50,200 C250,250 450,150 750,200 C1050,250 1150,150 1350,200"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="60"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Wavy top edge */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,20 600,100 900,60 C1050,40 1150,40 1200,60 L1200,0 L0,0 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center">
            <div className="mb-5 inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              Explore More Resources
            </h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Browse all {RESOURCE_CATEGORIES.length} categories to find exactly what you need
            </p>
            <Link to="/resources">
              <Button
                size="lg"
                className={`bg-white ${colors.ctaButtonText} ${colors.ctaButtonHover} ${colors.ctaButtonFocus} ${colors.ctaButtonActive} shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
              >
                View All Categories
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

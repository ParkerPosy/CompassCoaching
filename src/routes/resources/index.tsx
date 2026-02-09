import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, FileEdit, Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import {
  ALL_RESOURCES,
  CATEGORY_COLOR_STYLES,
  getCategoryPath,
  getResourceCountByCategory,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  type Resource,
} from "@/data/resources";
import { useClickOutside } from "@/hooks";

// Type label mapping
const TYPE_LABELS: Record<string, string> = {
  [RESOURCE_TYPES.VIDEO]: "Video",
  [RESOURCE_TYPES.ARTICLE]: "Article",
  [RESOURCE_TYPES.DOWNLOAD]: "Download",
  [RESOURCE_TYPES.DIRECTORY]: "Directory",
  [RESOURCE_TYPES.TOOL]: "Tool",
  [RESOURCE_TYPES.CHECKLIST]: "Checklist",
  [RESOURCE_TYPES.EXTERNAL]: "External",
  [RESOURCE_TYPES.COURSE]: "Course",
};

// Get time display based on resource type
function getResourceTimeDisplay(resource: Resource): string | null {
  switch (resource.type) {
    case RESOURCE_TYPES.VIDEO:
      return resource.duration;
    case RESOURCE_TYPES.ARTICLE:
      return resource.readTime;
    case RESOURCE_TYPES.TOOL:
    case RESOURCE_TYPES.CHECKLIST:
      return resource.completionTime;
    case RESOURCE_TYPES.COURSE:
      return resource.totalTime;
    default:
      return null;
  }
}

// Subtle pattern for resources hero
function ResourcesPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="resourcesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfccb" stopOpacity="1" />
            <stop offset="50%" stopColor="#d9f99d" stopOpacity="1" />
            <stop offset="100%" stopColor="#bef264" stopOpacity="0.6" />
          </linearGradient>
          <pattern id="resourceDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(163, 230, 53, 0.25)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#resourcesGradient)" />
        <rect width="100%" height="100%" fill="url(#resourceDots)" />

        {/* Soft floating shapes */}
        <circle cx="10%" cy="30%" r="80" fill="rgba(132, 204, 22, 0.12)" />
        <circle cx="85%" cy="60%" r="100" fill="rgba(20, 184, 166, 0.08)" />
        <circle cx="70%" cy="20%" r="60" fill="rgba(163, 230, 53, 0.15)" />
        <circle cx="25%" cy="70%" r="70" fill="rgba(45, 212, 191, 0.1)" />
      </svg>
    </div>
  );
}

export const Route = createFileRoute("/resources/")({
  component: ResourcesIndexPage,
});

function ResourcesIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return ALL_RESOURCES.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query),
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  const handleResourceClick = (category: string) => {
    const path = getCategoryPath(category);
    navigate({ to: path });
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <ResourcesPattern />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg border-2 border-lime-200">
              <BookOpen className="w-10 h-10 text-lime-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Resource Library
            </h1>
            <p className="text-xl text-stone-700 mb-8">
              Free guides, templates, and tools to support your career and
              personal growth
            </p>

            {/* Search Bar with Dropdown */}
            <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 z-10" />
              <Input
                type="text"
                placeholder="Search all resources..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => searchQuery && setShowDropdown(true)}
                className="pl-12 shadow-md border-lime-200 focus:border-lime-400"
              />

              {/* Dropdown Results */}
              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-lime-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                  {filteredResources.length > 0 ? (
                    <div className="py-2">
                      {filteredResources.map((resource, index) => {
                        const timeDisplay = getResourceTimeDisplay(resource);
                        return (
                          <button
                            key={index}
                            onClick={() => handleResourceClick(resource.category)}
                            className="w-full px-4 py-3 hover:bg-lime-50 transition-colors text-left border-b border-stone-100 last:border-b-0"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="font-medium text-stone-800 mb-1 flex items-center gap-2">
                                  {resource.title}
                                  {!resource.active && (
                                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                                      <FileEdit className="w-2.5 h-2.5" />
                                      Needs Content
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                  <span className="text-lime-600 font-medium">
                                    {resource.category}
                                  </span>
                                  <span>•</span>
                                  <span>{TYPE_LABELS[resource.type] || resource.type}</span>
                                  {timeDisplay && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {timeDisplay}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-lime-500 shrink-0 mt-1" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-stone-600">
                      <Search className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                      <p>No resources found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="text-center px-6 py-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-lime-100">
              <div className="text-3xl font-bold text-lime-600">
                {ALL_RESOURCES.length}+
              </div>
              <div className="text-sm text-stone-600 font-medium">Free Resources</div>
            </div>
            <div className="text-center px-6 py-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-lime-100">
              <div className="text-3xl font-bold text-teal-600">
                {RESOURCE_CATEGORIES.length}
              </div>
              <div className="text-sm text-stone-600 font-medium">Categories</div>
            </div>
            <div className="text-center px-6 py-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-lime-100">
              <div className="text-3xl font-bold text-cyan-600">100%</div>
              <div className="text-sm text-stone-600 font-medium">Free Access</div>
            </div>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,80 1200,60 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-stone-600">
              Explore resources organized by topic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCE_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              const count = getResourceCountByCategory(category.title);
              const colors = CATEGORY_COLOR_STYLES[category.color];

              return (
                <Link key={index} to={category.path}>
                  <Card
                    variant="outlined"
                    className={`${colors.borderHover} transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] transform h-full group`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 ${colors.bg} rounded-xl border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-8 h-8 ${colors.iconText}`} />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${colors.badgeBg} ${colors.badgeText}`}>
                          {count}
                        </span>
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {category.title}
                        <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-1 transition-all duration-300" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background with organic shapes */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMin slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ctaResourcesBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="1" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="ctaLimeWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#bef264" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="ctaWhiteAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#ctaResourcesBg)" />

            {/* Flowing organic shapes */}
            <path
              d="M-100,200 C150,250 350,150 550,180 C750,210 900,280 1300,200"
              fill="none"
              stroke="url(#ctaLimeWave)"
              strokeWidth="120"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M-50,300 C200,350 400,250 650,280 C900,310 1050,350 1350,280"
              fill="none"
              stroke="url(#ctaLimeWave)"
              strokeWidth="80"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* White accent lines */}
            <path
              d="M-80,180 C150,230 350,130 550,160 C750,190 900,260 1280,180"
              fill="none"
              stroke="url(#ctaWhiteAccent)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M-50,280 C200,330 400,230 650,260 C900,290 1050,330 1350,260"
              fill="none"
              stroke="url(#ctaWhiteAccent)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Top wave edge */}
            <path
              d="M-10,-10 L-10,25 Q200,50 450,30 Q750,5 1000,35 Q1150,50 1210,20 L1210,-10 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/25 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              Get Personalized Recommendations
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              Take our career assessment to receive resource recommendations
              tailored to your goals
            </p>
            <Link to="/intake">
              <Button
                size="lg"
                className="bg-white text-lime-700 hover:bg-lime-50 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

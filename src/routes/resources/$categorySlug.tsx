import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Clock,
  Download,
  ExternalLink,
  FileEdit,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  List,
  Play,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CATEGORY_COLOR_STYLES,
  getResourcesByCategory,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  type ArticleResource,
  type CategoryColor,
  type ChecklistResource,
  type CourseResource,
  type DirectoryResource,
  type DownloadResource,
  type ExternalResource,
  type Resource,
  type ToolResource,
  type VideoResource,
} from "@/data/resources";

// Category hero pattern - swoosh theme using category color
function CategoryPattern({ color }: { color: CategoryColor }) {
  const colorStyle = CATEGORY_COLOR_STYLES[color];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Main gradient background */}
          <linearGradient id="categoryBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStyle.gradient[0]} />
            <stop offset="50%" stopColor={colorStyle.gradient[1]} />
            <stop offset="100%" stopColor={colorStyle.gradient[2]} />
          </linearGradient>

          {/* Accent flowing gradient */}
          <linearGradient id="categoryAccentFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`rgba(${colorStyle.accent}, 0.4)`} />
            <stop offset="50%" stopColor={`rgba(${colorStyle.accent}, 0.3)`} />
            <stop offset="100%" stopColor={`rgba(${colorStyle.accent}, 0.15)`} />
          </linearGradient>

          {/* White flowing gradient */}
          <linearGradient id="categoryWhiteFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Base background */}
        <rect width="100%" height="100%" fill="url(#categoryBg)" />

        {/* Main flowing wave */}
        <path
          d="M-100,140 C150,180 300,230 500,210 C700,190 850,120 1300,90"
          fill="none"
          stroke="url(#categoryAccentFlow)"
          strokeWidth="100"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Secondary softer wave */}
        <path
          d="M-150,220 C50,260 200,300 400,280 C600,260 750,190 900,140 C1050,90 1200,80 1450,60"
          fill="none"
          stroke="url(#categoryAccentFlow)"
          strokeWidth="70"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* White accent line */}
        <path
          d="M-80,160 C100,200 240,250 420,230 C600,210 780,140 920,100 C1060,60 1180,60 1280,45"
          fill="none"
          stroke="url(#categoryWhiteFlow)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// Get format badge for downloads
function getDownloadFormatIcon(format: string) {
  switch (format) {
    case "xlsx":
      return FileSpreadsheet;
    case "docx":
      return FileText;
    default:
      return FileText;
  }
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

// Get YouTube thumbnail URL (maxresdefault for clean 16:9)
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Resource type priority for sorting (interactive first, then content, then references)
const TYPE_PRIORITY: Record<string, number> = {
  [RESOURCE_TYPES.TOOL]: 1,
  [RESOURCE_TYPES.VIDEO]: 2,
  [RESOURCE_TYPES.COURSE]: 3,
  [RESOURCE_TYPES.ARTICLE]: 4,
  [RESOURCE_TYPES.CHECKLIST]: 5,
  [RESOURCE_TYPES.DOWNLOAD]: 6,
  [RESOURCE_TYPES.DIRECTORY]: 7,
  [RESOURCE_TYPES.EXTERNAL]: 8,
};

// Color style type
type CategoryColorStyle = (typeof CATEGORY_COLOR_STYLES)[CategoryColor];

// Type-specific card components
function ToolCard({ resource, colors }: { resource: ToolResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-xl hover:scale-[1.005] transform cursor-pointer group relative overflow-hidden ${!resource.active ? 'opacity-75' : ''}`}
    >
      {/* Interactive indicator */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />
      <div className="flex flex-col md:flex-row">
        {/* Icon side */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 flex items-center justify-center md:w-40 shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wrench className="w-10 h-10 text-teal-600" />
          </div>
        </div>
        {/* Content side */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-teal-100 text-teal-700 border-teal-200">
              Interactive Tool
            </Badge>
            {!resource.active && <NeedsContentBadge />}
          </div>
          <h3 className="text-xl font-bold text-stone-700 mb-2">{resource.title}</h3>
          <p className="text-stone-600 mb-4">
            {resource.active ? 'Complete this interactive assessment to gain personalized insights' : 'Coming soon'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resource.completionTime}
            </span>
            <span className={`text-sm font-semibold ${colors.iconText} group-hover:translate-x-1 transition-transform flex items-center gap-1`}>
              Start Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function VideoCard({ resource, colors }: { resource: VideoResource; colors: CategoryColorStyle }) {
  const videoId = getYouTubeVideoId(resource.videoUrl);
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;

  return (
    <a
      href={resource.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card
        variant="outlined"
        className={`${colors.borderHover} transition-all duration-300 hover:shadow-xl hover:scale-[1.005] transform cursor-pointer group overflow-hidden ${!resource.active ? 'opacity-75' : ''}`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Video thumbnail */}
          <div className="relative aspect-video md:aspect-auto md:w-80 shrink-0 overflow-hidden">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={resource.title}
                className="absolute inset-0 w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                <Play className="w-12 h-12 text-red-400" />
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600 shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 transition-all">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
            <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0 text-sm px-2 py-1">
              {resource.duration}
            </Badge>
            {!resource.active && (
              <div className="absolute top-3 left-3">
                <NeedsContentBadge />
              </div>
            )}
          </div>
          {/* Content side */}
          <div className="flex-1 p-6">
            <Badge className="bg-red-50 text-red-700 border-red-200 mb-3">
              <Play className="w-3 h-3 mr-1" />
              Video
            </Badge>
            <h3 className="text-xl font-bold text-stone-700 mb-2 group-hover:text-red-700 transition-colors">{resource.title}</h3>
            <p className="text-stone-600 mb-4 line-clamp-2">
              {resource.description || (resource.active ? 'Watch and learn from real experiences and expert insights' : 'Video coming soon')}
            </p>
            <span className="text-sm font-semibold text-red-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Watch on YouTube <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Card>
    </a>
  );
}

function ArticleCard({ resource, colors }: { resource: ArticleResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-lg hover:scale-[1.01] transform cursor-pointer group ${!resource.active ? 'opacity-75' : ''}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">
            <BookOpen className="w-3 h-3 mr-1" />
            Article
          </Badge>
          <div className="flex items-center gap-2">
            {!resource.active && <NeedsContentBadge />}
            <span className="text-sm text-stone-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime}
            </span>
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-cyan-700 transition-colors">
          {resource.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-stone-600 line-clamp-2">
          {resource.active
            ? 'In-depth guidance and practical advice to help you succeed'
            : 'Content being developed'}
        </p>
        <span className={`inline-flex items-center gap-1 mt-3 text-sm font-medium ${colors.iconText}`}>
          Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </CardContent>
    </Card>
  );
}

function DownloadCard({ resource, colors }: { resource: DownloadResource; colors: CategoryColorStyle }) {
  const FormatIcon = getDownloadFormatIcon(resource.format);
  const formatColors: Record<string, string> = {
    pdf: 'bg-red-50 text-red-600 border-red-200',
    docx: 'bg-blue-50 text-blue-600 border-blue-200',
    xlsx: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform cursor-pointer group ${!resource.active ? 'opacity-75' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${formatColors[resource.format] || 'bg-amber-50 text-amber-600 border-amber-200'} border flex items-center justify-center shrink-0`}>
            <FormatIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase text-stone-400">{resource.format}</span>
              {!resource.active && <NeedsContentBadge />}
            </div>
            <h4 className="font-semibold text-stone-700 text-sm leading-tight mb-2 line-clamp-2">{resource.title}</h4>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 group-hover:text-amber-700">
              <Download className="w-3 h-3" />
              Download
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DirectoryCard({ resource, colors }: { resource: DirectoryResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-md cursor-pointer group ${!resource.active ? 'opacity-75' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <List className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-stone-700 line-clamp-1">{resource.title}</h4>
            <p className="text-sm text-stone-500">
              {resource.active ? 'Curated external resources' : 'Being compiled'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!resource.active && <NeedsContentBadge />}
            <ExternalLink className={`w-5 h-5 text-stone-400 ${colors.iconHoverText} transition-colors`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistCard({ resource, colors }: { resource: ChecklistResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform cursor-pointer group ${!resource.active ? 'opacity-75' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-lime-50 border border-lime-200 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5 text-lime-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase text-stone-400">{resource.completionTime}</span>
              {!resource.active && <NeedsContentBadge />}
            </div>
            <h4 className="font-semibold text-stone-700 text-sm leading-tight mb-2 line-clamp-2">{resource.title}</h4>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-lime-600 group-hover:text-lime-700">
              <CheckSquare className="w-3 h-3" />
              Start checklist
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseCard({ resource, colors }: { resource: CourseResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-xl hover:scale-[1.005] transform cursor-pointer group relative overflow-hidden ${!resource.active ? 'opacity-75' : ''}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 to-purple-600" />
      <div className="flex flex-col md:flex-row">
        {/* Icon side */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 flex items-center justify-center md:w-40 shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <GraduationCap className="w-10 h-10 text-purple-600" />
          </div>
        </div>
        {/* Content side */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Learning Course
            </Badge>
            {!resource.active && <NeedsContentBadge />}
          </div>
          <h3 className="text-xl font-bold text-stone-700 mb-2">{resource.title}</h3>
          <p className="text-stone-600 mb-4">
            {resource.active ? 'Structured learning path with guided modules and exercises' : 'Course curriculum in development'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resource.totalTime}
            </span>
            <span className={`text-sm font-semibold ${colors.iconText} group-hover:translate-x-1 transition-transform flex items-center gap-1`}>
              Enroll Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ExternalCard({ resource, colors }: { resource: ExternalResource; colors: CategoryColorStyle }) {
  return (
    <Card
      variant="outlined"
      className={`${colors.borderHover} transition-all duration-300 hover:shadow-md cursor-pointer group ${!resource.active ? 'opacity-75' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-stone-700 line-clamp-1">{resource.title}</h4>
            <p className="text-sm text-stone-500">{resource.source}</p>
          </div>
          <div className="flex items-center gap-2">
            {!resource.active && <NeedsContentBadge />}
            <ExternalLink className={`w-5 h-5 text-stone-400 ${colors.iconHoverText} transition-colors`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NeedsContentBadge() {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white border border-orange-600 flex items-center gap-1.5 shadow-sm">
      <FileEdit className="w-3.5 h-3.5" />
      Needs Content
    </span>
  );
}

// Render the appropriate card based on resource type
function ResourceCard({ resource, colors }: { resource: Resource; colors: CategoryColorStyle }) {
  switch (resource.type) {
    case RESOURCE_TYPES.TOOL:
      return <ToolCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.VIDEO:
      return <VideoCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.ARTICLE:
      return <ArticleCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.DOWNLOAD:
      return <DownloadCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.DIRECTORY:
      return <DirectoryCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.CHECKLIST:
      return <ChecklistCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.COURSE:
      return <CourseCard resource={resource} colors={colors} />;
    case RESOURCE_TYPES.EXTERNAL:
      return <ExternalCard resource={resource} colors={colors} />;
    default:
      return null;
  }
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
          <h1 className="text-2xl font-bold text-stone-700 mb-2">
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
  const rawResources = getResourcesByCategory(category.title);
  const CategoryIcon = category.icon;
  const colors = CATEGORY_COLOR_STYLES[category.color];

  // Sort resources by type priority (interactive first, then content, then references)
  const sortedResources = useMemo(() => {
    return [...rawResources].sort((a, b) => {
      const priorityA = TYPE_PRIORITY[a.type] || 99;
      const priorityB = TYPE_PRIORITY[b.type] || 99;
      return priorityA - priorityB;
    });
  }, [rawResources]);

  // Group resources by category for different layout treatments
  const groupedResources = useMemo(() => {
    const featured: Resource[] = []; // Tools, Videos, Courses - full width
    const articles: Resource[] = []; // Articles - 2 col
    const downloads: Resource[] = []; // Downloads, Checklists - compact 3 col
    const references: Resource[] = []; // Directories, External - list style

    for (const resource of sortedResources) {
      switch (resource.type) {
        case RESOURCE_TYPES.TOOL:
        case RESOURCE_TYPES.VIDEO:
        case RESOURCE_TYPES.COURSE:
          featured.push(resource);
          break;
        case RESOURCE_TYPES.ARTICLE:
          articles.push(resource);
          break;
        case RESOURCE_TYPES.DOWNLOAD:
        case RESOURCE_TYPES.CHECKLIST:
          downloads.push(resource);
          break;
        case RESOURCE_TYPES.DIRECTORY:
        case RESOURCE_TYPES.EXTERNAL:
          references.push(resource);
          break;
      }
    }

    return { featured, articles, downloads, references };
  }, [sortedResources]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <CategoryPattern color={category.color} />

        {/* Back link - floating pill */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-stone-200/50 text-stone-700 hover:text-stone-700 hover:bg-white font-medium transition-all hover:shadow-lg"
          >
            <ArrowLeft className={`w-4 h-4 ${colors.iconText}`} />
            All Resources
          </Link>
        </div>

        <Container size="sm" className="relative z-10">
          <div className="text-center pt-6">
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-white/50 backdrop-blur-md rounded-full mb-5 border border-white/40 shadow-lg`}>
              <CategoryIcon className={`w-7 h-7 text-stone-700`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-700 mb-3">
              {category.title}
            </h1>
            <p className="text-lg text-stone-700 max-w-xl mx-auto">{category.description}</p>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,50 C300,90 600,10 900,50 C1050,70 1150,70 1200,50 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Resources Sections */}
      <section className="py-16 px-6">
        <Container>
          {/* Featured Resources - Tools, Videos, Courses */}
          {groupedResources.featured.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-stone-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Interactive & Media
              </h2>
              <div className="space-y-4">
                {groupedResources.featured.map((resource: Resource) => (
                  <ResourceCard key={resource.title} resource={resource} colors={colors} />
                ))}
              </div>
            </div>
          )}

          {/* Articles - 2 column grid */}
          {groupedResources.articles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-stone-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Guides & Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedResources.articles.map((resource: Resource) => (
                  <ResourceCard key={resource.title} resource={resource} colors={colors} />
                ))}
              </div>
            </div>
          )}

          {/* Downloads & Checklists - 3 column compact grid */}
          {groupedResources.downloads.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-stone-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Templates & Tools
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedResources.downloads.map((resource: Resource) => (
                  <ResourceCard key={resource.title} resource={resource} colors={colors} />
                ))}
              </div>
            </div>
          )}

          {/* References - horizontal list */}
          {groupedResources.references.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-stone-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                <List className="w-5 h-5" />
                Resource Directories
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {groupedResources.references.map((resource: Resource) => (
                  <ResourceCard key={resource.title} resource={resource} colors={colors} />
                ))}
              </div>
            </div>
          )}
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

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  ALL_RESOURCES,
  CATEGORY_COLOR_STYLES,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  type ArticleResource,
} from "@/data/resources";

const HOSTNAME = "https://compasscoachingpa.org";

export const Route = createFileRoute("/resources/articles/$slug")({
  component: ArticlePage,
  loader: ({ params }) => {
    const article = ALL_RESOURCES.find(
      (r): r is ArticleResource =>
        r.type === RESOURCE_TYPES.ARTICLE &&
        "slug" in r &&
        r.slug === params.slug &&
        r.active
    );

    if (!article) {
      throw notFound();
    }

    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return {};

    const title = `${article.title} | Compass Coaching`;
    const description =
      article.description ||
      article.sections?.[0]?.content[0]?.slice(0, 155).replace(/\*\*/g, "") +
        "..." ||
      "Free career and life guidance article from Compass Coaching.";
    const canonicalUrl = `${HOSTNAME}/resources/articles/${article.slug}`;
    const author = article.author || "Compass Coaching Team";

    // Build article structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description,
      author: {
        "@type": "Organization",
        name: author,
        url: HOSTNAME,
      },
      publisher: {
        "@type": "Organization",
        name: "Compass Coaching",
        url: HOSTNAME,
        logo: {
          "@type": "ImageObject",
          url: `${HOSTNAME}/discord-icon.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      isAccessibleForFree: true,
      inLanguage: "en-US",
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "author", content: author },
        { name: "robots", content: "index, follow" },

        // Open Graph
        { property: "og:type", content: "article" },
        { property: "og:title", content: article.title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl },
        { property: "og:site_name", content: "Compass Coaching" },
        { property: "og:image", content: `${HOSTNAME}/discord-icon.png` },
        { property: "article:author", content: author },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: article.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${HOSTNAME}/discord-icon.png` },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
});

// Article hero pattern - teal/cyan theme for reading
function ArticlePattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="articleBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#134e4a" />
            <stop offset="50%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>

          <linearGradient id="articleAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#5eead4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#99f6e4" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="articleWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#articleBg)" />

        <path
          d="M-100,120 C150,160 300,200 500,180 C700,160 850,100 1300,70"
          fill="none"
          stroke="url(#articleAccent)"
          strokeWidth="100"
          strokeLinecap="round"
          opacity="0.4"
        />

        <path
          d="M-150,200 C50,240 200,280 400,260 C600,240 750,180 900,140 C1050,100 1200,90 1450,70"
          fill="none"
          stroke="url(#articleAccent)"
          strokeWidth="70"
          strokeLinecap="round"
          opacity="0.25"
        />

        <path
          d="M-80,140 C100,180 240,220 420,200 C600,180 780,120 920,90"
          fill="none"
          stroke="url(#articleWhite)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();

  // Find the category for this article
  const category = RESOURCE_CATEGORIES.find((c) => c.title === article.category);
  const colors = category
    ? CATEGORY_COLOR_STYLES[category.color]
    : CATEGORY_COLOR_STYLES.teal;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Back link - sticky pill */}
      <div className="sticky top-20 md:top-19 z-40 w-fit ml-4 md:ml-6 pt-4 md:pt-6">
        {category ? (
          <Link
            to="/resources/$categorySlug"
            params={{ categorySlug: category.slug }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-stone-200/50 text-stone-800 hover:text-stone-800 hover:bg-white font-medium transition-all hover:shadow-lg"
          >
            <ArrowLeft className={`w-4 h-4 ${colors.iconText}`} />
            {category.title}
          </Link>
        ) : (
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-stone-200/50 text-stone-800 hover:text-stone-800 hover:bg-white font-medium transition-all hover:shadow-lg"
          >
            <ArrowLeft className={`w-4 h-4 ${colors.iconText}`} />
            All Resources
          </Link>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-6 overflow-hidden -mt-14 md:-mt-16">
        <ArticlePattern />

        <Container size="sm" className="relative z-10">
          <div className="text-center pt-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/50 backdrop-blur-md rounded-full mb-5 border border-white/40 shadow-lg">
              <BookOpen className="w-7 h-7 text-stone-800" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
              {article.title}
            </h1>
            {article.description && (
              <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-6">
                {article.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-teal-100 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime} read
              </span>
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
              )}
            </div>
          </div>
        </Container>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 md:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 C300,90 600,10 900,50 C1050,70 1150,70 1200,50 L1200,120 L0,120 Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 md:py-12 px-4">
        <Container size="sm">
          <article className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-10">
            <div className="prose prose-stone prose-lg max-w-none">
              {article.sections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8 last:mb-0">
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-stone-700 mt-8 mb-4 first:mt-0">
                      {section.heading}
                    </h2>
                  )}
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-stone-600 leading-relaxed mb-4 last:mb-0">
                      {paragraph.split("**").map((part, i) =>
                        i % 2 === 0 ? (
                          <span key={i}>{part}</span>
                        ) : (
                          <strong key={i} className="font-semibold text-stone-600">
                            {part}
                          </strong>
                        )
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Article footer */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-lime-400 to-teal-500 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700">
                      {article.author || "Compass Coaching"}
                    </p>
                    <p className="text-sm text-stone-500">
                      Helping you navigate your journey
                    </p>
                  </div>
                </div>
                {category ? (
                  <Link
                    to="/resources/$categorySlug"
                    params={{ categorySlug: category.slug }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    More Resources
                  </Link>
                ) : (
                  <Link
                    to="/resources"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    More Resources
                  </Link>
                )}
              </div>
            </div>
          </article>
        </Container>
      </section>
    </div>
  );
}

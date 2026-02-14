/**
 * Sitemap Generator
 * Run before build to generate sitemap.xml in public folder
 * Uses actual file modification timestamps for accurate lastmod values
 */

import { statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_RESOURCES } from "../src/data/resources";

const HOSTNAME = "https://compasscoachingpa.org";
const ROUTES_DIR = join(process.cwd(), "src", "routes");

/**
 * Get the last modified timestamp of a source file in W3C Datetime format.
 * Falls back to current time if the file cannot be found.
 */
function getLastmod(routeFile: string): string {
  try {
    const filePath = join(ROUTES_DIR, routeFile);
    const stats = statSync(filePath);
    return stats.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Dynamically collect article routes - only include active articles with actual content
// Articles share a single route file, so they all use that file's timestamp
const articlesLastmod = getLastmod(join("resources", "articles.$slug.tsx"));
const articleRoutes = ALL_RESOURCES
  .filter((r) => r.type === "article" && r.active && "slug" in r && r.slug && "sections" in r && Array.isArray(r.sections) && r.sections.length > 0)
  .map((r) => ({
    path: `/resources/articles/${(r as { slug: string }).slug}`,
    priority: 0.6,
    changefreq: "monthly" as const,
    lastmod: articlesLastmod,
  }));

// All public routes to include in sitemap
// Each route maps to its source file for accurate lastmod timestamps
const routes = [
  // Main pages
  { path: "/", priority: 1.0, changefreq: "weekly", lastmod: getLastmod("index.tsx") },
  { path: "/about", priority: 0.8, changefreq: "monthly", lastmod: getLastmod("about.tsx") },
  { path: "/contact", priority: 0.7, changefreq: "monthly", lastmod: getLastmod(join("contact", "index.tsx")) },
  { path: "/contact/join", priority: 0.6, changefreq: "monthly", lastmod: getLastmod(join("contact", "join.tsx")) },
  { path: "/careers", priority: 0.9, changefreq: "weekly", lastmod: getLastmod("careers.tsx") },
  { path: "/resources", priority: 0.9, changefreq: "weekly", lastmod: getLastmod(join("resources", "index.tsx")) },
  { path: "/intake", priority: 0.8, changefreq: "monthly", lastmod: getLastmod(join("intake", "index.tsx")) },

  // Legal pages
  { path: "/terms", priority: 0.3, changefreq: "yearly", lastmod: getLastmod("terms.tsx") },
  { path: "/privacy", priority: 0.3, changefreq: "yearly", lastmod: getLastmod("privacy.tsx") },

  // Resource categories (all served by the same dynamic route file)
  ...([
    "mental-wellbeing",
    "relationships",
    "skills-development",
    "career-exploration",
    "healthy-living",
    "education-training",
    "professional-development",
    "workplace-success",
    "financial-aid",
    "career-transitions",
    "networking",
    "job-search",
    "resume-cover-letters",
    "interview-prep",
    "salary-negotiation",
  ] as const).map((slug) => ({
    path: `/resources/${slug}`,
    priority: 0.7,
    changefreq: "weekly" as const,
    lastmod: getLastmod(join("resources", "$categorySlug.tsx")),
  })),

  // Articles
  ...articleRoutes,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, priority, changefreq, lastmod }) => `  <url>
    <loc>${HOSTNAME}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outputPath = join(process.cwd(), "public", "sitemap.xml");
writeFileSync(outputPath, sitemap);

console.log(`✓ Generated sitemap.xml with ${routes.length} URLs (with file timestamps)`);

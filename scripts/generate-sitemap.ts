/**
 * Sitemap Generator
 * Run before build to generate sitemap.xml in public folder
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const HOSTNAME = "https://compasscoachingpa.org";

// All public routes to include in sitemap
const routes = [
  // Main pages
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/careers", priority: 0.9, changefreq: "weekly" },
  { path: "/resources", priority: 0.9, changefreq: "weekly" },
  { path: "/intake", priority: 0.8, changefreq: "monthly" },

  // Resource categories
  { path: "/resources/mental-wellbeing", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/relationships", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/skills-development", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/career-exploration", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/healthy-living", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/education-training", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/professional-development", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/workplace-success", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/financial-aid", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/career-transitions", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/networking", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/job-search", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/resume-cover-letters", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/interview-prep", priority: 0.7, changefreq: "weekly" },
  { path: "/resources/salary-negotiation", priority: 0.7, changefreq: "weekly" },
];

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${HOSTNAME}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outputPath = join(process.cwd(), "public", "sitemap.xml");
writeFileSync(outputPath, sitemap);

console.log(`✓ Generated sitemap.xml with ${routes.length} URLs`);

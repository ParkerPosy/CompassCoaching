# SEO Strategy & Implementation

## Overview
This document outlines the SEO (Search Engine Optimization) strategy for Compass Coaching to maximize organic search visibility and help students find our free career resources.

## Target Keywords

### Primary Keywords
- career coaching
- career assessment
- free career assessment
- student career resources
- college guidance
- career exploration

### Secondary Keywords
- career counseling for students
- free career test
- aptitude test
- career planning
- college application help
- financial aid resources
- student support services

### Long-tail Keywords
- free career assessment for students
- career exploration resources for high school students
- college and career guidance
- how to choose a career path
- free career counseling services

## Technical SEO Implementation

### Meta Tags (Implemented in __root.tsx)

**Base Meta Tags:**
- `charset`: UTF-8
- `viewport`: Responsive viewport settings
- `description`: 155-160 character compelling description
- `keywords`: Comma-separated relevant keywords
- `author`: Compass Coaching
- `robots`: index, follow (allow search engines)
- `theme-color`: #a3e635 (lime-400 brand color)

**Open Graph Tags (Social Media):**
- `og:type`: website
- `og:title`: Page-specific titles
- `og:description`: Compelling social media descriptions
- `og:site_name`: Compass Coaching
- `og:image`: (TODO: Add when we have logo/hero image)
- `og:url`: Canonical URL for each page

**Twitter Card Tags:**
- `twitter:card`: summary_large_image
- `twitter:title`: Page-specific titles
- `twitter:description`: Compelling descriptions
- `twitter:image`: (TODO: Add when we have images)

### Canonical URLs
- Set in __root.tsx
- Prevents duplicate content issues
- Format: `https://compasscoaching.org/[path]`

### Page-Specific Meta Tags

**Homepage (/):**
- Title: "Compass Coaching - Free Career Assessment & Student Resources"
- Description: Emphasizes free assessment, 100+ resources, 1000+ students helped

**Intake (/intake):**
- Title: "Free Career Assessment - Compass Coaching"
- Description: Details 5-section assessment, personalized recommendations

**Resources (/resources):**
- Title: "Free Career & College Resources - Compass Coaching"
- Description: 100+ resources, specific categories listed

**Contact (/contact):**
- Title: "Contact Us - Compass Coaching"
- Description: Support and guidance information

## Content SEO Best Practices

### Heading Hierarchy
```html
<h1> - Page main title (one per page)
<h2> - Major sections
<h3> - Subsections
<h4> - Minor subsections
```

**Current Implementation:**
- ✅ Homepage: Single H1 "Navigate Your Future"
- ✅ Intake: Single H1 "Career Assessment"
- ✅ Resources: Single H1 "Resource Library"
- ✅ Contact: Single H1 "Get in Touch"

### Semantic HTML
```html
<main> - Main content wrapper
<section> - Content sections
<article> - Independent content pieces
<nav> - Navigation menus
<header> - Page/section headers
<footer> - Page/section footers (TODO)
```

### Content Optimization

**Word Count Targets:**
- Homepage: 500-800 words ✅
- Resource Pages: 300-500 words ✅
- Assessment Page: 400-600 words ✅

**Keyword Density:**
- Primary keyword: 1-2% of content
- Natural language, avoid keyword stuffing
- Use synonyms and related terms

**Internal Linking:**
- ✅ Homepage links to /intake and /resources
- ✅ Header navigation to all main pages
- Sidebar navigation for easy access
- Breadcrumbs (TODO for future)

### Image Optimization (TODO)

```tsx
// When adding images:
<img
  src="/images/hero.jpg"
  alt="Students using Compass Coaching career assessment tool"
  width={1200}
  height={630}
  loading="lazy"
/>
```

**Image SEO Checklist:**
- [ ] Descriptive filenames (career-assessment-hero.jpg)
- [ ] Alt text for all images
- [ ] Compressed images (WebP format)
- [ ] Responsive images (srcset)
- [ ] Lazy loading for below-fold images

## Schema.org Structured Data

### Organization Schema (TODO - Add to __root.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Compass Coaching",
  "description": "Free career coaching and resources for students",
  "url": "https://compasscoaching.org",
  "logo": "https://compasscoaching.org/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-1234",
    "contactType": "Customer Service",
    "email": "hello@compasscoaching.org"
  },
  "sameAs": [
    "https://facebook.com/compasscoaching",
    "https://twitter.com/compasscoaching",
    "https://linkedin.com/company/compasscoaching"
  ]
}
```

### Service Schema (TODO - Add to homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Career Counseling",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Compass Coaching"
  },
  "areaServed": "United States",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Career Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Career Assessment",
          "description": "Comprehensive 5-section career assessment"
        },
        "price": "0",
        "priceCurrency": "USD"
      }
    ]
  }
}
```

### FAQ Schema (TODO - Consider adding FAQ page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the career assessment really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All of our career assessments and resources are 100% free for students."
      }
    }
  ]
}
```

## URL Structure

### Current URLs (SEO Optimized)
- `/` - Homepage
- `/intake` - Career assessment
- `/resources` - Resource library
- `/contact` - Contact page

**Best Practices:**
- ✅ Short, descriptive URLs
- ✅ Lowercase only
- ✅ Hyphens for word separation (when needed)
- ✅ No unnecessary parameters
- ✅ Logical hierarchy

### Future URLs (Recommendations)
- `/resources/financial-aid`
- `/resources/college-applications`
- `/resources/career-exploration`
- `/about`
- `/success-stories`
- `/blog/[slug]`

## Performance Optimization (SEO Impact)

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Implemented:**
- ✅ Tailwind CSS for minimal CSS
- ✅ Vite for optimized bundling
- ✅ Code splitting via TanStack Router
- ✅ Lazy loading (future images)

### Mobile Optimization
- ✅ Responsive design
- ✅ Mobile-first CSS
- ✅ Touch-friendly navigation
- ✅ Hamburger menu for mobile

## Local SEO (Future Consideration)

If physical location is added:
- Google My Business listing
- NAP (Name, Address, Phone) consistency
- Local keywords
- Location pages
- Local backlinks

## Content Strategy for SEO

### Blog Topics (Future)
1. "How to Choose the Right Career Path: A Complete Guide"
2. "10 Free Resources Every College Student Needs"
3. "Understanding Your Career Assessment Results"
4. "Financial Aid Tips for First-Generation Students"
5. "Career Exploration Activities for High School Students"

### Resource Categories (Optimize for search)
- Financial Aid Guides
- College Application Templates
- Career Exploration Worksheets
- Interview Preparation
- Resume Building
- Scholarship Search

## Link Building Strategy

### Internal Links
- ✅ Navigation menu
- ✅ CTA buttons throughout site
- ✅ Related content links
- Footer links (TODO)

### External Links (Backlink Strategy)
- Partner with high schools
- Guest posts on education blogs
- Resource sharing with .edu sites
- Social media engagement
- Directory listings (free resource directories)

## Monitoring & Analytics

### Tools to Implement
- **Google Search Console**: Monitor search performance
- **Google Analytics 4**: Track user behavior
- **Bing Webmaster Tools**: Bing search presence
- **Schema Markup Validator**: Test structured data

### KPIs to Track
- Organic search traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Time on page
- Conversion rate (assessment completions)
- Page load speed

### Monthly SEO Checklist
- [ ] Review Search Console performance
- [ ] Check for crawl errors
- [ ] Monitor keyword rankings
- [ ] Analyze top-performing pages
- [ ] Review and update meta descriptions
- [ ] Add new content/resources
- [ ] Check for broken links
- [ ] Review competitor rankings

## Accessibility = SEO

### WCAG 2.1 Compliance (Also helps SEO)
- ✅ Semantic HTML
- ✅ Alt text for images
- ✅ Keyboard navigation
- ✅ Color contrast (lime-400 on dark backgrounds)
- ✅ Focus indicators
- ✅ Skip to main content link (via #main-content)
- ✅ ARIA labels where needed

## Robots.txt Configuration

```
User-agent: *
Allow: /
Sitemap: https://compasscoaching.org/sitemap.xml

# Disallow dev tools in production
Disallow: /api/dev
```

## Sitemap.xml Structure (TODO - Generate)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://compasscoaching.org/</loc>
    <lastmod>2026-02-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://compasscoaching.org/intake</loc>
    <lastmod>2026-02-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://compasscoaching.org/resources</loc>
    <lastmod>2026-02-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://compasscoaching.org/contact</loc>
    <lastmod>2026-02-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

## Priority Action Items

### Immediate (Week 1-2)
- [x] Add comprehensive meta tags
- [x] Implement page-specific titles/descriptions
- [x] Add semantic HTML (<main> tag)
- [x] Optimize heading hierarchy
- [ ] Create robots.txt
- [ ] Generate sitemap.xml
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics

### Short-term (Week 3-4)
- [ ] Add schema.org structured data
- [ ] Create and optimize logo/images
- [ ] Add alt text to all images
- [ ] Create 404 error page
- [ ] Implement lazy loading
- [ ] Add social media share images

### Medium-term (Month 2-3)
- [ ] Launch blog section
- [ ] Publish 5-10 SEO-optimized articles
- [ ] Build resource library content
- [ ] Create success stories page
- [ ] Implement FAQ section with schema
- [ ] Build backlinks (outreach to schools)

### Long-term (Month 4+)
- [ ] Regular content publishing (2-4 posts/month)
- [ ] Monitor and improve keyword rankings
- [ ] A/B test meta descriptions
- [ ] Expand resource categories
- [ ] Build email newsletter
- [ ] Create video content (YouTube SEO)

## Success Metrics

**6-Month Goals:**
- 1,000+ monthly organic visitors
- Rank top 10 for "free career assessment"
- Rank top 20 for "career coaching students"
- 50+ backlinks from quality sources
- 4+ star rating (future reviews)

**12-Month Goals:**
- 5,000+ monthly organic visitors
- Rank top 5 for primary keywords
- 100+ backlinks
- Featured snippets for 3+ queries
- Domain Authority 30+

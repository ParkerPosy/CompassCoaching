# SEO Best Practices for Compass Coaching

This document outlines SEO strategy and implementation guidelines for the Compass Coaching platform.

> **Last updated**: February 2026

## 🎯 Core Mission & SEO Focus

**Primary Offering**: Personalized career and life guidance through assessment-driven resource matching

**Value Proposition**:
- Free comprehensive assessment (personality, values, aptitudes, goals)
- 70+ curated resources matched to your profile
- Career AND life guidance (holistic approach)
- Pennsylvania-focused insights and support

**Supporting Features**:
- Real PA wage data for 810+ occupations (salary negotiation tool)
- 67 county coverage
- Mental wellbeing and life resources

## 📊 Current SEO Implementation Status

### ✅ Completed
- **Full meta tags on all public pages**: title, description, OG, Twitter, canonical
- **Structured data**: WebSite (root), NonprofitOrganization (homepage), Dataset (careers), Article + BreadcrumbList (articles)
- **Sitemap**: Auto-generated pre-build via `scripts/generate-sitemap.ts` with dynamic article routes
- **robots.txt**: Configured in `public/robots.txt`
- **noindex on private pages**: Dashboard, all assessment steps (basic, personality, values, aptitude, challenges, review, results)
- **Article SEO**: Full Article schema, BreadcrumbList, OG article tags, Twitter reading time labels
- **Canonical URLs**: Every public page has a canonical link

### 🎯 Target Keywords

#### Primary Keywords (High Priority)
1. **"Pennsylvania career guidance"** — Main service
2. **"free career assessment Pennsylvania"** — Primary offering
3. **"career and life coaching PA"** — Holistic approach
4. **"personalized career guidance"** — Differentiator
5. **"free life guidance Pennsylvania"** — Secondary service

#### Secondary Keywords
- "career resources Pennsylvania"
- "career counseling PA"
- "life coaching Pennsylvania"
- "career aptitude test"
- "find your career path"
- "Pennsylvania career help"

#### Supporting Keywords (Wage Data Feature)
- "Pennsylvania salary data"
- "PA wage information"
- "salary negotiation Pennsylvania"
- "PA occupation wages"

#### Long-Tail Keywords (Future Content)
- "how to find the right career path"
- "free career assessment that matches values"
- "career change advice Pennsylvania"
- "mental wellbeing and career success"
- "how much do [occupation] make in Pennsylvania"

## 🔍 Technical SEO Implementation

### Route-Level `head()` Functions

Every route uses TanStack Router's `head()` function to set per-page meta tags. The `__root.tsx` provides fallback meta (title, description, OG, Twitter, WebSite schema) that child routes override.

**Pattern for public pages**:
```tsx
export const Route = createFileRoute("/example")({
  component: ExamplePage,
  head: () => ({
    meta: [
      { title: "Page Title | Compass Coaching" },
      { name: "description", content: "150-160 char description." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Page Title" },
      { property: "og:description", content: "Short OG description." },
      { property: "og:url", content: "https://compasscoachingpa.org/example" },
      { property: "og:site_name", content: "Compass Coaching" },
      { property: "og:image", content: "https://compasscoachingpa.org/discord-icon.png" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Page Title" },
      { name: "twitter:description", content: "Short Twitter description." },
    ],
    links: [{ rel: "canonical", href: "https://compasscoachingpa.org/example" }],
  }),
});
```

**Pattern for private/non-indexable pages** (dashboard, assessment steps):
```tsx
head: () => ({
  meta: [
    { title: "Dashboard | Compass Coaching" },
    { name: "description", content: "Description for accessibility." },
    { name: "robots", content: "noindex, nofollow" },
  ],
}),
```

### Current Page SEO Matrix

| Route | Title | Desc | OG | Twitter | Canonical | robots | Schema |
|-------|-------|------|----|---------|-----------|--------|--------|
| `__root.tsx` | ✅ | ✅ | ✅ Full | ✅ Full | ✅ | `index, follow` | WebSite |
| `/` (index) | ✅ | ✅ | ✅ Full | ✅ Full | ✅ | — | NonprofitOrganization |
| `/about` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/careers` | ✅ | ✅ | ✅ Full | ✅ Full | ✅ | — | Dataset |
| `/contact` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/contact/join` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/resources` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/resources/$categorySlug` | ✅ Dynamic | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/resources/articles/$slug` | ✅ Dynamic | ✅ | ✅ Full | ✅ + reading time | ✅ | `index, follow, max-snippet:-1` | Article + BreadcrumbList |
| `/intake` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/intake/basic` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/personality` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/values` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/aptitude` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/challenges` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/review` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/intake/results` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/dashboard` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/admin` | ✅ | ✅ | — | — | — | `noindex, nofollow` | — |
| `/privacy` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |
| `/terms` | ✅ | ✅ | ✅ Full | ✅ | ✅ | — | — |

### Structured Data (Schema.org)

Currently implemented schemas:

1. **WebSite** — `__root.tsx`: Site name, URL, alternate name
2. **NonprofitOrganization** — `/` (homepage): Name, URL, description, founding date, area served
3. **Dataset** — `/careers`: PA wage data description, spatial/temporal coverage, variables measured
4. **Article** — `/resources/articles/$slug`: Headline, description, word count, section, keywords, dates, author, publisher
5. **BreadcrumbList** — `/resources/articles/$slug`: Resources → Category → Article navigation

### Sitemap

Auto-generated by `scripts/generate-sitemap.ts` during the build step (`npm run build` runs `tsx scripts/generate-sitemap.ts && vite build`).

**Features**:
- All static public routes with priority and changefreq
- Dynamic article routes — automatically collected from `ALL_RESOURCES`, filtered to only include active articles with content (`sections.length > 0`)
- Legal pages included with low priority (0.3) and yearly changefreq

**To add a new page to the sitemap**: Add an entry to the `routes` array in `scripts/generate-sitemap.ts`. Article routes are added automatically when you create the article content in `resources.ts`.

## 📝 Content Writing for SEO

### Service Hierarchy (Critical for Positioning)

**Primary Offering** (Lead with this):
1. Comprehensive career and life assessment
2. Personalized resource matching
3. Holistic guidance (career + life wellbeing)

**Supporting Features** (Mention as benefits, not headlines):
- PA wage data for salary decisions
- 70+ curated resources
- County-specific insights
- Progress tracking

**Correct Positioning**:
- ✅ "Take our free assessment to discover your path. We'll match you to personalized resources including PA wage data, career guides, and life wellbeing tools."
- ❌ "Access Pennsylvania wage data for 810+ careers. [Then mention assessment]"

**User Journey Flow**:
```
1. User takes assessment →
2. Gets personalized results →
3. Directed to relevant resources (which may include wage data) →
4. Takes action on their career/life goals
```

### Copywriting Principles

#### 1. Lead with Assessment & Guidance
- ✅ "Discover your path with our free assessment. Get matched to resources that fit your unique values and goals."
- ✅ "Personalized career and life guidance through our comprehensive assessment"
- ❌ "Access 810+ PA occupation salaries and wage data" (makes us sound like a salary database)

#### 2. Career AND Life (Holistic)
- ✅ "Career success and life wellbeing: we guide you in both"
- ✅ "Beyond job search: find resources for mental health, relationships, and personal growth"
- ❌ "Career guidance with some life resources" (too career-focused)

#### 3. Assessment-Driven Value
- ✅ "Your assessment unlocks personalized recommendations"
- ✅ "Matched to your personality, values, and aptitudes"
- ❌ "Browse our 70+ resources" (generic, not personalized)

#### 4. Emotional Hooks
- Address pain points: confusion, lack of direction, feeling lost
- Tap into desires: clarity, confidence, purpose, balance
- Use power words: discover, personalized, free, guided, clarity, path

#### 5. Specific > Generic
- ✅ "5-step assessment covering personality, values, aptitudes, and goals"
- ✅ "70+ resources matched to your profile"
- ❌ "Comprehensive platform for career help"

#### 5. Trust Indicators
Include throughout content:
- "Real PA Dept. of Labor data (May 2024)"
- "100% free, no credit card required"
- "Donation-funded non-profit"
- "Your data stays local"

#### 6. Punctuation Guidelines
- **Avoid excessive em dashes (—)**: Use sparingly for emphasis. Overuse makes copy feel fragmented and less professional.
- ✅ "Completely free, powered by donations" (comma)
- ✅ "Career success and life wellbeing. We guide you in both." (period for separate thoughts)
- ✅ "Personalized guidance for career and life" (remove the aside entirely)
- ❌ "Completely free—powered by donations—no strings attached" (too many em dashes)
- When tempted to use an em dash, consider: comma, period, colon, or restructuring the sentence

### Content Structure for SEO

#### F-Pattern Reading
Users scan in F-pattern:
```
XXXXXXXXXXXXXXX  <-- Top line (most important)
XXXXXXXXX
XXX
XXXXXXXXXXXX     <-- Second line
XXXXXX
XX
XXXXXXXXX        <-- Third line
```

**Optimize for this**:
- Put keywords in first 100 words
- Make first sentence compelling
- Use short paragraphs (2-3 sentences)
- Use bullet points and lists
- Bold important keywords/phrases

#### Keyword Density
- **Target**: 1-2% keyword density
- **Natural placement**: Keywords should flow naturally
- **Variations**: Use synonyms and related terms
- **Avoid**: Keyword stuffing (looks spammy, hurts rankings)

**Example - Good keyword usage**:
```
Looking for career guidance in Pennsylvania? Compass Coaching offers
free career assessments and real salary data for 810+ occupations
across all 67 PA counties. Whether you're exploring career options
in Philadelphia, Pittsburgh, or anywhere in the state, our
Pennsylvania-focused tools help you understand your worth.
```

## 🗺️ Local SEO Strategy

### Pennsylvania-Focused Optimization

#### Current Coverage
- 2 of 67 counties with wage data
- Statewide averages available

#### Future County-Specific Pages
Create landing pages for major counties:
- Philadelphia County Career Guide
- Allegheny County (Pittsburgh) Salary Data
- Montgomery County Career Resources
- etc.

**URL Structure**:
```
/salaries/pennsylvania
/salaries/philadelphia-county
/salaries/allegheny-county
/careers/pennsylvania
/careers/philadelphia
```

#### Content Strategy per County Page
1. County-specific salary averages
2. Top 10 occupations in that county
3. Cost of living context
4. Major employers in county
5. Educational resources in county

### Google My Business (Future)
If physical location exists:
- Claim listing
- Add Pennsylvania-specific services
- Collect reviews
- Post regular updates

## 🔗 Internal Linking Strategy

### Link Structure
```
Homepage
├── Career Assessment (/intake)
│   ├── Basic Info (/intake/basic)
│   ├── Personality (/intake/personality)
│   └── Results (/intake/results)
├── PA Salary Data (/salaries)
│   ├── By Occupation (/salaries/[occupation])
│   └── By County (/salaries/[occupation]/[county])
└── Resources (/resources)
    ├── Career Exploration (/resources/career-exploration)
    ├── Education & Training (/resources/education-training)
    ├── Interview Preparation (/resources/interview-prep)
    └── Workplace Success (/resources/workplace-success)
```

### Anchor Text Best Practices
- Use descriptive anchor text (not "click here")
- Include target keywords naturally
- Vary anchor text for same destination
- Link to related content within articles

**Examples**:
- ✅ "View [Pennsylvania salary data](link) for nurses"
- ✅ "Learn more about [salary negotiation strategies](link)"
- ❌ "Click [here](link) for more info"

## 🎨 User Experience & SEO

### Page Speed
- Keep pages under 3 seconds load time
- Optimize images (WebP format)
- Lazy load occupation data (810+ records)
- Consider API endpoints instead of loading all data

### Mobile Optimization
- 60%+ users on mobile
- Mobile-first design
- Touch-friendly buttons (min 44x44px)
- Readable font sizes (16px minimum)

### Readability
- Flesch Reading Ease: 60+ (conversational)
- Average sentence length: 15-20 words
- Use subheadings every 300 words
- White space between sections

## 📈 Conversion Rate Optimization (CRO)

### Call-to-Action Buttons

**Benefit-Focused CTAs** (Better conversion):
- ✅ "Start Free Assessment"
- ✅ "Discover Your Worth"
- ✅ "See What You Should Earn"
- ✅ "Find Your Path Forward"

**Generic CTAs** (Lower conversion):
- ❌ "Get Started"
- ❌ "Click Here"
- ❌ "Submit"
- ❌ "Continue"

### Above-the-Fold Content
First screenful should include:
1. Clear value proposition
2. Trust indicators (free, 810+ careers, PA-specific)
3. Primary CTA
4. Visual hierarchy (important info larger/bolder)

### Social Proof
- "Helping [X] Pennsylvanians find their path" (when you have data)
- Testimonials (when available)
- "Join [X] users who know their worth"
- Statistics: "810+ careers, 67 counties"

## 🎯 Conversion Funnel Optimization

### Homepage → Assessment
**Current path**: Homepage → "Get Started" → Basic Info

**Optimize**:
- Clear benefit statement
- Low friction (no email required upfront)
- Progress indicator visible
- Save progress feature
- Exit intent popup: "Wait! Save your assessment"

### Assessment → Results → Action
**Goal**: Keep users engaged after results

**Optimize results page**:
- Personalized career matches with PA salary data
- "Share your results" (social proof)
- "Explore resources for [their career]"
- "See salaries in [their county]"

## 🔧 Technical Implementation

### SEO Constants
Centralized in `src/lib/seo.ts`:
- `HOME_SEO` — Homepage structured data, keywords
- `SALARY_SEO` — Careers page metadata
- `RESOURCES_SEO` — Resource library metadata
- `CONTACT_SEO` — Contact page metadata
- `ASSESSMENT_SEO` — Assessment landing page metadata
- `PRIMARY_KEYWORDS`, `PAGE_KEYWORDS` — Keyword lists
- `generatePageTitle()`, `generateMetaDescription()` — Helper functions
- `generateLocalBusinessSchema()` — Schema.org generator

### Hostname Constant
Use a local `HOSTNAME` constant in route files for URL construction:
```tsx
const HOSTNAME = "https://compasscoachingpa.org";
// Then: `${HOSTNAME}/about`, `${HOSTNAME}/resources/articles/${slug}`, etc.
```

### Adding SEO to a New Page

1. **Public page**: Add full `head()` with title, description, OG, Twitter, canonical (see pattern above)
2. **Private page**: Add `head()` with title, description, and `robots: "noindex, nofollow"`
3. **Add to sitemap**: Add route to `scripts/generate-sitemap.ts` routes array
4. **Structured data** (if applicable): Add `scripts` array with `application/ld+json` in the `head()` return

## 📊 Measurement & Analytics

### Key Metrics to Track
1. **Organic Traffic**: Users from Google search
2. **Keyword Rankings**: Track target keywords monthly
3. **Bounce Rate**: Should be <60% for homepage
4. **Time on Page**: Higher = better engagement
5. **Conversion Rate**: Assessment starts / homepage visits

### Tools to Use
- Google Analytics 4 (track conversions)
- Google Search Console (keyword performance)
- PageSpeed Insights (performance)
- Ahrefs/SEMrush (keyword research, if budget allows)

### Monthly SEO Checklist
- [ ] Review new keyword opportunities
- [ ] Update content with fresh data
- [ ] Add internal links to new content
- [ ] Check for broken links
- [ ] Review top performing pages
- [ ] Identify high-bounce pages for improvement

## 🚀 Implementation Progress

### ✅ Completed
- [x] SEO constants file (`src/lib/seo.ts`)
- [x] Homepage meta tags with NonprofitOrganization schema
- [x] Hero copy (benefit-focused)
- [x] Open Graph tags on all public pages
- [x] Structured data (WebSite, NonprofitOrganization, Dataset, Article, BreadcrumbList)
- [x] All page titles optimized with `|` separator
- [x] Sitemap auto-generated pre-build (`scripts/generate-sitemap.ts`)
- [x] Dynamic article routes in sitemap (filtered by active + has content)
- [x] Full Open Graph + Twitter Cards on all public pages
- [x] Canonical URLs on all public pages
- [x] noindex on all private pages (dashboard, admin, assessment steps)
- [x] Article page SEO (Article schema, BreadcrumbList, OG article tags, reading time)
- [x] robots.txt configured
- [x] Semantic HTML (`<article>`, `<section>`, `<nav>`, `<main>`)
- [x] Heading IDs on article sections for fragment linking

### 🔜 Next Steps
- [ ] Add real OG images (currently using `discord-icon.png` placeholder)
- [ ] Create county-specific landing pages
- [ ] FAQ section with FAQ schema
- [ ] Google Search Console setup and monitoring
- [ ] Google Analytics 4 integration
- [ ] Content calendar for regular article publishing
- [ ] Backlink outreach to PA education sites

## 🎯 Success Metrics

### 3-Month Goals
- Rank on page 1 for "Pennsylvania career guidance"
- Rank top 5 for "PA salary data"
- 1000+ monthly organic visitors
- 10+ keywords in top 10

### 6-Month Goals
- Rank #1 for primary keywords
- 5000+ monthly organic visitors
- Featured snippet for "Pennsylvania salary data"
- 50+ keywords in top 10

### 12-Month Goals
- 20,000+ monthly organic visitors
- Authority site for PA career information
- 200+ keywords in top 10
- Backlinks from PA government sites

## 📚 Resources

### SEO Learning
- Google Search Central (https://developers.google.com/search)
- Moz Beginner's Guide to SEO
- Ahrefs Blog

### Tools (Free)
- Google Search Console
- Google Analytics 4
- Google PageSpeed Insights
- Bing Webmaster Tools

### Pennsylvania Resources
- PA Department of Labor (link opportunities)
- CareerLink Pennsylvania (partnership potential)
- PA colleges/universities (edu backlinks)

## 🔄 Continuous Improvement

### Content Updates
- Refresh salary data annually (when PA releases new data)
- Update "Last updated: [date]" on data pages
- Add new counties as data becomes available
- Create seasonal content (graduation, new year career goals)

### Competitive Analysis
- Monitor competitors for PA career guidance
- Identify keyword gaps
- Analyze their top-performing content
- Find backlink opportunities they're using

---

**Remember**: SEO is a marathon, not a sprint. Focus on creating genuinely helpful content for Pennsylvania residents, and rankings will follow. Our unique value proposition (real PA wage data) is a significant differentiator. Lean into it!

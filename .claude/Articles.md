# Article System Documentation

## Overview

Compass Coaching publishes long-form articles as part of the resource library. Articles live as data in `src/data/resources.ts` and are rendered by the dynamic route `src/routes/resources/articles.$slug.tsx`. Articles with content are auto-included in the sitemap.

## Architecture

### Data Layer

Articles are defined as `ArticleResource` objects within the resource arrays in `src/data/resources.ts`.

```typescript
export interface ArticleSection {
  heading: string;
  content: string[]; // array of paragraphs
}

export interface ArticleResource extends BaseResource {
  type: typeof RESOURCE_TYPES.ARTICLE; // "article"
  readTime: string;          // e.g. "15 min"
  slug?: string;             // URL slug for routing
  description?: string;      // SEO description / subtitle
  author?: string;           // defaults to "Compass Coaching Team"
  publishDate?: string;      // ISO date e.g. "2026-02-01"
  keywords?: string[];       // SEO keywords for this article
  sections?: ArticleSection[];
}
```

### Route

`src/routes/resources/articles.$slug.tsx` handles:
- **Loader**: Finds the article by slug from `ALL_RESOURCES`, throws `notFound()` if missing
- **Head**: Full SEO (Article + BreadcrumbList schemas, OG article tags, Twitter reading time)
- **Component**: Hero with title/description/readTime/author, then semantic article content

### Sitemap Integration

`scripts/generate-sitemap.ts` auto-collects article routes:
```typescript
const articleRoutes = ALL_RESOURCES
  .filter((r) => r.type === "article" && r.active && "slug" in r && r.slug
    && "sections" in r && Array.isArray(r.sections) && r.sections.length > 0)
  .map(r => ({ path: `/resources/articles/${r.slug}`, ... }));
```

An article appears in the sitemap only when it has `active: true`, a `slug`, and at least one section with content.

## Creating a New Article

### Step 1: Add the Resource Entry

In `src/data/resources.ts`, add an `ArticleResource` to the appropriate category array:

```typescript
{
  title: "Your Article Title",
  type: RESOURCE_TYPES.ARTICLE,
  readTime: "12 min",                    // Estimate based on ~200 words/min
  slug: "your-article-title",            // Kebab-case, used in URL
  description: "One-sentence summary for SEO and the hero subtitle.",
  author: "Compass Coaching Team",
  publishDate: "2026-03-15",             // ISO date
  keywords: ["keyword one", "keyword two", "keyword three"],
  category: CATEGORY_NAMES.RELATIONSHIPS, // Must match an existing category
  active: true,
  sections: [
    {
      heading: "Section Title",
      content: [
        "First paragraph of this section.",
        "Second paragraph. Use **bold** for emphasis (rendered via split on **)."
      ]
    },
    // ... more sections
  ],
},
```

### Step 2: Verify

1. Run `npm run build` — the sitemap generator will confirm the article is included
2. Visit `/resources/articles/your-article-title` in dev to verify rendering
3. Check the page source for Article schema, BreadcrumbList, and OG tags

### Required Fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Article title, used in H1 and schema |
| `type` | Yes | Must be `RESOURCE_TYPES.ARTICLE` |
| `readTime` | Yes | Display string like "15 min" |
| `slug` | Yes (for routing) | Kebab-case URL slug |
| `category` | Yes | Must match a `CATEGORY_NAMES` value |
| `active` | Yes | Set `true` when content is ready |
| `sections` | Yes (for content) | Array of `{heading, content[]}` |
| `description` | Recommended | SEO meta description fallback |
| `author` | Recommended | Defaults to "Compass Coaching Team" |
| `publishDate` | Recommended | ISO date for Article schema |
| `keywords` | Recommended | 4-8 SEO keywords per article |

### Placeholder Articles

To create a placeholder (appears in the resource list but has no article page):
- Set `active: true` but omit `slug` and `sections`
- The article will show in the category page but won't have a clickable article route
- It won't appear in the sitemap

## Writing Guidelines

### Tone & Voice

Articles should be **scholarly yet personable**. The target is authoritative content that reads like it was written by a knowledgeable friend, not a textbook or a corporate blog.

**Do**:
- Write in second person ("you") to create direct connection
- Cite research and established frameworks naturally, without academic citation formatting
- Use concrete examples and scenarios readers can relate to
- Maintain warmth while being substantive
- Vary sentence length for rhythm
- Use transitional phrases between ideas

**Don't**:
- Write in a dry academic style with passive voice throughout
- Use corporate jargon or marketing-speak
- Overuse em dashes (—) — this is a red flag for AI-generated content
- Start every paragraph the same way
- Use filler phrases ("In today's fast-paced world...", "It goes without saying...")
- Include numbered lists where prose would read more naturally

### Punctuation Guidelines

- **Avoid excessive em dashes**: Use sparingly for emphasis. Prefer commas, periods, colons, or restructuring.
  - ✅ "Completely free, powered by donations"
  - ✅ "Career success and life wellbeing. We guide you in both."
  - ❌ "Completely free—powered by donations—no strings attached"
- **Bold for emphasis**: Use `**bold**` sparingly for key terms on first introduction
- **No markdown headers in content**: Section headings come from the `heading` field, not from paragraph text

### Content Quality Standards

**Depth**: Articles should demonstrate genuine expertise. Reference specific research, name researchers or frameworks, cite real studies (with enough detail to be verifiable).

**Example** (good):
> "Carl Rogers, the founder of person-centered therapy, considered this kind of listening the foundation of any meaningful helping relationship."

**Example** (bad):
> "Studies show that listening is important for relationships."

**Length**: Target 1,500-3,000 words (8-15 minute read time). Each section should have 2-4 paragraphs.

**Structure**:
- Open with a relatable scenario or observation that draws the reader in
- Build understanding progressively through the middle sections
- Include practical, actionable techniques readers can apply
- Close with broader significance and a clear call to action
- Consider including a structured practice or exercise readers can follow

### Formatting Within Content

Content paragraphs support basic **bold** formatting via `**text**` syntax. The renderer splits on `**` and alternates between normal and bold spans.

- `"This is a **key concept** in the paragraph."` → renders "key concept" in bold
- No other markdown is supported in paragraph text (no links, italics, headers, lists)
- If you need a list, write it as prose with bold labels:
  ```
  "**Level 1: Ignoring.** You're physically present but your mind is somewhere else."
  ```

### SEO Considerations for Articles

The article route automatically generates:
- Page title: `{article.title} | Compass Coaching`
- Meta description: Falls back to first 155 chars of first paragraph if `description` is not set
- Article schema with word count, section, keywords, dates
- BreadcrumbList: Resources → Category → Article
- OG article tags: `article:author`, `article:section`, `article:published_time`, `article:tag` (from keywords)
- Twitter card with reading time label
- Heading IDs on each `<h2>` for fragment linking (auto-generated from heading text)

**Keyword placement**: Include primary keywords naturally in:
- The article `title`
- The `description`
- The first paragraph of the first section
- At least 2-3 section headings
- The `keywords` array (4-8 terms)

## Reference Article

"The Art of Listening" (`slug: the-art-of-listening`) in the Relationships & Communication category serves as the reference implementation. It demonstrates:
- Scholarly + personable tone
- Research citations (Carl Rogers, ILA statistics, 2014 Environment and Behavior study)
- Progressive structure (why → what → how → practice)
- Practical techniques with clear instructions
- Structured 4-week practice at the end
- Bold labels for multi-item explanations
- Appropriate length (~2,400 words, 15 min read)

## Article Checklist

When creating a new article, verify:

- [ ] `slug` is kebab-case and unique
- [ ] `active: true` set
- [ ] `publishDate` set to intended publish date
- [ ] `keywords` array has 4-8 relevant terms
- [ ] `description` is a compelling 1-sentence summary (~150 chars)
- [ ] `readTime` accurately reflects word count (~200 words/min)
- [ ] First section opens with a relatable hook, not a definition
- [ ] Research/frameworks cited with enough detail to be verifiable
- [ ] No overuse of em dashes
- [ ] Bold used sparingly for key terms
- [ ] Sections progress logically (why → what → how → practice)
- [ ] Closes with actionable takeaway
- [ ] Build passes (`npm run build`)
- [ ] Sitemap includes the new article route

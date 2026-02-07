/**
 * SEO Constants and Best Practices
 * Central location for all SEO-related content
 *
 * CORE MISSION: Free career and life guidance through personalized assessment
 * PRIMARY OFFERING: Assessment → Personalized resources → Actionable guidance
 * SUPPORTING FEATURES: PA wage data, 90+ resources, expert guidance
 *
 * BEST PRACTICES:
 * 1. Title Tags: 50-60 characters, include primary keyword and brand
 * 2. Meta Descriptions: 150-160 characters, include call-to-action and benefit
 * 3. Local SEO: Include location (Pennsylvania) early in title/description
 * 4. Benefits First: Lead with what user gets, not what we are
 * 5. Emotional Hooks: Address pain points (uncertainty, confusion, direction)
 * 6. Primary Keywords: career guidance, life guidance, career assessment, coaching
 * 7. Secondary Keywords: career resources, mental wellbeing, PA careers
 * 8. Power Words: free, discover, personalized, guidance, confidence, path
 */

// Primary Keywords - Use these consistently
export const PRIMARY_KEYWORDS = {
  location: 'Pennsylvania',
  service: 'career and life guidance',
  mainOffering: 'personalized assessment',
  benefit: 'find your path',
  action: 'discover your direction',
} as const;

// Homepage SEO
export const HOME_SEO = {
  title: 'Free Career & Life Guidance for Pennsylvania | Compass Coaching',
  titleShort: 'Compass Coaching - PA Career & Life Guidance',

  // Meta description (158 chars) - optimized for search results
  description:
    'Free personalized career and life guidance for Pennsylvania. Take our assessment, get matched to tailored resources & find your path forward—100% free.',

  // Hero subheading - benefit-focused, emotionally engaging
  heroSubheading:
    'Take our free assessment and get personalized guidance matched to your values, personality, and goals—for career and life.',

  // Alternative hero (more action-oriented)
  heroSubheadingAlt:
    'Free for all Pennsylvanians—discover your path with personalized coaching and 90+ resources for career and life success.',

  // Open Graph / Social Media
  ogTitle: 'Free Career & Life Guidance for Pennsylvania | Compass Coaching',
  ogDescription:
    'Navigate your future with confidence. Free personalized assessment, 90+ resources, and expert guidance for career & life—serving all of Pennsylvania.',

  // Schema.org structured data
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: 'Compass Coaching',
    description: 'Free personalized career and life guidance through assessment-driven resource matching',
    areaServed: {
      '@type': 'State',
      name: 'Pennsylvania',
    },
    knowsAbout: [
      'Career Counseling',
      'Life Coaching',
      'Career Assessment',
      'Mental Wellbeing',
      'Personal Development',
      'Career Planning',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'Free personalized career and life guidance with assessment and 90+ curated resources',
    },
  },
} as const;

// Assessment/Intake SEO
export const ASSESSMENT_SEO = {
  title: 'Free Career & Life Assessment | Compass Coaching',
  description:
    'Take our free personalized assessment. Discover career paths and life resources matched to your personality, values, and goals. Start finding your direction today.',
} as const;

// Resources SEO
export const RESOURCES_SEO = {
  title: 'Free Career & Life Resources for PA | Compass Coaching',
  description:
    '90+ free resources for Pennsylvania residents: career exploration, resume building, interview prep, mental wellbeing, relationships, healthy living & more.',
} as const;

// Salary/Wage Data SEO (Supporting Feature)
export const SALARY_SEO = {
  title: 'Pennsylvania Salary Data - 810+ Careers | Compass Coaching',
  description:
    'Real Pennsylvania wage data for 810+ occupations across 67 counties. Supporting your career decisions with accurate salary information for negotiation and planning.',

  // For individual occupation pages
  occupationTitleTemplate: (occupation: string, county?: string) =>
    county
      ? `${occupation} Salary in ${county} County, PA | Compass Coaching`
      : `${occupation} Salary in Pennsylvania | Compass Coaching`,

  occupationDescriptionTemplate: (
    occupation: string,
    medianSalary: string,
    county?: string
  ) =>
    county
      ? `${occupation} salary in ${county} County: ${medianSalary} median. View entry, mid & experienced wages + negotiation tips.`
      : `${occupation} salary in Pennsylvania: ${medianSalary} median. Compare across 67 counties. Real wage data for career planning.`,
} as const;

// Contact SEO
export const CONTACT_SEO = {
  title: 'Contact Compass Coaching - PA Career Guidance Help',
  description:
    'Have questions about our free career guidance or PA wage data? Contact Compass Coaching for personalized support.',
} as const;

// Keywords by page type
export const PAGE_KEYWORDS = {
  home: [
    'career guidance Pennsylvania',
    'Pennsylvania salary data',
    'free career assessment',
    'PA wage information',
    'know your worth PA',
    'career help Pennsylvania',
    'salary negotiation Pennsylvania',
  ],
  assessment: [
    'career assessment',
    'personality career match',
    'career aptitude test',
    'find your career path',
    'career guidance quiz',
  ],
  salaries: [
    'Pennsylvania salary',
    'PA wage data',
    'occupation wages Pennsylvania',
    'county salary comparison',
    'PA salary by occupation',
    'Pennsylvania pay scale',
  ],
  resources: [
    'career resources',
    'free career tools',
    'resume help',
    'job search tips',
    'interview preparation',
  ],
} as const;

// Call-to-Action phrases (conversion-optimized)
export const CTA_PHRASES = {
  primary: 'Get Started Free',
  secondary: 'Explore PA Salaries',
  tertiary: 'Take Free Assessment',

  // Benefit-focused CTAs
  benefitDriven: {
    assessment: 'Discover Your Worth',
    salaries: 'See What You Should Earn',
    resources: 'Access Free Resources',
    general: 'Find Your Path Forward',
  },
} as const;

// Trust indicators (use throughout site)
export const TRUST_INDICATORS = {
  free: '100% Free Forever',
  data: 'Real PA Dept. of Labor Data (2024)',
  coverage: 'All 67 Pennsylvania Counties',
  careers: '810+ Career Paths',
  nonprofit: 'Donation-Funded Non-Profit',
  privacy: 'Your Data Stays Local',
} as const;

// Local SEO - Counties (for future county-specific pages)
export const PA_COUNTIES = [
  'Adams', 'Allegheny', 'Armstrong', 'Beaver', 'Bedford',
  'Berks', 'Blair', 'Bradford', 'Bucks', 'Butler',
  'Cambria', 'Cameron', 'Carbon', 'Centre', 'Chester',
  'Clarion', 'Clearfield', 'Clinton', 'Columbia', 'Crawford',
  'Cumberland', 'Dauphin', 'Delaware', 'Elk', 'Erie',
  'Fayette', 'Forest', 'Franklin', 'Fulton', 'Greene',
  'Huntingdon', 'Indiana', 'Jefferson', 'Juniata', 'Lackawanna',
  'Lancaster', 'Lawrence', 'Lebanon', 'Lehigh', 'Luzerne',
  'Lycoming', 'McKean', 'Mercer', 'Mifflin', 'Monroe',
  'Montgomery', 'Montour', 'Northampton', 'Northumberland', 'Perry',
  'Philadelphia', 'Pike', 'Potter', 'Schuylkill', 'Snyder',
  'Somerset', 'Sullivan', 'Susquehanna', 'Tioga', 'Union',
  'Venango', 'Warren', 'Washington', 'Wayne', 'Westmoreland',
  'Wyoming', 'York'
] as const;

// SEO-friendly URLs (slug patterns)
export const URL_PATTERNS = {
  salaries: '/salaries',
  salaryByOccupation: '/salaries/:occupation',
  salaryByCounty: '/salaries/:occupation/:county',
  resources: '/resources',
  resourceByCategory: '/resources/:category',
  assessment: '/intake',
  assessmentSection: '/intake/:section',
} as const;

/**
 * Generate page title with proper format
 * Format: [Page Title] | [Brand]
 * Max 60 characters
 */
export function generatePageTitle(pageTitle: string): string {
  const brand = 'Compass Coaching';
  const separator = ' | ';
  const full = `${pageTitle}${separator}${brand}`;

  // Truncate if too long (keeping brand intact)
  if (full.length > 60) {
    const maxPageLength = 60 - separator.length - brand.length - 3; // 3 for "..."
    return `${pageTitle.substring(0, maxPageLength)}...${separator}${brand}`;
  }

  return full;
}

/**
 * Generate meta description with proper length
 * Max 160 characters
 */
export function generateMetaDescription(content: string): string {
  if (content.length <= 160) return content;

  // Truncate at word boundary
  const truncated = content.substring(0, 157);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate structured data for local business/nonprofit
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: 'Compass Coaching',
    description: 'Free career and life guidance platform serving Pennsylvania residents with real wage data',
    url: 'https://compasscoaching.org', // Update with actual domain
    logo: 'https://compasscoaching.org/logo.png', // Update with actual logo URL
    areaServed: {
      '@type': 'State',
      name: 'Pennsylvania',
      '@id': 'https://en.wikipedia.org/wiki/Pennsylvania',
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'PA',
      addressCountry: 'US',
    },
    sameAs: [
      // Add social media URLs when available
    ],
    knowsAbout: [
      'Career Counseling',
      'Salary Information',
      'Wage Data',
      'Career Assessment',
      'Job Search Assistance',
    ],
  };
}

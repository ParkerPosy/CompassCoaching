import { createFileRoute, useSearch, useNavigate, Link } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { Container } from '@/components/layout/container';
import { OccupationsTable } from '@/components/OccupationsTable';
import { Briefcase, Database, MapPin } from 'lucide-react';
import { SALARY_SEO } from '@/lib/seo';

type CareersSearchParams = {
  search?: string;
  county?: string;
  category?: string;
  page?: number;
};

export const Route = createFileRoute('/careers')({
  component: CareersPage,
  validateSearch: (search: Record<string, unknown>): CareersSearchParams => {
    return {
      search: typeof search.search === 'string' ? search.search : undefined,
      county: typeof search.county === 'string' ? search.county : undefined,
      category: typeof search.category === 'string' ? search.category : undefined,
      page: typeof search.page === 'number' ? search.page : undefined,
    };
  },
  head: () => {
    const canonicalUrl = 'https://compasscoachingpa.org/careers';
    return {
      meta: [
        { title: SALARY_SEO.title },
        { name: 'description', content: SALARY_SEO.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Pennsylvania Salary Data for 810+ Careers | Compass Coaching' },
        { property: 'og:description', content: SALARY_SEO.description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:site_name', content: 'Compass Coaching' },
        { property: 'og:image', content: 'https://compasscoachingpa.org/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PA Salary Data for 810+ Careers' },
        { name: 'twitter:description', content: SALARY_SEO.description },
        { name: 'keywords', content: 'Pennsylvania salary data, PA wages, occupation salary, county wage comparison, career explorer, salary negotiation PA' },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Pennsylvania Occupation Wage Data',
            description: 'Real wage data for 810+ occupations across all 67 Pennsylvania counties, sourced from the PA Department of Labor & Industry.',
            url: canonicalUrl,
            license: 'https://creativecommons.org/publicdomain/zero/1.0/',
            creator: {
              '@type': 'Organization',
              name: 'Compass Coaching',
              url: 'https://compasscoachingpa.org',
            },
            spatialCoverage: 'Pennsylvania, United States',
            temporalCoverage: '2024',
            variableMeasured: ['Annual Wage', 'Hourly Wage', 'Entry Level Wage', 'Experienced Wage'],
          }),
        },
      ],
    };
  },
});

// Geometric pattern for technical page - clean but present
function CareersPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Base gradient - deep blue */}
        <linearGradient id="careersBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#172554" />
          <stop offset="50%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        {/* Lime accent gradient */}
        <linearGradient id="careersAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#65a30d" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#84cc16" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#65a30d" stopOpacity="0.3" />
        </linearGradient>

        {/* Secondary lime gradient - reversed */}
        <linearGradient id="careersAccent2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#a3e635" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#65a30d" stopOpacity="0.3" />
        </linearGradient>

        {/* Filled swoosh gradient */}
        <linearGradient id="careersSwooshFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Base fill */}
      <rect width="100%" height="100%" fill="url(#careersBg)" />

      {/* Filled swoosh area - subtle wave shape */}
      <path
        d="M0 320 Q200 250 500 280 T900 240 T1200 260 L1200 400 L0 400 Z"
        fill="url(#careersSwooshFill)"
      />

      {/* Primary swoosh line - lime accent (main) - gentle curve */}
      <path
        d="M0 310 Q180 260 450 290 Q750 320 1000 250 Q1120 220 1200 240"
        fill="none"
        stroke="url(#careersAccent)"
        strokeWidth="3"
      />

      {/* Secondary green swoosh - steeper descent */}
      <path
        d="M0 260 Q250 280 500 230 Q800 170 1050 200 T1200 180"
        fill="none"
        stroke="url(#careersAccent2)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Third green swoosh - rising then falling */}
      <path
        d="M0 370 Q200 340 400 360 Q650 390 850 320 Q1050 260 1200 290"
        fill="none"
        stroke="rgba(132, 204, 22, 0.4)"
        strokeWidth="2"
      />

      {/* Fourth green swoosh - dramatic dip */}
      <path
        d="M0 390 Q300 380 500 350 Q700 310 900 340 Q1100 380 1200 350"
        fill="none"
        stroke="rgba(163, 230, 53, 0.25)"
        strokeWidth="1.5"
      />

      {/* White accent swooshes for depth - varied curves */}
      <path
        d="M0 340 Q350 290 600 330 Q850 370 1050 300 T1200 310"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />
      <path
        d="M0 380 Q250 350 450 370 Q700 400 950 350 Q1100 320 1200 340"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* Top accent curves - green, dynamic varied angles */}
      <path
        d="M700 0 Q800 120 950 80 Q1100 40 1200 110"
        fill="none"
        stroke="url(#careersAccent)"
        strokeWidth="2.5"
        opacity="0.45"
      />
      <path
        d="M850 0 Q900 60 1000 40 Q1150 10 1200 60"
        fill="none"
        stroke="url(#careersAccent2)"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M950 0 Q980 80 1050 50 Q1120 20 1200 80"
        fill="none"
        stroke="rgba(163, 230, 53, 0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M1020 0 Q1070 35 1100 60 Q1150 90 1200 45"
        fill="none"
        stroke="rgba(132, 204, 22, 0.35)"
        strokeWidth="1.5"
      />
      <path
        d="M1100 0 Q1120 50 1160 30 Q1180 15 1200 40"
        fill="none"
        stroke="rgba(163, 230, 53, 0.25)"
        strokeWidth="1"
      />
      <path
        d="M780 0 Q850 50 920 20 Q1000 -10 1080 30"
        fill="none"
        stroke="rgba(132, 204, 22, 0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

function OccupationsTableWrapper() {
  const searchParams = useSearch({ from: '/careers' });
  const navigate = useNavigate({ from: '/careers' });

  const updateFilters = useCallback(
    (updates: Partial<CareersSearchParams>) => {
      navigate({
        search: (prev) => {
          const next = { ...prev, ...updates };
          // Remove undefined/empty values to keep URL clean
          for (const key of Object.keys(next) as (keyof CareersSearchParams)[]) {
            if (next[key] === undefined || next[key] === '' || next[key] === 'All') {
              delete next[key];
            }
          }
          // Reset page when filters change (except when page itself changes)
          if (!('page' in updates) && Object.keys(updates).length > 0) {
            delete next.page;
          }
          return next;
        },
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  return (
    <OccupationsTable
      initialPageSize={10}
      search={searchParams.search ?? ''}
      county={searchParams.county ?? 'All'}
      category={searchParams.category ?? 'All'}
      page={searchParams.page ?? 1}
      onFiltersChange={updateFilters}
    />
  );
}

function CareersPage() {
  // Scroll to top on mount to override any incorrect scroll restoration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <section className="relative text-white py-12 md:py-16 pb-16 md:pb-20 overflow-hidden">
        <CareersPattern />
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-10 h-10 text-lime-400" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Pennsylvania Career Explorer
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">
              Explore 810+ occupations with real Pennsylvania wage data across all 67
              counties. Use this tool to research careers and make informed decisions.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold">Real PA Data</h3>
                </div>
                <p className="text-sm text-blue-100">
                  May 2024 wage data from PA Dept. of Labor & Industry
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold">67 Counties</h3>
                </div>
                <p className="text-sm text-blue-100">
                  County-specific salary data for local career planning
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold">Career Planning</h3>
                </div>
                <p className="text-sm text-blue-100">
                  Entry to experienced salary ranges for every occupation
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="w-full h-8 md:h-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 Q200 60 400 30 Q600 0 800 20 Q1000 40 1200 10 L1200 60 L0 60 Z"
              fill="#fafaf9"
            />
            <path
              d="M0 40 Q200 60 400 30 Q600 0 800 20 Q1000 40 1200 10"
              fill="none"
              stroke="#84cc16"
              strokeWidth="2"
              opacity="0.4"
            />
          </svg>
        </div>
      </section>

      {/* Table Section */}
      <section className="py-8 md:py-12">
        <Container>
          <div id="browse-occupations" className="mb-8">
            <h2 className="text-2xl font-bold text-stone-700 mb-2">
              Browse All Occupations
            </h2>
            <p className="text-stone-600">
              Search, sort, and explore career options. Click on any occupation to view
              detailed county-by-county salary information and career insights.
            </p>
          </div>

          <OccupationsTableWrapper />

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📊 How to Use This Data
              </h3>
              <ul className="space-y-2 text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    <strong>Research careers:</strong> Explore different occupations and
                    their educational requirements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    <strong>Compare salaries:</strong> See how wages compare across
                    Pennsylvania
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    <strong>Plan your path:</strong> Understand salary progression from
                    entry to experienced level
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    <strong>Negotiate confidently:</strong> Know the market rate for
                    your role and location
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-lime-50 border border-lime-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-lime-900 mb-3">
                💡 Next Steps
              </h3>
              <ul className="space-y-2 text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="text-lime-600 font-bold">•</span>
                  <span>
                    <strong>Take our assessment:</strong> Get personalized career matches
                    based on your values and personality
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-600 font-bold">•</span>
                  <span>
                    <strong>Explore resources:</strong> Access 70+ free guides for
                    career development and life wellbeing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-600 font-bold">•</span>
                  <span>
                    <strong>Get guidance:</strong> Use our resources for resume building,
                    interview prep, and more
                  </span>
                </li>
              </ul>
              <div className="mt-4">
                <a
                  href="/intake"
                  className="inline-flex items-center justify-center px-6 py-3 bg-lime-600 text-white rounded-lg font-semibold hover:bg-lime-700 transition-colors"
                >
                  Start Free Assessment →
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-stone-100 border border-stone-300 rounded-lg text-sm text-stone-600 space-y-3">
            <p>
              <strong>Data Source:</strong>{' '}
              <a
                href="https://www.pa.gov/agencies/dli/resources/statistic-materials/products/occupational-wages/county-wages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Pennsylvania Department of Labor & Industry
              </a>,
              Occupational Employment and Wage Statistics (OEWS), May 2024. Some
              occupations may show data from Workforce Development Areas (WDA) or
              Metropolitan Statistical Areas (MSA) when county-specific data is
              unavailable.
            </p>
            <p>
              <strong>Disclaimer:</strong> Salary information is provided for informational purposes only and may not
              reflect current market conditions in your specific area. Actual wages may vary based on experience,
              employer, location, and other factors. We recommend verifying salary data independently before making
              career decisions.
            </p>
            <p className="text-xs text-stone-500">
              By using this service, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

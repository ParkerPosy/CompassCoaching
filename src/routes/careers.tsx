import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Container } from '@/components/layout/container';
import { OccupationsTable } from '@/components/OccupationsTable';
import { Briefcase, Database, MapPin } from 'lucide-react';
import { SALARY_SEO } from '@/lib/seo';

export const Route = createFileRoute('/careers')({
  component: CareersPage,
  head: () => ({
    meta: [
      {
        title: SALARY_SEO.title,
      },
      {
        name: 'description',
        content: SALARY_SEO.description,
      },
    ],
  }),
});

function CareersPage() {
  // Scroll to top on mount to override any incorrect scroll restoration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 md:py-16">
        <Container>
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
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold">Real PA Data</h3>
                </div>
                <p className="text-sm text-blue-100">
                  May 2024 wage data from PA Dept. of Labor & Industry
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold">67 Counties</h3>
                </div>
                <p className="text-sm text-blue-100">
                  County-specific salary data for local career planning
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
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
      </section>

      {/* Table Section */}
      <section className="py-12">
        <Container>
          <div id="browse-occupations" className="mb-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Browse All Occupations
            </h2>
            <p className="text-stone-600">
              Search, sort, and explore career options. Click on any occupation to view
              detailed county-by-county salary information and career insights.
            </p>
          </div>

          <OccupationsTable initialPageSize={10} />

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
                    <strong>Explore resources:</strong> Access 90+ free guides for
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
          <div className="mt-8 p-4 bg-stone-100 border border-stone-300 rounded-lg text-sm text-stone-600">
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
          </div>
        </Container>
      </section>
    </div>
  );
}

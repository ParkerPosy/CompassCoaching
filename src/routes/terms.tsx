import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '@/components/layout/container';
import { FileText, Shield, AlertTriangle, Scale, Users, Mail } from 'lucide-react';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      {
        title: 'Terms of Service | Compass Coaching',
      },
      {
        name: 'description',
        content: 'Terms of Service for Compass Coaching career assessment and resources platform.',
      },
    ],
  }),
});

function TermsPage() {
  const lastUpdated = 'February 9, 2026';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-12 md:py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Please read these terms carefully before using Compass Coaching services.
          </p>
          <p className="text-blue-200 text-sm mt-4">Last updated: {lastUpdated}</p>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Acceptance */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Scale className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-stone-600 leading-relaxed">
                    By accessing or using Compass Coaching ("the Service"), you agree to be bound by these Terms of Service.
                    If you do not agree to these terms, please do not use our services. We reserve the right to modify
                    these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-lime-100 rounded-lg shrink-0">
                  <Users className="w-5 h-5 text-lime-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">2. Description of Service</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    Compass Coaching is a free, non-profit career exploration platform that provides:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li>Self-assessment tools to help users explore career interests and aptitudes</li>
                    <li>Career information and salary data sourced from public government databases</li>
                    <li>Educational resources and guidance materials</li>
                    <li>Connection to career coaching services</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Disclaimers */}
            <div className="bg-amber-50 rounded-xl border-2 border-amber-300 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-200 rounded-lg shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-3">3. Important Disclaimers</h2>

                  <h3 className="font-semibold text-amber-800 mt-4 mb-2">Not Professional Advice</h3>
                  <p className="text-amber-900/80 leading-relaxed mb-4">
                    <strong>The Service is for informational and educational purposes only.</strong> Compass Coaching does not
                    provide professional career counseling, employment advice, legal advice, financial advice, or any other
                    form of licensed professional services. The career assessments, recommendations, and information provided
                    are self-discovery tools meant to assist in your exploration—they are not diagnostic instruments or
                    professional evaluations.
                  </p>

                  <h3 className="font-semibold text-amber-800 mt-4 mb-2">No Guarantees</h3>
                  <p className="text-amber-900/80 leading-relaxed mb-4">
                    We make no guarantees regarding the accuracy, completeness, or reliability of any information provided.
                    Career matches and recommendations are suggestions based on self-reported data and should not be treated
                    as definitive guidance. Salary data is sourced from public databases and may not reflect current market
                    conditions in your specific area.
                  </p>

                  <h3 className="font-semibold text-amber-800 mt-4 mb-2">Consult Professionals</h3>
                  <p className="text-amber-900/80 leading-relaxed">
                    Before making significant career, educational, or financial decisions, we strongly recommend consulting
                    with licensed career counselors, educational advisors, or other qualified professionals who can provide
                    personalized guidance based on your specific circumstances.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg shrink-0">
                  <Shield className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">4. Limitation of Liability</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPASS COACHING AND ITS FOUNDERS, VOLUNTEERS, AND AFFILIATES
                    SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
                    LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                    GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li>Your use or inability to use the Service</li>
                    <li>Any decisions made based on information provided by the Service</li>
                    <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                    <li>Any errors or omissions in any content or information provided</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">5. Disclaimer of Warranties</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
                ERROR-FREE.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">6. User Responsibilities</h2>
              <p className="text-stone-600 leading-relaxed mb-4">By using our Service, you agree to:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Provide accurate and honest information when completing assessments</li>
                <li>Use the Service for personal, non-commercial purposes only</li>
                <li>Not attempt to circumvent any security features or access restrictions</li>
                <li>Not use the Service for any unlawful purpose</li>
                <li>Verify important information independently before making decisions</li>
              </ul>
            </div>

            {/* Data and Privacy */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">7. Data and Privacy</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Your privacy is important to us. Assessment data is stored locally in your browser and is not transmitted
                to our servers. For complete information about how we handle data, please review our{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">8. Intellectual Property</h2>
              <p className="text-stone-600 leading-relaxed">
                All content, features, and functionality of the Service—including but not limited to text, graphics,
                logos, and software—are the property of Compass Coaching or its licensors and are protected by copyright,
                trademark, and other intellectual property laws. Career and salary data is sourced from public government
                databases and is used in accordance with applicable data use policies.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">9. Governing Law</h2>
              <p className="text-stone-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of
                Pennsylvania, United States, without regard to its conflict of law provisions.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-3">10. Contact Us</h2>
                  <p className="text-blue-800 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{' '}
                    <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      our contact page
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-medium rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '@/components/layout/container';
import { Shield, Database, Cookie, Eye, Lock, Users, Mail, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Compass Coaching' },
      { name: 'description', content: 'Privacy Policy for Compass Coaching - Learn how we protect your data and respect your privacy.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Privacy Policy | Compass Coaching' },
      { property: 'og:description', content: 'Learn how Compass Coaching protects your data and respects your privacy.' },
      { property: 'og:url', content: 'https://compasscoachingpa.org/privacy' },
      { property: 'og:site_name', content: 'Compass Coaching' },
      { property: 'og:image', content: 'https://compasscoachingpa.org/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Privacy Policy | Compass Coaching' },
      { name: 'twitter:description', content: 'Learn how Compass Coaching protects your data and respects your privacy.' },
    ],
    links: [{ rel: 'canonical', href: 'https://compasscoachingpa.org/privacy' }],
  }),
});

function PrivacyPage() {
  const lastUpdated = 'February 9, 2026';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-lime-800 via-lime-700 to-lime-600 text-white py-12 md:py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lime-100 text-lg max-w-2xl">
            Your privacy matters to us. Learn how Compass Coaching handles your information.
          </p>
          <p className="text-lime-200 text-sm mt-4">Last updated: {lastUpdated}</p>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Key Highlights */}
            <div className="bg-lime-50 rounded-xl border-2 border-lime-300 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-lime-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy at a Glance
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-lime-200">
                  <p className="font-semibold text-lime-800 mb-1">✓ Data Stays Local</p>
                  <p className="text-sm text-stone-600">Assessment data is stored in your browser, not on our servers</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-lime-200">
                  <p className="font-semibold text-lime-800 mb-1">✓ No Tracking</p>
                  <p className="text-sm text-stone-600">We don't sell your data or use invasive tracking</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-lime-200">
                  <p className="font-semibold text-lime-800 mb-1">✓ You're in Control</p>
                  <p className="text-sm text-stone-600">Clear your data anytime by clearing browser storage</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-lime-200">
                  <p className="font-semibold text-lime-800 mb-1">✓ Minimal Collection</p>
                  <p className="text-sm text-stone-600">We only collect what's necessary to provide our service</p>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Database className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">1. Information We Collect</h2>

                  <h3 className="font-semibold text-stone-700 mt-4 mb-2">Assessment Data</h3>
                  <p className="text-stone-600 leading-relaxed mb-3">
                    When you complete our career assessment, the following information is stored <strong>only in your
                    browser's local storage</strong>:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4 mb-4">
                    <li>Your name (if provided)</li>
                    <li>Assessment responses (personality, aptitude, values, challenges)</li>
                    <li>Generated career matches and recommendations</li>
                  </ul>

                  <h3 className="font-semibold text-stone-700 mt-4 mb-2">Account Information</h3>
                  <p className="text-stone-600 leading-relaxed mb-3">
                    If you choose to create an account for coaching features, we collect:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4 mb-4">
                    <li>Email address</li>
                    <li>Name</li>
                    <li>Account authentication data (managed securely by Clerk)</li>
                  </ul>

                  <h3 className="font-semibold text-stone-700 mt-4 mb-2">Automatically Collected Information</h3>
                  <p className="text-stone-600 leading-relaxed mb-3">
                    Like most websites, we may automatically collect basic technical information:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                    <li>Browser type and version</li>
                    <li>Device type</li>
                    <li>General location (country/region, not precise location)</li>
                    <li>Pages visited and time spent</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                  <Eye className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">2. How We Use Your Information</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">We use collected information to:</p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li>Provide and improve our career assessment and coaching services</li>
                    <li>Authenticate users who create accounts</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Understand how our service is used to make improvements</li>
                    <li>Ensure the security and integrity of our platform</li>
                  </ul>
                  <p className="text-stone-600 leading-relaxed mt-4 font-medium">
                    We do NOT use your information to:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li>Sell to third parties</li>
                    <li>Send unsolicited marketing emails</li>
                    <li>Build advertising profiles</li>
                    <li>Share with employers or educational institutions without your consent</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                  <ExternalLink className="w-5 h-5 text-orange-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">3. Third-Party Services</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    We use the following third-party services that may process some data:
                  </p>

                  <div className="bg-stone-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-stone-700">Clerk (Authentication)</p>
                    <p className="text-stone-600 text-sm mt-1">
                      If you create an account, Clerk securely manages authentication. They have their own{' '}
                      <a
                        href="https://clerk.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Privacy Policy
                      </a>.
                    </p>
                  </div>

                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="font-semibold text-stone-700">Hosting Provider</p>
                    <p className="text-stone-600 text-sm mt-1">
                      Our website is hosted on secure cloud infrastructure that may log standard web server information
                      for security and performance purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                  <Cookie className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">4. Cookies and Browser Storage</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    <strong>Browser Storage:</strong> We use your browser's local storage to save your assessment
                    progress and results. This data stays on your device and never leaves unless you explicitly
                    download or share it. You can clear this data at any time through your browser settings.
                  </p>
                  <p className="text-stone-600 leading-relaxed">
                    <strong>Cookies:</strong> If you create an account, authentication cookies are used to keep you
                    logged in. We do not use cookies for advertising or cross-site tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Lock className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">5. Data Security</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    We take reasonable measures to protect information:
                  </p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li>HTTPS encryption for all data in transit</li>
                    <li>Secure authentication through industry-standard providers</li>
                    <li>Regular security reviews of our codebase</li>
                    <li>Minimal data collection philosophy</li>
                  </ul>
                  <p className="text-stone-600 leading-relaxed mt-4">
                    However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                  <Users className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-3">6. Your Rights and Choices</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                    <li><strong>Access:</strong> View what assessment data is stored in your browser's local storage</li>
                    <li><strong>Delete:</strong> Clear your browser's local storage at any time to remove all assessment data</li>
                    <li><strong>Export:</strong> Download your results using our PDF export feature</li>
                    <li><strong>Account Deletion:</strong> Delete your account directly through your account settings page with Clerk</li>
                    <li><strong>Opt-out:</strong> Choose not to create an account and still use our assessment tools</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">7. Children's Privacy</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Our service is designed to be used by students, including those under 18. Because assessment data is stored
                locally in the browser and we do not collect personal information from users who don't create accounts,
                students can use the assessment tools without providing personal information to our servers.
              </p>
              <p className="text-stone-600 leading-relaxed">
                For users under 13 who wish to create an account, we require parental guidance and supervision.
                Parents can contact us to request deletion of any account created by their child.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-3">8. Changes to This Policy</h2>
              <p className="text-stone-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of significant changes by
                posting a notice on our website. The "Last updated" date at the top of this page indicates when
                the policy was last revised.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-3">9. Contact Us</h2>
                  <p className="text-blue-800 leading-relaxed">
                    If you have questions about this Privacy Policy or our data practices, please{' '}
                    <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      contact us
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-600 text-white font-medium rounded-lg hover:bg-lime-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                to="/terms"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-lime-700 font-medium rounded-lg border border-lime-300 hover:bg-lime-50 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

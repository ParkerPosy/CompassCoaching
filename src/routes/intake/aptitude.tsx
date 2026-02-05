import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/container'

export const Route = createFileRoute('/intake/aptitude')({
  component: AptitudeAssessmentPage,
  head: () => ({
    meta: [
      {
        title: 'Aptitude Assessment - Compass Coaching',
      },
      {
        name: 'description',
        content: 'Discover your natural aptitudes and interests across various career fields.',
      },
    ],
  }),
})

interface AptitudeData {
  stem: number[]
  arts: number[]
  communication: number[]
  business: number[]
  healthcare: number[]
  trades: number[]
  socialServices: number[]
  law: number[]
}

const aptitudeCategories = [
  {
    key: 'stem' as keyof AptitudeData,
    title: 'STEM (Science, Technology, Engineering, Math)',
    items: [
      'Working with numbers and data',
      'Solving technical problems',
      'Using technology and computers',
      'Conducting experiments or research',
    ],
  },
  {
    key: 'arts' as keyof AptitudeData,
    title: 'Arts & Creative Fields',
    items: [
      'Creating visual art or design',
      'Writing or storytelling',
      'Performing (music, theater, dance)',
      'Working with my hands to create things',
    ],
  },
  {
    key: 'communication' as keyof AptitudeData,
    title: 'Communication & Media',
    items: [
      'Public speaking or presenting',
      'Writing professionally',
      'Marketing or advertising',
      'Journalism or broadcasting',
    ],
  },
  {
    key: 'business' as keyof AptitudeData,
    title: 'Business & Finance',
    items: [
      'Managing projects or teams',
      'Analyzing financial data',
      'Sales or customer relations',
      'Entrepreneurship',
    ],
  },
  {
    key: 'healthcare' as keyof AptitudeData,
    title: 'Healthcare & Medicine',
    items: [
      'Helping people with health concerns',
      'Medical or scientific research',
      'Physical or mental health counseling',
      'Emergency response or crisis intervention',
    ],
  },
  {
    key: 'trades' as keyof AptitudeData,
    title: 'Skilled Trades',
    items: [
      'Building or construction',
      'Mechanical repair and maintenance',
      'Electrical or plumbing work',
      'Working with tools and equipment',
    ],
  },
  {
    key: 'socialServices' as keyof AptitudeData,
    title: 'Social Services & Education',
    items: [
      'Teaching or training others',
      'Social work or counseling',
      'Community organizing',
      'Child or elder care',
    ],
  },
  {
    key: 'law' as keyof AptitudeData,
    title: 'Law, Policy & Public Service',
    items: [
      'Legal research and advocacy',
      'Public policy or government work',
      'Law enforcement or security',
      'Environmental or social justice',
    ],
  },
]

function AptitudeAssessmentPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<AptitudeData>({
    stem: [0, 0, 0, 0],
    arts: [0, 0, 0, 0],
    communication: [0, 0, 0, 0],
    business: [0, 0, 0, 0],
    healthcare: [0, 0, 0, 0],
    trades: [0, 0, 0, 0],
    socialServices: [0, 0, 0, 0],
    law: [0, 0, 0, 0],
  })

  const handleRatingChange = (category: keyof AptitudeData, index: number, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].map((val, i) => (i === index ? rating : val)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('assessment_aptitude', JSON.stringify(formData))
    navigate({ to: '/intake/challenges' })
  }

  const allQuestionsAnswered = Object.values(formData).every((categoryRatings) =>
    categoryRatings.every((rating) => rating > 0)
  )

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="sm">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-600">Section 4 of 5</span>
            <span className="text-sm font-medium text-stone-600">80% Complete</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-lime-600 transition-all duration-500" style={{ width: '80%' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Aptitude & Interests</CardTitle>
              <p className="text-stone-600 mt-2">
                Rate your interest and aptitude in different career fields. Be honest about what genuinely interests
                you, not just what you think you "should" pursue.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {aptitudeCategories.map((category) => (
                <div key={category.key} className="space-y-4">
                  <h3 className="text-lg font-semibold text-stone-800">{category.title}</h3>
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-stone-700">{item}</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(category.key, index, rating)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                                formData[category.key][index] === rating
                                  ? 'bg-lime-600 text-white border-lime-600'
                                  : 'bg-white text-stone-700 border-stone-300 hover:border-lime-600'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>Not interested</span>
                          <span>Very interested</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Link
              to="/intake/values"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Values
            </Link>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                Save Progress
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!allQuestionsAnswered}
                className="inline-flex items-center gap-2"
              >
                Next: Challenges
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Search,
  DollarSign,
  GraduationCap,
  FileText,
  Wrench,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
  head: () => ({
    meta: [
      {
        title: 'Free Career & College Resources - Compass Coaching',
      },
      {
        name: 'description',
        content: 'Access 100+ free resources for college applications, financial aid, career exploration, and life skills. Guides, templates, and tools to help students succeed.',
      },
    ],
  }),
})

function ResourcesPage() {
  const categories = [
    {
      icon: <DollarSign className="w-8 h-8 text-lime-600" />,
      title: 'Financial Aid',
      description: 'Scholarships, loans, grants, and budgeting guides',
      count: 25,
      color: 'bg-green-50 border-green-200',
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-lime-600" />,
      title: 'Education Options',
      description: 'College, trade schools, bootcamps, and online programs',
      count: 30,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: 'Career Exploration',
      description: 'Career paths, salary guides, and industry insights',
      count: 40,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      icon: <FileText className="w-8 h-8 text-lime-600" />,
      title: 'Application Help',
      description: 'Resumes, cover letters, essays, and interview prep',
      count: 20,
      color: 'bg-orange-50 border-orange-200',
    },
    {
      icon: <Clock className="w-8 h-8 text-lime-600" />,
      title: 'Life Skills',
      description: 'Time management, goal setting, and productivity',
      count: 15,
      color: 'bg-pink-50 border-pink-200',
    },
    {
      icon: <Wrench className="w-8 h-8 text-lime-600" />,
      title: 'Tools & Templates',
      description: 'Downloadable templates, calculators, and worksheets',
      count: 18,
      color: 'bg-yellow-50 border-yellow-200',
    },
  ]

  const featuredResources = [
    {
      title: 'Complete FAFSA Guide',
      category: 'Financial Aid',
      type: 'Guide',
      duration: '15 min',
      difficulty: 'Beginner',
      description: 'Step-by-step walkthrough of the FAFSA application process with tips to maximize your aid.',
    },
    {
      title: 'Resume Template Pack',
      category: 'Application Help',
      type: 'Template',
      duration: '5 min',
      difficulty: 'Beginner',
      description: 'Professional resume templates for different career stages and industries.',
    },
    {
      title: 'College vs. Trade School',
      category: 'Education Options',
      type: 'Article',
      duration: '10 min',
      difficulty: 'Beginner',
      description: 'Compare costs, timeline, and outcomes to make an informed decision about your education.',
    },
    {
      title: 'Scholarship Search Strategy',
      category: 'Financial Aid',
      type: 'Guide',
      duration: '20 min',
      difficulty: 'Intermediate',
      description: 'Proven strategies to find and win scholarships that match your profile.',
    },
    {
      title: 'Career Assessment Quiz',
      category: 'Career Exploration',
      type: 'Tool',
      duration: '10 min',
      difficulty: 'Beginner',
      description: 'Quick assessment to identify careers that align with your interests and values.',
    },
    {
      title: 'Time Management Planner',
      category: 'Life Skills',
      type: 'Template',
      duration: '5 min',
      difficulty: 'Beginner',
      description: 'Weekly planner template to balance work, school, and personal goals.',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <BookOpen className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Resource Library
            </h1>
            <p className="text-xl text-stone-600 mb-8">
              Free guides, templates, and tools to support your educational and career journey
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-stone-200 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-colors"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-lime-600">100+</div>
              <div className="text-sm text-stone-600">Free Resources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lime-600">6</div>
              <div className="text-sm text-stone-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-lime-600">100%</div>
              <div className="text-sm text-stone-600">Free Access</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-stone-600">
              Explore resources organized by topic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                variant="outlined"
                className={`${category.color} hover:border-lime-300 transition-all cursor-pointer hover:shadow-md`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white rounded-lg">
                      {category.icon}
                    </div>
                    <Badge variant="default">{category.count} resources</Badge>
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Resources */}
      <section className="py-16 px-6 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-lg text-stone-600">
              Popular guides and tools to get you started
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <Card key={index} variant="outlined" className="hover:border-lime-300 transition-all hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary" size="sm">
                      {resource.category}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {resource.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 mb-4">{resource.description}</p>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      {resource.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Resources
            </Button>
          </div>
        </Container>
      </section>

      {/* How to Use Resources */}
      <section className="py-16 px-6">
        <Container size="sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              How to Use Our Resources
            </h2>
          </div>

          <div className="space-y-6">
            <Card variant="outlined">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-stone-900 font-semibold">
                    1
                  </div>
                  <CardTitle className="text-lg">Browse or Search</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600">
                  Use the search bar or browse categories to find resources relevant to your needs.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-stone-900 font-semibold">
                    2
                  </div>
                  <CardTitle className="text-lg">Save Your Favorites</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600">
                  Create a free account to bookmark resources and track what you've completed.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-stone-900 font-semibold">
                    3
                  </div>
                  <CardTitle className="text-lg">Take Action</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600">
                  Use the templates, follow the guides, and apply what you learn to move forward.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-linear-to-br from-lime-400 to-lime-500">
        <Container size="sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Get Personalized Recommendations
            </h2>
            <p className="text-lg text-stone-800 mb-8">
              Take our career assessment to receive resource recommendations tailored to your goals.
            </p>
            <Button size="lg" variant="secondary">
              Start Assessment
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}

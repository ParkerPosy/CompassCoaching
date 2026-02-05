import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Clock, Download } from 'lucide-react'

export const Route = createFileRoute('/resources/career-exploration')({
  component: CareerExplorationPage,
})

function CareerExplorationPage() {
  const resources = [
    {
      title: 'Career Interest Assessment',
      type: 'Tool',
      duration: '15 min',
      description: 'Discover careers that align with your interests and personality',
    },
    {
      title: 'Industry Overview Guide',
      type: 'Guide',
      duration: '20 min',
      description: 'Comprehensive overview of major industries and career paths',
    },
    {
      title: 'Day in the Life Series',
      type: 'Article',
      duration: '10 min',
      description: 'Real professionals share their daily experiences',
    },
    {
      title: 'Career Path Roadmaps',
      type: 'Template',
      duration: '5 min',
      description: 'Visual guides showing progression in various careers',
    },
    {
      title: 'Job Shadow Checklist',
      type: 'Worksheet',
      duration: '5 min',
      description: 'Prepare for and make the most of job shadowing opportunities',
    },
    {
      title: 'Informational Interview Guide',
      type: 'Guide',
      duration: '15 min',
      description: 'How to conduct informational interviews with professionals',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container size="sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <GraduationCap className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              Career Exploration
            </h1>
            <p className="text-xl text-stone-600">
              Discover careers that match your interests, values, and skills
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 px-6">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} variant="outlined" className="hover:border-lime-300 transition-all hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary" size="sm">
                      {resource.type}
                    </Badge>
                    <Badge variant="default" size="sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {resource.title}
                    <Download className="w-5 h-5 text-stone-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

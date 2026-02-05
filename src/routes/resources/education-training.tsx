import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, Clock, Download } from 'lucide-react'

export const Route = createFileRoute('/resources/education-training')({
  component: EducationTrainingPage,
})

function EducationTrainingPage() {
  const resources = [
    {
      title: 'Education Pathways Guide',
      type: 'Guide',
      duration: '25 min',
      description: 'Compare college, trade schools, bootcamps, and more',
    },
    {
      title: 'Online Learning Platforms',
      type: 'Resource',
      duration: '10 min',
      description: 'Directory of free and paid online courses',
    },
    {
      title: 'Certification Roadmaps',
      type: 'Guide',
      duration: '20 min',
      description: 'Industry certifications by career path',
    },
    {
      title: 'Financial Aid Guide',
      type: 'Guide',
      duration: '30 min',
      description: 'Scholarships, grants, and student loans',
    },
    {
      title: 'Bootcamp Comparison Tool',
      type: 'Worksheet',
      duration: '15 min',
      description: 'Evaluate coding bootcamps and intensive programs',
    },
    {
      title: 'Learning Style Assessment',
      type: 'Tool',
      duration: '10 min',
      description: 'Discover your optimal learning approach',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container size="sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <Book className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              Education & Training
            </h1>
            <p className="text-xl text-stone-600">
              Find programs, certifications, and courses to advance your career
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

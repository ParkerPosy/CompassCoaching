import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Clock, Download } from 'lucide-react'

export const Route = createFileRoute('/resources/salary-negotiation')({
  component: SalaryNegotiationPage,
})

function SalaryNegotiationPage() {
  const resources = [
    {
      title: 'Salary Negotiation Guide',
      type: 'Guide',
      duration: '30 min',
      description: 'Negotiate with confidence and get what you deserve',
    },
    {
      title: 'Salary Research Tools',
      type: 'Resource',
      duration: '15 min',
      description: 'Find market rates for your role and location',
    },
    {
      title: 'Negotiation Script Templates',
      type: 'Template',
      duration: '10 min',
      description: 'What to say in salary discussions',
    },
    {
      title: 'Benefits Comparison Worksheet',
      type: 'Worksheet',
      duration: '10 min',
      description: 'Evaluate total compensation packages',
    },
    {
      title: 'Counter Offer Guide',
      type: 'Article',
      duration: '15 min',
      description: 'When and how to make a counteroffer',
    },
    {
      title: 'Raise Request Template',
      type: 'Template',
      duration: '10 min',
      description: 'Ask for a raise professionally',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container size="sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <DollarSign className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              Salary & Negotiation
            </h1>
            <p className="text-xl text-stone-600">
              Know your worth and negotiate with confidence
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

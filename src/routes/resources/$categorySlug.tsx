import { createFileRoute } from "@tanstack/react-router";
import { Clock, Download } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getResourcesByCategory,
  RESOURCE_CATEGORIES,
  type Resource,
} from "@/data/resources";

export const Route = createFileRoute("/resources/$categorySlug")({
  component: ResourceCategoryPage,
});

function ResourceCategoryPage() {
  const { categorySlug } = Route.useParams();

  // Get category metadata from centralized data
  const category = RESOURCE_CATEGORIES.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-stone-600">
            The resource category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Get resources for this category
  const resources = getResourcesByCategory(category.title);
  const CategoryIcon = category.icon;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="py-16 px-6 bg-linear-to-br from-lime-50 to-stone-100">
        <Container size="sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-6">
              <CategoryIcon className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              {category.title}
            </h1>
            <p className="text-xl text-stone-600">{category.description}</p>
          </div>
        </Container>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-6">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource: Resource) => (
              <Card
                key={resource.title}
                variant="outlined"
                className="hover:border-lime-300 transition-all hover:shadow-md cursor-pointer"
              >
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
                  <p className="text-stone-600">
                    Download and explore this {resource.type.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Compass,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		meta: [
			{
				title: "Compass Coaching - Free Career Assessment & Student Resources",
			},
			{
				name: "description",
				content:
					"Discover your career path with our free assessment. Access 100+ resources for college applications, financial aid, and career exploration. Helping 1000+ students navigate their future.",
			},
		],
	}),
});

function HomePage() {
	const features = [
		{
			icon: <Compass className="w-12 h-12 text-lime-400" />,
			title: "Find Your Direction",
			description:
				"Take our comprehensive assessment to discover career paths that align with your personality, values, and goals.",
		},
		{
			icon: <BookOpen className="w-12 h-12 text-lime-400" />,
			title: "Access Free Resources",
			description:
				"Explore our library of guides, templates, and tools covering everything from financial aid to resume writing.",
		},
		{
			icon: <Target className="w-12 h-12 text-lime-400" />,
			title: "Create Your Plan",
			description:
				"Build a personalized action plan with clear steps to achieve your educational and career goals.",
		},
		{
			icon: <Users className="w-12 h-12 text-lime-400" />,
			title: "Get Expert Guidance",
			description:
				"Connect with experienced career coaches who can provide personalized support and accountability.",
		},
		{
			icon: <TrendingUp className="w-12 h-12 text-lime-400" />,
			title: "Track Your Progress",
			description:
				"Monitor your journey with our dashboard and celebrate milestones as you work toward your future.",
		},
		{
			icon: <BookOpen className="w-12 h-12 text-lime-400" />,
			title: "Explore All Paths",
			description:
				"Whether college, trade school, business, or the arts—we help you evaluate all options equally.",
		},
	];

	const stats = [
		{ value: "1000+", label: "Students Helped" },
		{ value: "50+", label: "Career Paths" },
		{ value: "100+", label: "Free Resources" },
		{ value: "95%", label: "Satisfaction Rate" },
	];

	return (
		<div className="min-h-screen bg-stone-50">
			{/* Hero Section */}
			<section className="relative py-20 md:py-32 px-6 bg-linear-to-br from-stone-100 via-lime-50 to-stone-100">
				<Container>
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold tracking-tight text-stone-900">
							Navigate Your <span className="text-lime-600">Future</span>
						</h1>
						<p className="text-xl md:text-2xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
							Discover your path with personalized career guidance, free
							resources, and expert support—no matter your starting point.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								to="/intake"
								className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-lime-400 text-stone-900 hover:bg-lime-500 focus:ring-lime-400 px-6 py-3 text-lg"
							>
								Get Started
								<ArrowRight className="w-5 h-5" />
							</Link>
							<Link
								to="/resources"
								className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-lime-600 text-lime-700 hover:bg-lime-50 focus:ring-lime-600 px-6 py-3 text-lg"
							>
								Browse Resources
							</Link>
						</div>
					</div>
				</Container>
			</section>

			{/* Stats Section */}
			<section className="py-12 bg-white border-y border-stone-200">
				<Container>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="text-3xl md:text-4xl font-bold text-lime-600 mb-2">
									{stat.value}
								</div>
								<div className="text-sm md:text-base text-stone-600">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</Container>
			</section>

			{/* How It Works */}
			<section className="py-16 md:py-24 px-6">
				<Container>
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
							How Compass Coaching Works
						</h2>
						<p className="text-lg text-stone-600 max-w-2xl mx-auto">
							A simple three-step process to help you discover your direction
							and achieve your goals.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<Card variant="outlined" className="text-center p-8">
							<div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-lime-700">1</span>
							</div>
							<h3 className="text-xl font-semibold text-stone-900 mb-3">
								Discover
							</h3>
							<p className="text-stone-600">
								Complete our assessment to understand your personality, values,
								and career aptitudes.
							</p>
						</Card>

						<Card variant="outlined" className="text-center p-8">
							<div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-lime-700">2</span>
							</div>
							<h3 className="text-xl font-semibold text-stone-900 mb-3">
								Explore
							</h3>
							<p className="text-stone-600">
								Access personalized resources and guidance tailored to your
								unique path and challenges.
							</p>
						</Card>

						<Card variant="outlined" className="text-center p-8">
							<div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl font-bold text-lime-700">3</span>
							</div>
							<h3 className="text-xl font-semibold text-stone-900 mb-3">
								Achieve
							</h3>
							<p className="text-stone-600">
								Take action with your personalized plan and get support from our
								coaches along the way.
							</p>
						</Card>
					</div>
				</Container>
			</section>

			{/* Features Grid */}
			<section className="py-16 md:py-24 px-6 bg-white">
				<Container>
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
							Everything You Need
						</h2>
						<p className="text-lg text-stone-600 max-w-2xl mx-auto">
							Comprehensive tools and resources to support your educational and
							career journey.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature) => (
							<Card
								key={feature.title}
								variant="outlined"
								className="hover:border-lime-300 transition-colors"
							>
								<CardHeader>
									<div className="mb-4">{feature.icon}</div>
									<CardTitle>{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-stone-600 leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</Container>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 bg-linear-to-br from-lime-400 via-lime-500 to-lime-600">
				<Container size="sm">
					<div className="text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
							Ready to Find Your Path?
						</h2>
						<p className="text-lg text-stone-800 mb-8 max-w-xl mx-auto">
							Start your journey today with our free career assessment. No
							credit card required.
						</p>
						<Link
							to="/intake"
							className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-900 text-lime-400 hover:bg-stone-800 focus:ring-stone-900 px-6 py-3 text-lg"
						>
							Start Your Assessment
							<ArrowRight className="w-5 h-5" />
						</Link>
					</div>
				</Container>
			</section>
		</div>
	);
}

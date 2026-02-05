import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/contact")({
	component: ContactPage,
	head: () => ({
		meta: [
			{
				title: "Contact Us - Compass Coaching",
			},
			{
				name: "description",
				content:
					"Have questions about career coaching or our free resources? Contact Compass Coaching for guidance and support. We're here to help you navigate your future.",
			},
		],
	}),
});

function ContactPage() {
	return (
		<div className="min-h-screen bg-stone-50">
			{/* Hero Section */}
			<section className="relative py-16 md:py-24 px-6 bg-linear-to-br from-lime-50 to-stone-100">
				<Container>
					<div className="text-center max-w-3xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
							Get in Touch
						</h1>
						<p className="text-xl text-stone-700">
							Have questions about Compass Coaching? We're here to help guide
							you on your journey.
						</p>
					</div>
				</Container>
			</section>

			{/* Contact Info */}
			<section className="py-16 px-6">
				<Container>
					<div className="grid md:grid-cols-3 gap-6 mb-12">
						<Card variant="outlined">
							<CardHeader>
								<div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
									<Mail className="w-6 h-6 text-stone-900" />
								</div>
								<CardTitle>Email Us</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-stone-600">Send us a message anytime</p>
								<a
									href="mailto:hello@compasscoaching.org"
									className="text-lime-600 hover:text-lime-700 font-medium mt-2 inline-block"
								>
									hello@compasscoaching.org
								</a>
							</CardContent>
						</Card>

						<Card variant="outlined">
							<CardHeader>
								<div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
									<Phone className="w-6 h-6 text-stone-900" />
								</div>
								<CardTitle>Call Us</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-stone-600">Mon-Fri 9am-5pm EST</p>
								<a
									href="tel:+15555551234"
									className="text-lime-600 hover:text-lime-700 font-medium mt-2 inline-block"
								>
									(555) 555-1234
								</a>
							</CardContent>
						</Card>

						<Card variant="outlined">
							<CardHeader>
								<div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
									<MapPin className="w-6 h-6 text-stone-900" />
								</div>
								<CardTitle>Visit Us</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-stone-600">
									123 Career Path Lane
									<br />
									Success City, ST 12345
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Contact Form */}
					<Card className="max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle className="text-2xl">Send us a message</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent outline-none transition-all"
										placeholder="Your name"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent outline-none transition-all"
										placeholder="your.email@example.com"
									/>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Subject
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent outline-none transition-all"
										placeholder="How can we help?"
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Message
									</label>
									<textarea
										id="message"
										name="message"
										rows={6}
										className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent outline-none transition-all resize-none"
										placeholder="Tell us what you're thinking..."
									/>
								</div>

								<button
									type="submit"
									className="w-full bg-lime-400 text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-lime-500 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2"
								>
									Send Message
								</button>
							</form>
						</CardContent>
					</Card>
				</Container>
			</section>
		</div>
	);
}

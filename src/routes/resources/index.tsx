import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { BookOpen, Search, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import {
	ALL_RESOURCES,
	RESOURCE_CATEGORIES,
	getResourceCountByCategory,
	getCategoryPath,
} from "@/data/resources";

export const Route = createFileRoute("/resources/")({
	component: ResourcesIndexPage,
});

function ResourcesIndexPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredResources = useMemo(() => {
		if (!searchQuery.trim()) return [];

		const query = searchQuery.toLowerCase();
		return ALL_RESOURCES.filter(
			(resource) =>
				resource.title.toLowerCase().includes(query) ||
				resource.category.toLowerCase().includes(query) ||
				resource.type.toLowerCase().includes(query),
		).slice(0, 8); // Limit to 8 results
	}, [searchQuery]);

	const handleResourceClick = (category: string) => {
		const path = getCategoryPath(category);
		navigate({ to: path });
		setSearchQuery("");
		setShowDropdown(false);
	};

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
							Free guides, templates, and tools to support your career journey
						</p>

						{/* Search Bar with Dropdown */}
						<div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 z-10" />
							<input
								type="text"
								placeholder="Search all resources..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setShowDropdown(true);
								}}
								onFocus={() => searchQuery && setShowDropdown(true)}
								className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-stone-200 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-colors"
							/>

							{/* Dropdown Results */}
							{showDropdown && searchQuery && (
								<div className="absolute top-full left-0 right-0 bg-white border-2 border-stone-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
									{filteredResources.length > 0 ? (
										<div className="py-2">
											{filteredResources.map((resource, index) => (
												<button
													key={index}
													onClick={() => handleResourceClick(resource.category)}
													className="w-full px-4 py-3 hover:bg-lime-50 transition-colors text-left border-b border-stone-100 last:border-b-0"
												>
													<div className="flex items-start justify-between gap-3">
														<div className="flex-1">
															<div className="font-medium text-stone-900 mb-1">
																{resource.title}
															</div>
															<div className="flex items-center gap-2 text-sm text-stone-600">
																<span className="text-lime-600">
																	{resource.category}
																</span>
																<span>•</span>
																<span>{resource.type}</span>
																<span>•</span>
																<span className="flex items-center gap-1">
																	<Clock className="w-3 h-3" />
																	{resource.duration}
																</span>
															</div>
														</div>
														<ArrowRight className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
													</div>
												</button>
											))}
										</div>
									) : (
										<div className="px-4 py-8 text-center text-stone-600">
											<Search className="w-12 h-12 text-stone-300 mx-auto mb-2" />
											<p>No resources found</p>
											<p className="text-sm">Try a different search term</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Quick Stats */}
					<div className="flex flex-wrap justify-center gap-6 text-center">
						<div>
							<div className="text-3xl font-bold text-lime-600">
								{ALL_RESOURCES.length}+
							</div>
							<div className="text-sm text-stone-600">Free Resources</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-lime-600">
								{RESOURCE_CATEGORIES.length}
							</div>
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
						{RESOURCE_CATEGORIES.map((category, index) => {
							const Icon = category.icon;
							const count = getResourceCountByCategory(category.title);
							return (
								<Link key={index} to={category.path}>
									<Card
										variant="outlined"
										className="hover:border-lime-300 transition-all cursor-pointer hover:shadow-md h-full"
									>
										<CardHeader>
											<div className="flex items-start justify-between mb-4">
												<div className="p-3 bg-lime-50 rounded-lg">
													<Icon className="w-8 h-8 text-lime-600" />
												</div>
												<Badge variant="default">{count}</Badge>
											</div>
											<CardTitle className="flex items-center justify-between">
												{category.title}
												<ArrowRight className="w-5 h-5 text-stone-400" />
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-stone-600">{category.description}</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
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
							Take our career assessment to receive resource recommendations
							tailored to your goals
						</p>
						<Link to="/intake">
							<Button size="lg" variant="secondary">
								Start Assessment
							</Button>
						</Link>
					</div>
				</Container>
			</section>
		</div>
	);
}

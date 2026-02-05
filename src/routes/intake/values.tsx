import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export const Route = createFileRoute("/intake/values")({
	component: ValuesPage,
	head: () => ({
		meta: [
			{
				title: "Values Assessment - Compass Coaching",
			},
		],
	}),
});

interface ValueRating {
	[key: string]: number;
}

const values = [
	{
		id: "work_life_balance",
		label: "Work-Life Balance",
		description: "Having time for personal life, hobbies, and family",
	},
	{
		id: "income_potential",
		label: "High Income Potential",
		description: "Earning a substantial salary and financial security",
	},
	{
		id: "helping_others",
		label: "Helping Others",
		description: "Making a positive impact on people's lives",
	},
	{
		id: "creativity",
		label: "Creativity & Innovation",
		description: "Expressing creativity and developing new ideas",
	},
	{
		id: "job_security",
		label: "Job Security & Stability",
		description: "Having a stable, predictable career path",
	},
	{
		id: "independence",
		label: "Independence & Autonomy",
		description: "Working independently with minimal supervision",
	},
	{
		id: "leadership",
		label: "Leadership Opportunities",
		description: "Leading teams and influencing decisions",
	},
	{
		id: "learning_growth",
		label: "Learning & Growth",
		description: "Continuous learning and professional development",
	},
	{
		id: "recognition",
		label: "Recognition & Status",
		description: "Being recognized for achievements and expertise",
	},
	{
		id: "physical_activity",
		label: "Physical Activity",
		description: "Staying active and moving throughout the day",
	},
	{
		id: "environmental_impact",
		label: "Environmental Impact",
		description: "Contributing to sustainability and protecting nature",
	},
	{
		id: "variety",
		label: "Work Variety",
		description: "Diverse tasks and new challenges regularly",
	},
];

function ValuesPage() {
	const navigate = useNavigate();
	const [ratings, setRatings] = useState<ValueRating>({});

	// Rehydrate form from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("assessment_values");
		if (saved) {
			try {
				setRatings(JSON.parse(saved));
			} catch (error) {
				console.error("Failed to parse saved data:", error);
			}
		}
	}, []);

	const handleRating = (valueId: string, rating: number) => {
		setRatings((prev) => ({ ...prev, [valueId]: rating }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		localStorage.setItem("assessment_values", JSON.stringify(ratings));
		navigate({ to: "/intake/aptitude" });
	};

	const progress = (Object.keys(ratings).length / values.length) * 100;
	const isComplete = Object.keys(ratings).length === values.length;

	return (
		<div className="min-h-screen bg-stone-50 py-12 px-6">
			<Container size="sm">
				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-stone-600">
							Section 3 of 5
						</span>
						<span className="text-sm font-medium text-stone-600">
							60% Complete
						</span>
					</div>
					<div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-lime-600 transition-all duration-500"
							style={{ width: "60%" }}
						/>
					</div>
					<div className="mt-2 text-sm text-stone-600">
						{Object.keys(ratings).length} of {values.length} values rated
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<Card className="mb-6">
						<CardHeader>
							<CardTitle className="text-2xl">Your Core Values</CardTitle>
							<p className="text-stone-600 mt-2">
								Rate how important each value is to you in your ideal career. Be
								honest - there are no right answers!
							</p>
							<div className="mt-4 flex items-center gap-2 text-sm">
								<span className="text-stone-500">Scale:</span>
								<span className="text-stone-700 font-medium">
									1 = Not Important
								</span>
								<span className="text-stone-400">→</span>
								<span className="text-stone-700 font-medium">
									5 = Extremely Important
								</span>
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							{values.map((value) => (
								<div
									key={value.id}
									className="pb-6 border-b border-stone-200 last:border-0 last:pb-0"
								>
									<div className="mb-3">
										<h3 className="text-lg font-semibold text-stone-900">
											{value.label}
										</h3>
										<p className="text-sm text-stone-600">
											{value.description}
										</p>
									</div>

									<div className="flex items-center gap-3">
										{[1, 2, 3, 4, 5].map((rating) => (
											<button
												key={rating}
												type="button"
												onClick={() => handleRating(value.id, rating)}
												className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
													ratings[value.id] === rating
														? "border-lime-600 bg-lime-600 text-white"
														: "border-stone-200 text-stone-600 hover:border-lime-300 hover:bg-lime-50"
												}`}
											>
												{rating}
											</button>
										))}
									</div>

									{ratings[value.id] && (
										<div className="mt-2 text-sm text-stone-600">
											Selected:{" "}
											<span className="font-medium text-lime-700">
												{ratings[value.id] === 1 && "Not Important"}
												{ratings[value.id] === 2 && "Somewhat Important"}
												{ratings[value.id] === 3 && "Moderately Important"}
												{ratings[value.id] === 4 && "Very Important"}
												{ratings[value.id] === 5 && "Extremely Important"}
											</span>
										</div>
									)}
								</div>
							))}
						</CardContent>
					</Card>

					{/* Section Progress */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-stone-600">
								Section Progress
							</span>
							<span className="text-sm font-medium text-lime-700">
								{Math.round(progress)}%
							</span>
						</div>
						<div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-lime-600 transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>

					{/* Navigation */}
					<div className="flex items-center justify-between">
						<Link
							to="/intake/personality"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
						>
							<ArrowLeft className="w-5 h-5" />
							Previous
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
								disabled={!isComplete}
								className="inline-flex items-center gap-2"
							>
								Next: Aptitude
								<ArrowRight className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</form>
			</Container>
		</div>
	);
}

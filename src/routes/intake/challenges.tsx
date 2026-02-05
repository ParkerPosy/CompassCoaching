import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/storage";

export const Route = createFileRoute("/intake/challenges")({
	component: ChallengesPage,
	head: () => ({
		meta: [
			{
				title: "Challenges & Constraints - Compass Coaching",
			},
		],
	}),
});

interface ChallengesData {
	financial: string;
	timeAvailability: string;
	locationFlexibility: string;
	familyObligations: string;
	transportation: string;
	healthConsiderations: string;
	educationGaps: string[];
	supportSystem: string;
	additionalNotes: string;
}

function ChallengesPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<ChallengesData>({
		financial: "",
		timeAvailability: "",
		locationFlexibility: "",
		familyObligations: "",
		transportation: "",
		healthConsiderations: "",
		educationGaps: [],
		supportSystem: "",
		additionalNotes: "",
	});

	// Rehydrate form from localStorage on mount
	useEffect(() => {
		const saved = storage.get<ChallengesData>("assessment_challenges");
		if (saved) {
			setFormData(saved);
		}
	}, []);

	const handleChange = (
		field: keyof ChallengesData,
		value: string | string[],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleCheckboxChange = (
		field: keyof ChallengesData,
		value: string,
		checked: boolean,
	) => {
		const current = formData[field] as string[];
		if (checked) {
			handleChange(field, [...current, value]);
		} else {
			handleChange(
				field,
				current.filter((v) => v !== value),
			);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		storage.save("assessment_challenges", formData);
		navigate({ to: "/intake/review" });
	};

	const requiredFields = [
		"financial",
		"timeAvailability",
		"locationFlexibility",
		"supportSystem",
	];
	const filledRequired = requiredFields.filter(
		(field) => formData[field as keyof ChallengesData],
	);
	const isValid = filledRequired.length === requiredFields.length;

	return (
		<div className="min-h-screen bg-stone-50 py-12 px-6">
			<Container size="sm">
				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-stone-600">
							Section 5 of 5
						</span>
						<span className="text-sm font-medium text-lime-700">
							Final Section!
						</span>
					</div>
					<div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-lime-600 transition-all duration-500"
							style={{ width: "90%" }}
						/>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<Card className="mb-6">
						<CardHeader>
							<CardTitle className="text-2xl">
								Challenges & Constraints
							</CardTitle>
							<p className="text-stone-600 mt-2">
								Understanding your constraints helps us provide realistic
								recommendations. All information is confidential.
							</p>
						</CardHeader>

						<CardContent className="space-y-6">
							{/* Financial Situation */}
							<div>
								<label
									htmlFor="financial"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your current financial situation for
									education/training? <span className="text-error-500">*</span>
								</label>
								<select
									id="financial"
									value={formData.financial}
									onChange={(e) => handleChange("financial", e.target.value)}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select option</option>
									<option value="no-constraints">
										No major financial constraints
									</option>
									<option value="some-savings">Some savings available</option>
									<option value="need-financial-aid">
										Will need financial aid/loans
									</option>
									<option value="limited-funds">
										Very limited funds available
									</option>
									<option value="working-while-learning">
										Must work while learning
									</option>
								</select>
							</div>

							{/* Time Availability */}
							<div>
								<label
									htmlFor="timeAvailability"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									How much time can you dedicate to training/education?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="timeAvailability"
									value={formData.timeAvailability}
									onChange={(e) =>
										handleChange("timeAvailability", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select option</option>
									<option value="full-time">Full-time (40+ hours/week)</option>
									<option value="part-time">
										Part-time (20-40 hours/week)
									</option>
									<option value="evenings-weekends">
										Evenings and weekends only
									</option>
									<option value="very-limited">
										Very limited (under 10 hours/week)
									</option>
									<option value="flexible">Flexible schedule</option>
								</select>
							</div>

							{/* Location Flexibility */}
							<div>
								<label
									htmlFor="locationFlexibility"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Are you able to relocate for work or education?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="locationFlexibility"
									value={formData.locationFlexibility}
									onChange={(e) =>
										handleChange("locationFlexibility", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select option</option>
									<option value="yes-anywhere">
										Yes, willing to relocate anywhere
									</option>
									<option value="same-region">
										Yes, within same region/state
									</option>
									<option value="local-only">Must stay in current area</option>
									<option value="remote-preferred">
										Prefer remote opportunities
									</option>
								</select>
							</div>

							{/* Family Obligations */}
							<div>
								<label
									htmlFor="familyObligations"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Do you have significant family or caregiving responsibilities?
								</label>
								<select
									id="familyObligations"
									value={formData.familyObligations}
									onChange={(e) =>
										handleChange("familyObligations", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
								>
									<option value="">Select option</option>
									<option value="none">No significant obligations</option>
									<option value="childcare">Childcare responsibilities</option>
									<option value="elder-care">
										Elder care responsibilities
									</option>
									<option value="both">Both childcare and elder care</option>
									<option value="other">Other family obligations</option>
								</select>
							</div>

							{/* Transportation */}
							<div>
								<label
									htmlFor="transportation"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your transportation situation?
								</label>
								<select
									id="transportation"
									value={formData.transportation}
									onChange={(e) =>
										handleChange("transportation", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
								>
									<option value="">Select option</option>
									<option value="own-vehicle">Own reliable vehicle</option>
									<option value="public-transit">
										Rely on public transportation
									</option>
									<option value="limited">
										Limited transportation options
									</option>
									<option value="none">No reliable transportation</option>
								</select>
							</div>

							{/* Health Considerations */}
							<div>
								<label
									htmlFor="healthConsiderations"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Are there any health considerations that might affect career
									choices?
								</label>
								<select
									id="healthConsiderations"
									value={formData.healthConsiderations}
									onChange={(e) =>
										handleChange("healthConsiderations", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
								>
									<option value="">Select option</option>
									<option value="none">No limitations</option>
									<option value="physical">Physical limitations</option>
									<option value="mental-health">
										Mental health considerations
									</option>
									<option value="chronic-condition">
										Chronic health condition
									</option>
									<option value="prefer-not-say">Prefer not to say</option>
								</select>
							</div>

							{/* Education Gaps */}
							<div>
								<label className="block text-sm font-medium text-stone-700 mb-3">
									Which areas might you need additional preparation in? (Select
									all that apply)
								</label>
								<div className="space-y-2">
									{[
										"Basic computer skills",
										"Math fundamentals",
										"Reading/writing skills",
										"English language proficiency",
										"Study skills and time management",
										"Test-taking strategies",
										"Professional communication",
										"None of the above",
									].map((gap) => (
										<label
											key={gap}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50"
										>
											<input
												type="checkbox"
												checked={formData.educationGaps.includes(gap)}
												onChange={(e) =>
													handleCheckboxChange(
														"educationGaps",
														gap,
														e.target.checked,
													)
												}
												className="w-5 h-5 text-lime-600 rounded focus:ring-lime-600 focus:ring-offset-0"
											/>
											<span className="text-stone-700">{gap}</span>
										</label>
									))}
								</div>
							</div>

							{/* Support System */}
							<div>
								<label
									htmlFor="supportSystem"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									How would you describe your support system?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="supportSystem"
									value={formData.supportSystem}
									onChange={(e) =>
										handleChange("supportSystem", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select option</option>
									<option value="strong">Strong family/friend support</option>
									<option value="some">Some support available</option>
									<option value="limited">Limited support</option>
									<option value="independent">Mostly independent</option>
								</select>
							</div>

							{/* Additional Notes */}
							<div>
								<label
									htmlFor="additionalNotes"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Any other challenges or considerations we should know about?
								</label>
								<textarea
									id="additionalNotes"
									value={formData.additionalNotes}
									onChange={(e) =>
										handleChange("additionalNotes", e.target.value)
									}
									rows={4}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all resize-none"
									placeholder="Share anything else that might help us provide better recommendations..."
								/>
							</div>
						</CardContent>
					</Card>

					{/* Almost Done Message */}
					<div className="mb-6 p-6 bg-lime-50 border-2 border-lime-200 rounded-lg">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="w-6 h-6 text-lime-600 mt-1 shrink-0" />
							<div>
								<h3 className="font-semibold text-lime-900 mb-1">
									Almost done!
								</h3>
								<p className="text-lime-800">
									You're on the final section. After submitting, you'll be able
									to review all your answers before getting your personalized
									results.
								</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<div className="flex items-center justify-between">
						<Link
							to="/intake/aptitude"
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
								disabled={!isValid}
								className="inline-flex items-center gap-2"
							>
								Review Answers
								<ArrowRight className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</form>
			</Container>
		</div>
	);
}

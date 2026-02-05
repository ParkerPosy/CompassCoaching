import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigationButtons } from "@/components/assessment/NavigationButtons";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { storage } from "@/lib/storage";

export const Route = createFileRoute("/intake/basic")({
	component: BasicInfoPage,
	head: () => ({
		meta: [
			{
				title: "Basic Information - Compass Coaching Assessment",
			},
			{
				name: "description",
				content:
					"Start your career assessment journey with basic information about yourself.",
			},
		],
	}),
});

interface BasicFormData {
	name: string;
	ageRange: string;
	educationLevel: string;
	employmentStatus: string;
	primaryReason: string;
}

function BasicInfoPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<BasicFormData>({
		name: "",
		ageRange: "",
		educationLevel: "",
		employmentStatus: "",
		primaryReason: "",
	});

	// Rehydrate form from localStorage on mount
	useEffect(() => {
		const saved = storage.get<BasicFormData>("assessment_basic");
		if (saved) {
			setFormData(saved);
		}
	}, []);

	const handleChange = (field: keyof BasicFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		storage.save("assessment_basic", formData);
		navigate({ to: "/intake/personality" });
	};

	const isValid =
		formData.name &&
		formData.ageRange &&
		formData.educationLevel &&
		formData.employmentStatus;

	return (
		<div className="min-h-screen bg-stone-50 py-12 px-6">
			<Container size="sm">
				<SectionHeader
					icon={User}
					title="Basic Information"
					subtitle="Let's start with some basic information about you."
					estimatedTime="2 minutes"
				/>

				<form onSubmit={handleSubmit}>
					<Card>
						<CardContent className="space-y-6">
							{/* Name */}
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your name? <span className="text-error-500">*</span>
								</label>
								<input
									type="text"
									id="name"
									value={formData.name}
									onChange={(e) => handleChange("name", e.target.value)}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all"
									placeholder="Your full name"
									required
								/>
							</div>

							{/* Age Range */}
							<div>
								<label
									htmlFor="ageRange"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your age range?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="ageRange"
									value={formData.ageRange}
									onChange={(e) => handleChange("ageRange", e.target.value)}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select your age range</option>
									<option value="under-18">Under 18</option>
									<option value="18-24">18-24</option>
									<option value="25-34">25-34</option>
									<option value="35-44">35-44</option>
									<option value="45-54">45-54</option>
									<option value="55-plus">55+</option>
								</select>
							</div>

							{/* Education Level */}
							<div>
								<label
									htmlFor="educationLevel"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your current education level?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="educationLevel"
									value={formData.educationLevel}
									onChange={(e) =>
										handleChange("educationLevel", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select your education level</option>
									<option value="high-school">Currently in High School</option>
									<option value="hs-graduate">High School Graduate</option>
									<option value="some-college">Some College</option>
									<option value="associates">Associate's Degree</option>
									<option value="bachelors">Bachelor's Degree</option>
									<option value="masters">Master's Degree or Higher</option>
									<option value="trade-cert">Trade School/Certification</option>
								</select>
							</div>

							{/* Employment Status */}
							<div>
								<label
									htmlFor="employmentStatus"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your current employment status?{" "}
									<span className="text-error-500">*</span>
								</label>
								<select
									id="employmentStatus"
									value={formData.employmentStatus}
									onChange={(e) =>
										handleChange("employmentStatus", e.target.value)
									}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all bg-white"
									required
								>
									<option value="">Select your employment status</option>
									<option value="student">Full-time Student</option>
									<option value="employed-ft">Employed Full-time</option>
									<option value="employed-pt">Employed Part-time</option>
									<option value="unemployed">Unemployed</option>
									<option value="self-employed">Self-employed</option>
									<option value="retired">Retired</option>
									<option value="other">Other</option>
								</select>
							</div>

							{/* Primary Reason */}
							<div>
								<label
									htmlFor="primaryReason"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What brings you to Compass Coaching? (Optional)
								</label>
								<textarea
									id="primaryReason"
									value={formData.primaryReason}
									onChange={(e) =>
										handleChange("primaryReason", e.target.value)
									}
									rows={4}
									className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-600/20 transition-all resize-none"
									placeholder="Tell us about your goals, challenges, or what you hope to gain from this assessment..."
								/>
								<p className="text-sm text-stone-500 mt-1">
									This helps us provide more personalized recommendations.
								</p>
							</div>
						</CardContent>
					</Card>

					<NavigationButtons
						backTo="/intake"
						backLabel="Back to Overview"
						nextLabel="Next: Personality"
						nextDisabled={!isValid}
						showSave
						onSave={() => {
							storage.save("assessment_basic", formData);
							alert("Progress saved!");
						}}
					/>
				</form>
			</Container>
		</div>
	);
}

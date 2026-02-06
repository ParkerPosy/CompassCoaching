import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigationButtons } from "@/components/assessment/NavigationButtons";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { Container } from "@/components/layout/container";
import {
	Card,
	CardContent,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@/components/ui";
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
	const [renderKey, setRenderKey] = useState(0);
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
			setRenderKey(prev => prev + 1);
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
						<CardContent className="space-y-6 pt-6">
							{/* Name */}
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									What's your name? <span className="text-error-500">*</span>
								</label>
							<Input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
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
								<Select
									key={`ageRange-${renderKey}`}
									value={formData.ageRange}
									onValueChange={(value) => handleChange("ageRange", value)}
								>
									<SelectTrigger id="ageRange">
										<SelectValue placeholder="Select your age range" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="under-18">Under 18</SelectItem>
										<SelectItem value="18-24">18-24</SelectItem>
										<SelectItem value="25-34">25-34</SelectItem>
										<SelectItem value="35-44">35-44</SelectItem>
										<SelectItem value="45-54">45-54</SelectItem>
										<SelectItem value="55-plus">55+</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Education Level */}
							<div>
						<label
							htmlFor="educationLevel"
							className="block text-sm font-medium text-stone-700 mb-2"
						>
							What's your education level?{" "}
							<span className="text-error-500">*</span>
						</label>
						<Select
							key={`educationLevel-${renderKey}`}
							value={formData.educationLevel}
							onValueChange={(value) => handleChange("educationLevel", value)}
						>
							<SelectTrigger id="educationLevel">
								<SelectValue placeholder="Select your education level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="high-school">
									Currently in High School
								</SelectItem>
								<SelectItem value="hs-graduate">
									High School Graduate
								</SelectItem>
								<SelectItem value="some-college">Some College</SelectItem>
								<SelectItem value="associates">Associate's Degree</SelectItem>
								<SelectItem value="bachelors">Bachelor's Degree</SelectItem>
								<SelectItem value="masters">
									Master's Degree or Higher
								</SelectItem>
								<SelectItem value="trade-cert">
									Trade School/Certification
								</SelectItem>
							</SelectContent>
						</Select>
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
								<Select
									key={`employmentStatus-${renderKey}`}
									value={formData.employmentStatus}
									onValueChange={(value) =>
										handleChange("employmentStatus", value)
									}
								>
									<SelectTrigger id="employmentStatus">
										<SelectValue placeholder="Select your employment status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="student">Full-time Student</SelectItem>
										<SelectItem value="employed-ft">Employed Full-time</SelectItem>
										<SelectItem value="employed-pt">Employed Part-time</SelectItem>
										<SelectItem value="unemployed">Unemployed</SelectItem>
										<SelectItem value="self-employed">Self-employed</SelectItem>
										<SelectItem value="retired">Retired</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Primary Reason */}
							<div>
					<label
						htmlFor="primaryReason"
						className="block text-sm font-medium text-stone-700 mb-2"
					>
						What brings you to Compass Coaching? (Optional)
					</label>
				<Textarea
					id="primaryReason"
					value={formData.primaryReason}
					onChange={(e) =>
						handleChange("primaryReason", e.target.value)
					}
					rows={4}
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

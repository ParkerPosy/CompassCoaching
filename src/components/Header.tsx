import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
	Home,
	Menu,
	X,
	Compass,
	BookOpen,
	Mail,
	BarChart3,
	User,
	Brain,
	Heart,
	Target,
	AlertCircle,
	CheckCircle2,
	Circle,
	ChevronDown,
	ChevronRight,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { RESOURCE_CATEGORIES } from "@/data/resources";

interface AssessmentProgress {
	basic: boolean;
	personality: boolean;
	values: boolean;
	aptitude: boolean;
	challenges: boolean;
	nextSection: string;
}

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [showAssessmentMenu, setShowAssessmentMenu] = useState(false);
	const [showResourcesMenu, setShowResourcesMenu] = useState(false);
	const [progress, setProgress] = useState<AssessmentProgress>({
		basic: false,
		personality: false,
		values: false,
		aptitude: false,
		challenges: false,
		nextSection: "/intake/basic",
	});
	const navigate = useNavigate();

	useEffect(() => {
		// Check which sections are completed
		const basic = !!storage.get("assessment_basic");
		const personality = !!storage.get("assessment_personality");
		const values = !!storage.get("assessment_values");
		const aptitude = !!storage.get("assessment_aptitude");
		const challenges = !!storage.get("assessment_challenges");

		// Determine next section
		let nextSection = "/intake/basic";
		if (!basic) nextSection = "/intake/basic";
		else if (!personality) nextSection = "/intake/personality";
		else if (!values) nextSection = "/intake/values";
		else if (!aptitude) nextSection = "/intake/aptitude";
		else if (!challenges) nextSection = "/intake/challenges";
		else nextSection = "/intake/review";

		setProgress({
			basic,
			personality,
			values,
			aptitude,
			challenges,
			nextSection,
		});
	}, [isOpen]); // Re-check when menu opens

	const handleContinueAssessment = () => {
		navigate({ to: progress.nextSection });
		setIsOpen(false);
	};

	const assessmentSections = [
		{
			id: "basic",
			label: "Basic Information",
			icon: User,
			path: "/intake/basic",
			completed: progress.basic,
		},
		{
			id: "personality",
			label: "Personality",
			icon: Brain,
			path: "/intake/personality",
			completed: progress.personality,
		},
		{
			id: "values",
			label: "Values",
			icon: Heart,
			path: "/intake/values",
			completed: progress.values,
		},
		{
			id: "aptitude",
			label: "Career Aptitude",
			icon: Target,
			path: "/intake/aptitude",
			completed: progress.aptitude,
		},
		{
			id: "challenges",
			label: "Challenges",
			icon: AlertCircle,
			path: "/intake/challenges",
			completed: progress.challenges,
		},
	];

	const completedCount = assessmentSections.filter((s) => s.completed).length;
	const totalCount = assessmentSections.length;

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
				<div className="flex items-center gap-6">
					<button
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} className="text-stone-700" />
					</button>

					<h1 className="text-2xl font-bold flex items-center">
						<Link to="/" className="flex items-center gap-1.5 group">
							<Compass className="w-7 h-7 text-lime-600 group-hover:rotate-12 transition-transform" />
							<div className="flex gap-1.5">
								<span className="bg-linear-to-r from-lime-600 to-lime-500 bg-clip-text text-transparent">
									Compass
								</span>
								<span className="text-stone-900">Coaching</span>
							</div>
						</Link>
					</h1>
				</div>

				<Link
					to="/contact"
					className="px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors font-medium flex items-center gap-2 text-stone-700"
					activeProps={{
						className:
							"px-4 py-2 rounded-lg bg-lime-100 text-lime-700 transition-colors font-medium flex items-center gap-2",
					}}
				>
					<Mail size={20} className="hidden sm:block" />
					<span>Contact</span>
				</Link>
			</header>

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-stone-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "shadow-2xl translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-stone-200">
					<h2 className="text-xl font-bold text-stone-900">Navigation</h2>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} className="text-stone-700" />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					{/* Main Navigation */}
					<div className="mb-6">
						<Link
							to="/"
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
							activeProps={{
								className:
									"flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
							}}
						>
							<Home size={20} />
							<span>Home</span>
						</Link>

						{/* Resources with Submenu */}
						<div className="mb-1">
							<button
								onClick={() => setShowResourcesMenu(!showResourcesMenu)}
								className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-stone-50 transition-colors text-stone-700"
							>
								<div className="flex items-center gap-3">
									<BookOpen size={20} />
									<span>Resources</span>
								</div>
								{showResourcesMenu ? (
									<ChevronDown size={18} />
								) : (
									<ChevronRight size={18} />
								)}
							</button>

							{showResourcesMenu && (
								<div className="ml-3 mt-1 space-y-1 border-l-2 border-stone-200 pl-3">
									<Link
										to="/resources"
										onClick={() => setIsOpen(false)}
										className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
										activeProps={{
											className:
												"flex items-center gap-2 p-2 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
										}}
									>
										<BookOpen size={16} />
										<span>All Resources</span>
									</Link>

									{RESOURCE_CATEGORIES.map((category) => {
										const Icon = category.icon;
										return (
											<Link
												key={category.slug}
												to={category.path}
												onClick={() => setIsOpen(false)}
												className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
												activeProps={{
													className:
														"flex items-center gap-2 p-2 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
												}}
											>
												<Icon size={16} className="shrink-0" />
												<span className="line-clamp-1">{category.title}</span>
											</Link>
										);
									})}
								</div>
							)}
						</div>

						<Link
							to="/intake/results"
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
							activeProps={{
								className:
									"flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
							}}
						>
							<BarChart3 size={20} />
							<span>My Results</span>
						</Link>
					</div>

					{/* Assessment Section */}
					<div className="border-t border-stone-200 pt-4">
						<button
							onClick={() => setShowAssessmentMenu(!showAssessmentMenu)}
							className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2 text-stone-900 font-medium"
						>
							<div className="flex items-center gap-3">
								<Compass size={20} />
								<span>Career Assessment</span>
							</div>
							{showAssessmentMenu ? (
								<ChevronDown size={18} />
							) : (
								<ChevronRight size={18} />
							)}
						</button>

						{/* Progress Bar */}
						<div className="px-3 mb-3">
							<div className="flex items-center justify-between text-xs text-stone-600 mb-1">
								<span>Progress</span>
								<span>
									{completedCount}/{totalCount}
								</span>
							</div>
							<div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-lime-500 transition-all duration-500 rounded-full"
									style={{ width: `${(completedCount / totalCount) * 100}%` }}
								/>
							</div>
						</div>

						{/* Continue Assessment Button */}
						{completedCount < totalCount && (
							<button
								onClick={handleContinueAssessment}
								className="w-full mb-3 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
							>
								<Compass size={18} />
								Continue Assessment
							</button>
						)}

						{/* Assessment Sections */}
						{showAssessmentMenu && (
							<div className="space-y-1 pl-3">
								{assessmentSections.map((section) => {
									const Icon = section.icon;
									return (
										<Link
											key={section.id}
											to={section.path}
											onClick={() => setIsOpen(false)}
											className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
											activeProps={{
												className:
													"flex items-center gap-3 p-2.5 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
											}}
										>
											<Icon size={16} />
											<span className="flex-1">{section.label}</span>
											{section.completed ? (
												<CheckCircle2 size={16} className="text-lime-600" />
											) : (
												<Circle size={16} className="text-stone-300" />
											)}
										</Link>
									);
								})}
							</div>
						)}
					</div>
				</nav>

				{/* Footer */}
				<div className="p-4 border-t border-stone-200 bg-stone-50">
					<p className="text-xs text-stone-600 text-center">
						Navigate Your Future with Confidence
					</p>
				</div>
			</aside>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/20 z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}

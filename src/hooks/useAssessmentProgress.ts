import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export interface AssessmentProgress {
	basic: boolean;
	personality: boolean;
	values: boolean;
	aptitude: boolean;
	challenges: boolean;
	nextSection: string;
	isComplete: boolean;
	percentComplete: number;
}

/**
 * Custom hook to track assessment completion progress
 * Checks localStorage for completed sections and determines the next step
 *
 * @returns Assessment progress state with completion status and next section
 *
 * @example
 * ```tsx
 * const progress = useAssessmentProgress();
 * console.log(progress.percentComplete); // 60
 * navigate({ to: progress.nextSection }); // "/intake/aptitude"
 * ```
 */
export function useAssessmentProgress(): AssessmentProgress {
	const [progress, setProgress] = useState<AssessmentProgress>(() =>
		calculateProgress(),
	);

	useEffect(() => {
		// Update progress when component mounts or when localStorage changes
		const updatedProgress = calculateProgress();
		setProgress(updatedProgress);

		// Optional: Listen for storage events from other tabs
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key?.startsWith("assessment_")) {
				setProgress(calculateProgress());
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Expose a refresh method for manual updates
	useEffect(() => {
		const refreshProgress = () => {
			setProgress(calculateProgress());
		};

		// Create a custom event listener for manual refresh
		window.addEventListener("assessmentUpdated", refreshProgress);
		return () =>
			window.removeEventListener("assessmentUpdated", refreshProgress);
	}, []);

	return progress;
}

/**
 * Helper function to calculate current assessment progress
 */
function calculateProgress(): AssessmentProgress {
	// Check which sections are completed
	const basic = !!storage.get("assessment_basic");
	const personality = !!storage.get("assessment_personality");
	const values = !!storage.get("assessment_values");
	const aptitude = !!storage.get("assessment_aptitude");
	const challenges = !!storage.get("assessment_challenges");

	// Determine next section to complete
	let nextSection = "/intake/basic";
	if (!basic) nextSection = "/intake/basic";
	else if (!personality) nextSection = "/intake/personality";
	else if (!values) nextSection = "/intake/values";
	else if (!aptitude) nextSection = "/intake/aptitude";
	else if (!challenges) nextSection = "/intake/challenges";
	else nextSection = "/intake/results";

	// Calculate completion percentage
	const completedCount = [
		basic,
		personality,
		values,
		aptitude,
		challenges,
	].filter(Boolean).length;
	const percentComplete = (completedCount / 5) * 100;
	const isComplete = completedCount === 5;

	return {
		basic,
		personality,
		values,
		aptitude,
		challenges,
		nextSection,
		isComplete,
		percentComplete,
	};
}

/**
 * Utility function to trigger a progress refresh across components
 * Call this after saving assessment data to localStorage
 */
export function refreshAssessmentProgress(): void {
	window.dispatchEvent(new CustomEvent("assessmentUpdated"));
}

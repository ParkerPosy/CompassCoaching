import { useSyncExternalStore } from "react";
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
 * Cache for getAssessmentSnapshot to prevent infinite loops
 */
let cachedSnapshot: AssessmentProgress | null = null;
let cachedKeys: string | null = null;

/**
 * Server snapshot - cached to prevent infinite loops
 * Always returns the same object reference
 */
const serverSnapshot: AssessmentProgress = {
	basic: false,
	personality: false,
	values: false,
	aptitude: false,
	challenges: false,
	nextSection: "/intake/basic",
	isComplete: false,
	percentComplete: 0,
};

/**
 * Subscribe to assessment data changes in localStorage
 * This function is called by useSyncExternalStore to set up listeners
 */
function subscribeToAssessmentChanges(callback: () => void) {
	// Listen for storage events from other tabs/windows
	const handleStorageChange = (e: StorageEvent) => {
		if (e.key?.startsWith("assessment_")) {
			// Invalidate cache when data changes
			cachedKeys = null;
			cachedSnapshot = null;
			callback();
		}
	};

	// Listen for storage events in the same tab (custom implementation)
	const handleLocalStorageChange = (e: Event) => {
		if (e instanceof CustomEvent && e.detail?.key?.startsWith("assessment_")) {
			// Invalidate cache when data changes
			cachedKeys = null;
			cachedSnapshot = null;
			callback();
		}
	};

	window.addEventListener("storage", handleStorageChange);
	window.addEventListener("localStorageChange", handleLocalStorageChange);

	return () => {
		window.removeEventListener("storage", handleStorageChange);
		window.removeEventListener("localStorageChange", handleLocalStorageChange);
	};
}

/**
 * Helper function to calculate current assessment progress
 * Cached to prevent infinite loops in useSyncExternalStore
 */
function getAssessmentSnapshot(): AssessmentProgress {
	// Check if we're in a browser environment
	if (typeof window === "undefined") {
		return getServerSnapshot();
	}

	try {
		// Create a cache key from localStorage state
		const keys = [
			localStorage.getItem("assessment_basic"),
			localStorage.getItem("assessment_personality"),
			localStorage.getItem("assessment_values"),
			localStorage.getItem("assessment_aptitude"),
			localStorage.getItem("assessment_challenges"),
		].join("|");

		// Return cached value if data hasn't changed
		if (cachedKeys === keys && cachedSnapshot) {
			return cachedSnapshot;
		}

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

		// Cache the result
		cachedKeys = keys;
		cachedSnapshot = {
			basic,
			personality,
			values,
			aptitude,
			challenges,
			nextSection,
			isComplete,
			percentComplete,
		};

		return cachedSnapshot;
	} catch (error) {
		console.error("Error reading assessment progress:", error);
		return getServerSnapshot();
	}
}

/**
 * Server snapshot always returns empty state since localStorage isn't available during SSR
 * This prevents hydration mismatches - returns cached object to avoid infinite loops
 */
function getServerSnapshot(): AssessmentProgress {
	return serverSnapshot;
}

/**
 * Custom hook to track assessment completion progress
 * Uses useSyncExternalStore to automatically sync with localStorage changes
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
	return useSyncExternalStore(
		subscribeToAssessmentChanges,
		getAssessmentSnapshot,
		getServerSnapshot, // Server snapshot returns empty state to prevent hydration mismatch
	);
}

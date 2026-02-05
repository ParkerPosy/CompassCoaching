/**
 * Storage service - Abstraction layer for data persistence
 * Currently uses localStorage, but can be easily swapped for API calls
 */

import type {
	AssessmentResults,
	BasicInfo,
	PersonalityAnswers,
	ValueRatings,
	AptitudeData,
	ChallengesData,
} from "@/types/assessment";

export type StorageKey =
	| "assessment_basic"
	| "assessment_personality"
	| "assessment_values"
	| "assessment_aptitude"
	| "assessment_challenges"
	| "assessment_results";

/**
 * Generic storage interface - can be implemented by different storage backends
 */
interface IStorage {
	get<T>(key: StorageKey): T | null;
	set<T>(key: StorageKey, value: T): void;
	remove(key: StorageKey): void;
	clear(): void;
	getAll(): Record<string, unknown>;
}

/**
 * localStorage implementation of IStorage
 */
class LocalStorageAdapter implements IStorage {
	get<T>(key: StorageKey): T | null {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error(`Error reading ${key} from localStorage:`, error);
			return null;
		}
	}

	set<T>(key: StorageKey, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing ${key} to localStorage:`, error);
		}
	}

	remove(key: StorageKey): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing ${key} from localStorage:`, error);
		}
	}

	clear(): void {
		try {
			// Only clear assessment-related keys
			const keys: StorageKey[] = [
				"assessment_basic",
				"assessment_personality",
				"assessment_values",
				"assessment_aptitude",
				"assessment_challenges",
				"assessment_results",
			];
			keys.forEach((key) => localStorage.removeItem(key));
		} catch (error) {
			console.error("Error clearing localStorage:", error);
		}
	}

	getAll(): Record<string, unknown> {
		const data: Record<string, unknown> = {};
		const keys: StorageKey[] = [
			"assessment_basic",
			"assessment_personality",
			"assessment_values",
			"assessment_aptitude",
			"assessment_challenges",
		];

		keys.forEach((key) => {
			const value = this.get(key);
			if (value) {
				data[key] = value;
			}
		});

		return data;
	}
}

/**
 * Storage service singleton
 */
class StorageService {
	private adapter: IStorage;

	constructor(adapter: IStorage) {
		this.adapter = adapter;
	}

	/**
	 * Get a single section's data
	 */
	get<T>(key: StorageKey): T | null {
		return this.adapter.get<T>(key);
	}

	/**
	 * Save a single section's data
	 */
	save<T>(key: StorageKey, data: T): void {
		this.adapter.set(key, data);
	}

	/**
	 * Remove a single section's data
	 */
	remove(key: StorageKey): void {
		this.adapter.remove(key);
	}

	/**
	 * Clear all assessment data
	 */
	clearAll(): void {
		this.adapter.clear();
	}

	/**
	 * Compile all assessment sections into final results
	 */
	compileResults(): AssessmentResults | null {
		const basic = this.get<BasicInfo>("assessment_basic");
		const personality = this.get<PersonalityAnswers>("assessment_personality");
		const values = this.get<ValueRatings>("assessment_values");
		const aptitude = this.get<AptitudeData>("assessment_aptitude");
		const challenges = this.get<ChallengesData>("assessment_challenges");

		// Validate all sections are complete
		if (!basic || !personality || !values || !aptitude || !challenges) {
			return null;
		}

		const results: AssessmentResults = {
			basic: basic as BasicInfo,
			personality: personality as PersonalityAnswers,
			values: values as ValueRatings,
			aptitude: aptitude as AptitudeData,
			challenges: challenges as ChallengesData,
			completedAt: new Date().toISOString(),
			id: `assessment_${Date.now()}`,
		};

		// Save compiled results
		this.save("assessment_results", results);
		return results;
	}

	/**
	 * Get compiled assessment results
	 */
	getResults(): AssessmentResults | null {
		return this.get("assessment_results");
	}

	/**
	 * Check if all sections are complete
	 */
	isComplete(): boolean {
		const basic = this.get("assessment_basic");
		const personality = this.get("assessment_personality");
		const values = this.get("assessment_values");
		const aptitude = this.get("assessment_aptitude");
		const challenges = this.get("assessment_challenges");

		return !!(basic && personality && values && aptitude && challenges);
	}

	/**
	 * Get completion progress (0-100)
	 */
	getProgress(): number {
		const sections = [
			"assessment_basic",
			"assessment_personality",
			"assessment_values",
			"assessment_aptitude",
			"assessment_challenges",
		] as StorageKey[];

		const completed = sections.filter((key) => this.get(key)).length;
		return Math.round((completed / sections.length) * 100);
	}
}

// Export singleton instance
export const storage = new StorageService(new LocalStorageAdapter());

// Export for testing or alternative implementations
export { LocalStorageAdapter, StorageService };
export type { IStorage };

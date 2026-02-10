/**
 * Assessment Store - Zustand-powered reactive store with SSR-safe localStorage persistence
 * This replaces direct localStorage access with a reactive state management solution
 */

import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Current assessment structure version.
 * Increment this when making breaking changes to the assessment structure
 * that would invalidate previous results.
 */
export const CURRENT_ASSESSMENT_VERSION = 1;
import type {
  AptitudeData,
  AssessmentResults,
  BasicInfo,
  ChallengesData,
  PersonalityAnswers,
  ValueRatings,
} from "@/types/assessment";

/**
 * Assessment progress interface
 */
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
 * Assessment store state interface
 */
interface AssessmentState {
  // Assessment section data
  basic: BasicInfo | null;
  personality: PersonalityAnswers | null;
  values: ValueRatings | null;
  aptitude: AptitudeData | null;
  challenges: ChallengesData | null;
  results: AssessmentResults | null;

  // Actions to update state (partial updates, merged with existing)
  updateBasic: (data: Partial<BasicInfo>) => void;
  updatePersonality: (data: Partial<PersonalityAnswers>) => void;
  updateValues: (data: Partial<ValueRatings>) => void;
  updateAptitude: (data: Partial<AptitudeData>) => void;
  updateChallenges: (data: Partial<ChallengesData>) => void;
  setResults: (data: AssessmentResults) => void;

  // Utility actions
  clearAll: () => void;
  clearResults: () => void;
  compileResults: () => AssessmentResults | null;
  isComplete: () => boolean;
  getProgress: () => number;
}

/**
 * SSR-safe localStorage wrapper
 * Returns undefined during SSR, which tells Zustand to skip persistence
 */
const createSafeStorage = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return undefined;
  }

  return createJSONStorage(() => localStorage);
};

/**
 * Assessment store with SSR-safe persistence
 */
export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      basic: null,
      personality: null,
      values: null,
      aptitude: null,
      challenges: null,
      results: null,

      // Setters for each section (partial updates merged with existing data)
      updateBasic: (data: Partial<BasicInfo>) => set((state) => ({
        basic: { ...(state.basic || { name: "", ageRange: "", educationLevel: "", employmentStatus: "", primaryReason: "" }), ...data } as BasicInfo
      })),
      updatePersonality: (data: Partial<PersonalityAnswers>) => set((state) => ({
        personality: { ...(state.personality || {}), ...data } as PersonalityAnswers
      })),
      updateValues: (data: Partial<ValueRatings>) => set((state) => ({
        values: { ...(state.values || {}), ...data } as ValueRatings
      })),
      updateAptitude: (data: Partial<AptitudeData>) => set((state) => ({
        aptitude: { ...(state.aptitude || { stem: [0,0,0,0], arts: [0,0,0,0], communication: [0,0,0,0], business: [0,0,0,0], healthcare: [0,0,0,0], trades: [0,0,0,0], socialServices: [0,0,0,0], law: [0,0,0,0] }), ...data } as AptitudeData
      })),
      updateChallenges: (data: Partial<ChallengesData>) => set((state) => ({
        challenges: { ...(state.challenges || { financial: "", timeAvailability: "", locationFlexibility: "", familyObligations: "", transportation: "", healthConsiderations: "", educationGaps: [], supportSystem: "", additionalNotes: "" }), ...data } as ChallengesData
      })),
      setResults: (data: AssessmentResults) => set({ results: data }),

      // Clear all assessment data
      clearAll: () =>
        set({
          basic: null,
          personality: null,
          values: null,
          aptitude: null,
          challenges: null,
          results: null,
        }),

      // Clear results and section data for retaking assessment
      clearResults: () =>
        set({
          basic: null,
          personality: null,
          values: null,
          aptitude: null,
          challenges: null,
          results: null,
        }),

      // Compile all sections into final results
      compileResults: () => {
        const state = get();
        const { basic, personality, values, aptitude, challenges } = state;

        // Validate all sections are complete
        if (!basic || !personality || !values || !aptitude || !challenges) {
          return null;
        }

        const results: AssessmentResults = {
          basic,
          personality,
          values,
          aptitude,
          challenges,
          completedAt: new Date().toISOString(),
          id: `assessment_${Date.now()}`,
          version: CURRENT_ASSESSMENT_VERSION,
        };

        // Save compiled results to state
        set({ results });
        return results;
      },

      // Check if all sections are complete
      isComplete: () => {
        const state = get();
        return !!(
          state.basic &&
          state.personality &&
          state.values &&
          state.aptitude &&
          state.challenges
        );
      },

      // Get completion progress (0-100)
      getProgress: () => {
        const state = get();
        const sections = [
          state.basic,
          state.personality,
          state.values,
          state.aptitude,
          state.challenges,
        ];
        const completed = sections.filter(Boolean).length;
        return Math.round((completed / sections.length) * 100);
      },
    }),
    {
      name: "assessment-storage", // localStorage key
      storage: createSafeStorage(),
      // Partition state for efficient updates
      partialize: (state) => ({
        basic: state.basic,
        personality: state.personality,
        values: state.values,
        aptitude: state.aptitude,
        challenges: state.challenges,
        results: state.results,
      }),
    },
  ),
);

/**
 * Selector hooks for optimized re-renders
 */
export const useBasicInfo = () => useAssessmentStore((state) => state.basic);
export const usePersonality = () =>
  useAssessmentStore((state) => state.personality);
export const useValues = () => useAssessmentStore((state) => state.values);
export const useAptitude = () => useAssessmentStore((state) => state.aptitude);
export const useChallenges = () =>
  useAssessmentStore((state) => state.challenges);
export const useAssessmentResults = () =>
  useAssessmentStore((state) => state.results);

/**
 * Hook to check if the store has finished hydrating from localStorage.
 * Uses Zustand persist's built-in hydration tracking.
 */
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(() => {
    // Check if persist API is available (not during SSR)
    if (typeof window === "undefined") return false;
    return useAssessmentStore.persist?.hasHydrated?.() ?? false;
  });

  useEffect(() => {
    // Skip if persist API isn't available
    if (!useAssessmentStore.persist?.onFinishHydration) {
      setHasHydrated(true);
      return;
    }

    // If already hydrated, update state
    if (useAssessmentStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    const unsubFinishHydration = useAssessmentStore.persist.onFinishHydration(
      () => setHasHydrated(true)
    );
    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hasHydrated;
};

/**
 * Check if stored results are from an outdated assessment version
 */
export const useIsResultsOutdated = () =>
  useAssessmentStore((state) => {
    if (!state.results) return false;
    // Results without version are considered outdated (pre-versioning)
    return (state.results.version ?? 0) < CURRENT_ASSESSMENT_VERSION;
  });

/**
 * Progress selector hook with memoization to prevent infinite re-renders
 * Returns individual primitive values and computes derived state
 */
export const useAssessmentProgress = (): AssessmentProgress => {
  // Select only the primitive state we need
  const basic = useAssessmentStore((state) => !!state.basic);
  const personality = useAssessmentStore((state) => !!state.personality);
  const values = useAssessmentStore((state) => !!state.values);
  const aptitude = useAssessmentStore((state) => !!state.aptitude);
  const challenges = useAssessmentStore((state) => !!state.challenges);

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
};

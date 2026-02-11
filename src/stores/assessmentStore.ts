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
export const CURRENT_ASSESSMENT_VERSION = 2;
import type {
  AptitudeData,
  AssessmentResults,
  BasicInfo,
  ChallengesData,
  PersonalityAnswers,
  ValueRatings,
} from "@/types/assessment";

// ─── Section completion constants ─────────────────────────────────
const PERSONALITY_QUESTIONS = 11;
const VALUES_COUNT = 12;
const APTITUDE_CLUSTERS = ["stem", "arts", "communication", "business", "healthcare", "trades", "socialServices", "law"] as const;
const COLLEGE_EDUCATION_LEVELS = ["some-college", "associates", "bachelors", "masters", "trade-cert"];

// ─── Section completion checkers (single source of truth) ─────────
export function isBasicComplete(basic: BasicInfo | null): boolean {
  if (!basic) return false;
  const hasCoreFields = !!(basic.name && basic.ageRange && basic.educationLevel && basic.employmentStatus);
  if (!hasCoreFields) return false;
  const needsDegree = COLLEGE_EDUCATION_LEVELS.includes(basic.educationLevel || "");
  if (!needsDegree) return true;
  const firstDegree = basic.degrees?.[0];
  return !!(firstDegree?.level && firstDegree?.name?.trim());
}

export function isPersonalityComplete(personality: PersonalityAnswers | null): boolean {
  if (!personality) return false;
  return Object.keys(personality).length >= PERSONALITY_QUESTIONS;
}

export function isValuesComplete(values: ValueRatings | null): boolean {
  if (!values) return false;
  return Object.keys(values).length >= VALUES_COUNT;
}

export function isAptitudeComplete(aptitude: AptitudeData | null): boolean {
  if (!aptitude) return false;
  return APTITUDE_CLUSTERS.every((key) => {
    const arr = aptitude[key];
    return Array.isArray(arr) && arr.length >= 4 && arr.every((v) => v > 0);
  });
}

export function isChallengesComplete(challenges: ChallengesData | null): boolean {
  if (!challenges) return false;
  return !!(challenges.financial && challenges.timeAvailability && challenges.locationFlexibility && challenges.supportSystem);
}

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
 * Detailed section completion info returned by useSectionCompletion()
 */
export interface SectionCompletion {
  /** Per-section completion booleans [basic, personality, values, aptitude, challenges] */
  sectionCompletion: [boolean, boolean, boolean, boolean, boolean];
  /** Number of completed sections (0-5) */
  completedSections: number;
  /** Whether all 5 sections pass their field-level checks */
  allComplete: boolean;
  /** Overall progress percentage (0-100) based on completed sections */
  overallProgress: number;
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
        basic: { ...(state.basic || { name: "", ageRange: "", educationLevel: "", employmentStatus: "", primaryReason: "", degrees: [] }), ...data } as BasicInfo
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

      // Check if all sections pass field-level completion
      isComplete: () => {
        const state = get();
        return (
          isBasicComplete(state.basic) &&
          isPersonalityComplete(state.personality) &&
          isValuesComplete(state.values) &&
          isAptitudeComplete(state.aptitude) &&
          isChallengesComplete(state.challenges)
        );
      },

      // Get completion progress (0-100) using field-level checks
      getProgress: () => {
        const state = get();
        const sections = [
          isBasicComplete(state.basic),
          isPersonalityComplete(state.personality),
          isValuesComplete(state.values),
          isAptitudeComplete(state.aptitude),
          isChallengesComplete(state.challenges),
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
 * Progress selector hook with field-level completion checks.
 * Uses the centralized is*Complete() helpers so the intake landing page,
 * footer, and any other consumer share one source of truth.
 */
export const useAssessmentProgress = (): AssessmentProgress => {
  const basic = useAssessmentStore((state) => state.basic);
  const personality = useAssessmentStore((state) => state.personality);
  const values = useAssessmentStore((state) => state.values);
  const aptitude = useAssessmentStore((state) => state.aptitude);
  const challenges = useAssessmentStore((state) => state.challenges);

  const basicDone = isBasicComplete(basic);
  const personalityDone = isPersonalityComplete(personality);
  const valuesDone = isValuesComplete(values);
  const aptitudeDone = isAptitudeComplete(aptitude);
  const challengesDone = isChallengesComplete(challenges);

  // Determine next section to complete
  let nextSection = "/intake/basic";
  if (!basicDone) nextSection = "/intake/basic";
  else if (!personalityDone) nextSection = "/intake/personality";
  else if (!valuesDone) nextSection = "/intake/values";
  else if (!aptitudeDone) nextSection = "/intake/aptitude";
  else if (!challengesDone) nextSection = "/intake/challenges";
  else nextSection = "/intake/results";

  const completedCount = [basicDone, personalityDone, valuesDone, aptitudeDone, challengesDone].filter(Boolean).length;
  const percentComplete = (completedCount / 5) * 100;
  const isComplete = completedCount === 5;

  return {
    basic: basicDone,
    personality: personalityDone,
    values: valuesDone,
    aptitude: aptitudeDone,
    challenges: challengesDone,
    nextSection,
    isComplete,
    percentComplete,
  };
};

/**
 * Detailed section completion hook for the assessment footer and any
 * navigation panel that needs per-section booleans + overall progress.
 */
export const useSectionCompletion = (): SectionCompletion => {
  const basic = useAssessmentStore((state) => state.basic);
  const personality = useAssessmentStore((state) => state.personality);
  const values = useAssessmentStore((state) => state.values);
  const aptitude = useAssessmentStore((state) => state.aptitude);
  const challenges = useAssessmentStore((state) => state.challenges);

  const sectionCompletion: [boolean, boolean, boolean, boolean, boolean] = [
    isBasicComplete(basic),
    isPersonalityComplete(personality),
    isValuesComplete(values),
    isAptitudeComplete(aptitude),
    isChallengesComplete(challenges),
  ];

  const completedSections = sectionCompletion.filter(Boolean).length;

  return {
    sectionCompletion,
    completedSections,
    allComplete: completedSections === 5,
    overallProgress: Math.round((completedSections / 5) * 100),
  };
};

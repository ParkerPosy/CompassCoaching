/**
 * Assessment progress hooks - Re-exports from Zustand store
 * Now powered by Zustand for better reactivity and SSR safety
 */

export { useAssessmentProgress, useSectionCompletion } from "@/stores/assessmentStore";
export type { AssessmentProgress, SectionCompletion } from "@/stores/assessmentStore";

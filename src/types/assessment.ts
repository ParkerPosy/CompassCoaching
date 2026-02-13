/**
 * Assessment data type definitions
 */

export interface Degree {
  level: string;
  name: string;
  gpa?: string;
}

export interface BasicInfo {
  name: string;
  ageRange: string;
  educationLevel: string;
  employmentStatus: string;
  primaryReason: string;
  degrees?: Degree[];
  workExperience?: string[];
}

export interface PersonalityAnswers {
  [key: string]: number;
}

export interface ValueRatings {
  [key: string]: number;
}

export interface AptitudeData {
  stem: number[];
  arts: number[];
  communication: number[];
  business: number[];
  healthcare: number[];
  trades: number[];
  socialServices: number[];
  law: number[];
}

export interface ChallengesData {
  financial: string;
  timeAvailability: string;
  locationFlexibility: string;
  familyObligations: string;
  transportation: string;
  healthConsiderations: string;
  educationGaps: string[];
  supportSystem: string;
  additionalNotes: string;
  salaryMinimum?: string;
  timelineUrgency?: string;
}

export interface AssessmentResults {
  basic: BasicInfo;
  personality: PersonalityAnswers;
  values: ValueRatings;
  aptitude: AptitudeData;
  challenges: ChallengesData;
  completedAt: string;
  id: string;
  /** Assessment structure version for migration detection */
  version?: number;
}

export interface AssessmentAnalysis {
  topCareerFields: Array<{
    field: string;
    score: number;
    description: string;
  }>;
  topValues: Array<{
    value: string;
    score: number;
  }>;
  personalityInsights: string[];
  recommendations: string[];
  nextSteps: string[];
}

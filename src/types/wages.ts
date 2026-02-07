/**
 * Pennsylvania Occupational Wage Data Types
 * Source: Pennsylvania Department of Labor & Industry
 * Data includes wage information for all 67 PA counties
 */

// Education level codes from PA wage data
export type EducationLevel =
  | 'ND' // No formal educational credential
  | 'HS' // High school diploma or equivalent
  | 'PS' // Postsecondary nondegree award
  | 'SC' // Some college, no degree
  | 'AD' // Associate's degree
  | 'BD' // Bachelor's degree
  | 'BD+' // Bachelor's degree or higher
  | 'MD' // Master's degree
  | 'DD' // Doctoral or professional degree
  | '#'; // Varies or not available

// Area type codes
export type AreaType =
  | 'CTY' // County-specific data
  | 'WDA' // Workforce Development Area (when county data unavailable)
  | 'MSA' // Metropolitan Statistical Area
  | 'STW'; // Statewide

/**
 * Raw occupation wage data as parsed from PA XLS files
 */
export interface OccupationWageRaw {
  socCode: string; // Standard Occupational Classification code (e.g., "11-1011")
  title: string; // Occupational title
  educationLevel: EducationLevel;
  areaType: AreaType;
  county: string; // PA County name (e.g., "Adams", "Centre")

  // Wage data (null for unavailable data marked as "*" or "#")
  averageHourlyWage: number | null;
  averageAnnualWage: number | null;
  medianAnnualWage: number | null;
  entryAnnualWage: number | null;
  experiencedAnnualWage: number | null;
  midRangeLow: number | null;
  midRangeHigh: number | null;

  // Metadata
  dataDate: string; // e.g., "2024-05"
}

/**
 * Processed occupation data with aggregated wage information
 * This combines data from all counties to provide statewide insights
 */
export interface Occupation {
  id: string; // Derived from SOC code
  socCode: string;
  title: string;
  description?: string; // To be added later

  // Education & Requirements
  educationLevel: EducationLevel;
  educationDescription?: string; // Human-readable education requirement

  // Wage Information (aggregated across available counties)
  wages: {
    statewide: WageRange;
    byCounty: CountyWageData[];
  };

  // Career Metadata for Assessment Matching
  metadata?: OccupationMetadata;
}

/**
 * Wage range information
 */
/**
 * Occupation metadata for assessment correlation
 */
export interface OccupationMetadata {
  // Primary career cluster (maps to aptitude areas)
  careerCluster: 'stem' | 'arts' | 'communication' | 'business' | 'healthcare' | 'trades' | 'socialServices' | 'law';

  // Secondary clusters (if applicable)
  secondaryClusters?: Array<'stem' | 'arts' | 'communication' | 'business' | 'healthcare' | 'trades' | 'socialServices' | 'law'>;

  // Work environment preferences
  workEnvironment: {
    setting: Array<'office' | 'remote' | 'field' | 'laboratory' | 'hospital' | 'school' | 'outdoor' | 'warehouse' | 'retail' | 'home'>;
    schedule: Array<'standard' | 'flexible' | 'shift' | 'evening' | 'weekend' | 'oncall'>;
    physicalDemands: 'sedentary' | 'light' | 'medium' | 'heavy' | 'veryHeavy';
    travelRequired: 'none' | 'occasional' | 'frequent' | 'constant';
  };

  // Skills and abilities emphasis
  skills: {
    analytical: number; // 0-10 scale
    creative: number;
    social: number;
    technical: number;
    leadership: number;
    physical: number;
    detail: number;
  };

  // Work style preferences (personality matching)
  workStyle: {
    independence: 'team' | 'mixed' | 'independent';
    structure: 'highly_structured' | 'moderate' | 'flexible';
    variety: 'routine' | 'moderate' | 'high_variety';
    pace: 'methodical' | 'moderate' | 'fast_paced';
    peopleInteraction: 'minimal' | 'moderate' | 'extensive';
  };

  // Values alignment
  values: Array<
    | 'helping_others'
    | 'financial_security'
    | 'work_life_balance'
    | 'creativity'
    | 'problem_solving'
    | 'leadership'
    | 'stability'
    | 'advancement'
    | 'independence'
    | 'variety'
    | 'prestige'
    | 'service'
    | 'innovation'
  >;

  // Career outlook
  outlook: {
    growth: 'declining' | 'stable' | 'growing' | 'much_faster_than_average';
    automationRisk: 'low' | 'medium' | 'high';
  };

  // Related information
  keywords: string[];
  certifications?: string[];
}

/**
 * Wage range information
 */
export interface WageRange {
  hourly?: {
    average: number | null;
    min: number | null;
    max: number | null;
  };
  annual: {
    average: number | null;
    median: number | null;
    entry: number | null;
    experienced: number | null;
    midRangeLow: number | null;
    midRangeHigh: number | null;
    min: number | null; // Minimum across all data points
    max: number | null; // Maximum across all data points
  };
}

/**
 * County-specific wage data
 */
export interface CountyWageData {
  county: string;
  areaType: AreaType;
  wages: WageRange;
}

/**
 * Salary negotiation context - helps users understand their worth
 */
export interface SalaryNegotiationData {
  occupationId: string;
  title: string;

  // Context for the user's situation
  location: string; // County or "Statewide"
  experienceLevel: 'entry' | 'mid' | 'experienced';

  // Relevant wage data
  targetSalary: number;
  salaryRange: {
    low: number;
    mid: number;
    high: number;
  };

  // Comparative context
  countyMedian: number;
  statewideMedian: number;
  percentile?: number; // Where they fall in the range

  // Negotiation tips
  insights: string[];
}

/**
 * Career match score - relates occupation to intake form results
 */
export interface CareerMatch {
  occupation: Occupation;
  matchScore: number; // 0-100
  matchReasons: {
    values: string[];
    personality: string[];
    aptitudes: string[];
    interests: string[];
  };
  salaryRange: WageRange;
}

import { createServerFn } from '@tanstack/react-start';
import type { Occupation } from '@/types/wages';
import type { AssessmentResults } from '@/types/assessment';
import { getAllOccupations, getSpecificOccupations, getAvailableCounties as getCountiesList } from './wages.server';

const TEXT_MATCH_WEIGHT = 10;
const TEXT_MATCH_MIN_TOKEN_LENGTH = 4;
const TEXT_MATCH_STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has', 'have', 'if',
  'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'their', 'to', 'was',
  'were', 'will', 'with', 'without', 'your', 'you', 'we', 'our', 'they', 'them', 'this',
  'those', 'these', 'i', 'me', 'my', 'mine', 'about', 'help', 'career', 'job', 'jobs',
  'work', 'working', 'field', 'fields', 'role', 'roles', 'position', 'positions', 'like',
  'looking', 'seeking', 'interest', 'interests', 'learn', 'learning', 'grow', 'growth',
  'change', 'changing', 'better', 'new', 'next', 'step', 'steps', 'goal', 'goals',
]);

/**
 * Lightweight English stemmer – strips common suffixes so words like
 * "development", "developers", "developing" all reduce to a shared stem.
 */
function stem(word: string): string {
  // Order matters: check longer suffixes first
  const suffixes = [
    'mentation', 'isation', 'ization',
    'ements', 'ments', 'ators', 'ators',
    'ement', 'ment', 'ness', 'tion', 'sion', 'ious', 'eous', 'able', 'ible',
    'ator', 'ling', 'ally', 'ical', 'ical', 'ment',
    'ers', 'ing', 'ion', 'ous', 'ive', 'ity', 'ful', 'ant', 'ent', 'ism', 'ist', 'ual',
    'ly', 'ed', 'er', 'es', 'al', 'or',
  ];
  let s = word;
  for (const suffix of suffixes) {
    if (s.length > suffix.length + 3 && s.endsWith(suffix)) {
      s = s.slice(0, -suffix.length);
      break;
    }
  }
  // Trim trailing duplicate consonant (e.g. "develop" from "developper")
  if (s.length > 3 && s[s.length - 1] === s[s.length - 2]) {
    s = s.slice(0, -1);
  }
  return s;
}

function extractTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= TEXT_MATCH_MIN_TOKEN_LENGTH)
    .filter((token) => !TEXT_MATCH_STOPWORDS.has(token));
}

function getAssessmentTokens(assessment: AssessmentResults): string[] {
  const primaryReason = assessment.basic?.primaryReason || '';
  const additionalNotes = assessment.challenges?.additionalNotes || '';
  const degreeNames = (assessment.basic?.degrees || [])
    .map((degree) => degree.name || '')
    .join(' ');

  const combined = `${primaryReason} ${additionalNotes} ${degreeNames}`.trim();
  if (!combined) return [];
  return Array.from(new Set(extractTokens(combined)));
}

function getOccupationTokens(occupation: Occupation): string[] {
  const keywordText = occupation.metadata?.keywords?.join(' ') || '';
  const certText = occupation.metadata?.certifications?.join(' ') || '';
  const combined = `${occupation.title} ${occupation.description || ''} ${keywordText} ${certText}`.trim();
  if (!combined) return [];
  return Array.from(new Set(extractTokens(combined)));
}

/**
 * Career match with score and reasons
 */
export interface CareerMatch extends Occupation {
  matchScore: number;
  matchReasons: string[];
}

/**
 * Parameters for fetching career matches
 */
export interface CareerMatchParams {
  assessment: AssessmentResults;
  offset: number;
  limit: number;
  county?: string;
}

/**
 * Response for career matches
 */
export interface CareerMatchResponse {
  matches: CareerMatch[];
  total: number;
  hasMore: boolean;
}

/**
 * Calculate match score between assessment results and occupation metadata
 */
function calculateMatchScore(
  occupation: Occupation,
  assessment: AssessmentResults
): { score: number; reasons: string[] } {
  if (!occupation.metadata) {
    return { score: 0, reasons: [] };
  }

  const reasons: string[] = [];
  let totalScore = 0;
  let maxScore = 0;

  const metadata = occupation.metadata;
  const personality = assessment.personality || {};
  const values = assessment.values || {};
  const aptitude = assessment.aptitude || {};

  // 1. Career Cluster Match (40 points max)
  maxScore += 40;
  const primaryCluster = metadata.careerCluster;
  const aptitudeArray = aptitude[primaryCluster as keyof typeof aptitude] || [];

  if (aptitudeArray.length > 0) {
    const aptitudeSum = aptitudeArray.reduce((a: number, b: number) => a + b, 0);
    const aptitudeAvg = aptitudeSum / aptitudeArray.length;
    const clusterScore = Math.round((aptitudeAvg / 5) * 40);
    totalScore += clusterScore;

    if (aptitudeAvg >= 4.5) {
      reasons.push(`Excellent ${formatClusterName(primaryCluster)} aptitude`);
    } else if (aptitudeAvg >= 4) {
      reasons.push(`Strong ${formatClusterName(primaryCluster)} aptitude`);
    } else if (aptitudeAvg >= 3) {
      reasons.push(`Good ${formatClusterName(primaryCluster)} fit`);
    }
  }

  // 2. Work Style Match (25 points max)
  maxScore += 25;
  let styleScore = 0;

  const workEnvPref = personality['work_environment'];
  const occupationSettings = metadata.workEnvironment.setting;

  if (workEnvPref === 1) {
    if (occupationSettings.includes('office')) styleScore += 5;
    else if (occupationSettings.some((s: string) => ['laboratory', 'school', 'hospital', 'remote'].includes(s))) styleScore += 3;
  } else if (workEnvPref === 2) {
    if (occupationSettings.includes('remote')) styleScore += 5;
    else if (occupationSettings.includes('office') && metadata.workEnvironment.schedule?.includes('flexible')) styleScore += 4;
    else if (occupationSettings.includes('office')) styleScore += 2;
  } else if (workEnvPref === 3) {
    if (occupationSettings.some((s: string) => ['outdoor', 'field'].includes(s))) styleScore += 5;
    else if (occupationSettings.includes('warehouse')) styleScore += 3;
  } else if (workEnvPref === 4) {
    if (occupationSettings.length > 1) styleScore += 5;
    else styleScore += 2;
  }

  const interactionPref = personality['interaction_style'];
  const peopleInteraction = metadata.workStyle.peopleInteraction;

  if (interactionPref === 1) {
    if (peopleInteraction === 'minimal') styleScore += 5;
    else if (peopleInteraction === 'moderate') styleScore += 3;
  } else if (interactionPref === 2) {
    if (peopleInteraction === 'moderate') styleScore += 5;
    else if (peopleInteraction === 'minimal') styleScore += 4;
  } else if (interactionPref === 3 || interactionPref === 4) {
    if (peopleInteraction === 'extensive') styleScore += 5;
    else if (peopleInteraction === 'moderate') styleScore += 3;
  }

  const structurePref = personality['structure'];
  const occupationStructure = metadata.workStyle.structure;

  if (structurePref === 1) {
    if (occupationStructure === 'highly_structured') styleScore += 5;
    else if (occupationStructure === 'moderate') styleScore += 3;
  } else if (structurePref === 2) {
    if (occupationStructure === 'moderate') styleScore += 5;
    else if (occupationStructure === 'flexible') styleScore += 4;
    else if (occupationStructure === 'highly_structured') styleScore += 3;
  } else if (structurePref === 3 || structurePref === 4) {
    if (occupationStructure === 'flexible') styleScore += 5;
    else if (occupationStructure === 'moderate') styleScore += 3;
  }

  const pacePref = personality['pace'];
  const occupationPace = metadata.workStyle.pace;

  if (pacePref === 1) {
    if (occupationPace === 'methodical') styleScore += 5;
    else if (occupationPace === 'moderate') styleScore += 4;
    else if (occupationPace === 'fast_paced') styleScore += 2;
  } else if (pacePref === 2 || pacePref === 3) {
    if (occupationPace === 'moderate') styleScore += 5;
    else if (occupationPace === 'methodical' || occupationPace === 'fast_paced') styleScore += 3;
  } else if (pacePref === 4) {
    if (occupationPace === 'fast_paced') styleScore += 5;
    else if (occupationPace === 'moderate') styleScore += 3;
  }

  const energyPref = personality['energy_source'];
  const independence = metadata.workStyle.independence;

  if (energyPref === 1) {
    if (independence === 'independent') styleScore += 5;
    else if (independence === 'mixed') styleScore += 3;
  } else if (energyPref === 2) {
    if (independence === 'mixed') styleScore += 5;
    else if (independence === 'independent' || independence === 'team') styleScore += 3;
  } else if (energyPref === 3 || energyPref === 4) {
    if (independence === 'team') styleScore += 5;
    else if (independence === 'mixed') styleScore += 3;
  }

  totalScore += styleScore;
  if (styleScore >= 20) {
    reasons.push('Excellent work style fit');
  } else if (styleScore >= 15) {
    reasons.push('Good work style match');
  }

  // 3. Schedule, Travel & Physical Demands (15 points max)
  maxScore += 15;
  let envScore = 0;

  const schedulePref = personality['schedule'];
  const occupationSchedules = metadata.workEnvironment.schedule || [];

  if (schedulePref) {
    if (schedulePref === 1) {
      if (occupationSchedules.includes('standard')) envScore += 5;
      else if (!occupationSchedules.some((s: string) => ['shift', 'oncall', 'evening', 'weekend'].includes(s))) envScore += 3;
    } else if (schedulePref === 2) {
      if (occupationSchedules.includes('flexible')) envScore += 5;
      else if (occupationSchedules.includes('standard')) envScore += 3;
    } else if (schedulePref === 3) {
      if (occupationSchedules.some((s: string) => ['shift', 'evening', 'weekend'].includes(s))) envScore += 5;
      else envScore += 2;
    } else if (schedulePref === 4) {
      if (occupationSchedules.includes('oncall')) envScore += 5;
      else if (occupationSchedules.includes('flexible')) envScore += 3;
    }
  } else {
    envScore += 3;
  }

  const travelPref = personality['travel'];
  const occupationTravel = metadata.workEnvironment.travelRequired;

  if (travelPref) {
    if (travelPref === 1) {
      if (occupationTravel === 'none') envScore += 5;
      else if (occupationTravel === 'occasional') envScore += 3;
      else envScore += 1;
    } else if (travelPref === 2) {
      if (occupationTravel === 'occasional') envScore += 5;
      else if (occupationTravel === 'none' || occupationTravel === 'frequent') envScore += 3;
    } else if (travelPref === 3) {
      if (occupationTravel === 'frequent') envScore += 5;
      else if (occupationTravel === 'occasional' || occupationTravel === 'constant') envScore += 3;
    } else if (travelPref === 4) {
      if (occupationTravel === 'constant') envScore += 5;
      else if (occupationTravel === 'frequent') envScore += 4;
    }
  } else {
    envScore += 3;
  }

  const physicalPref = personality['physical_demands'];
  const physicalActivityValue = values['physical_activity'] || 3;
  const occupationPhysical = metadata.workEnvironment.physicalDemands;
  const effectivePhysicalPref = physicalPref || (physicalActivityValue >= 4 ? 3 : physicalActivityValue <= 2 ? 1 : 2);

  if (effectivePhysicalPref === 1) {
    if (occupationPhysical === 'sedentary') envScore += 5;
    else if (occupationPhysical === 'light') envScore += 3;
    else envScore += 1;
  } else if (effectivePhysicalPref === 2) {
    if (occupationPhysical === 'light') envScore += 5;
    else if (occupationPhysical === 'sedentary' || occupationPhysical === 'medium') envScore += 4;
  } else if (effectivePhysicalPref === 3) {
    if (occupationPhysical === 'medium') envScore += 5;
    else if (occupationPhysical === 'light' || occupationPhysical === 'heavy') envScore += 3;
  } else if (effectivePhysicalPref === 4) {
    if (occupationPhysical === 'heavy' || occupationPhysical === 'veryHeavy') envScore += 5;
    else if (occupationPhysical === 'medium') envScore += 3;
  }

  totalScore += envScore;
  if (envScore >= 12) {
    reasons.push('Great schedule & environment fit');
  }

  // 4. Values Alignment (15 points max)
  maxScore += 15;
  let valueScore = 0;
  let valuesMatched = 0;

  const valueMapping: Record<string, string[]> = {
    'work_life_balance': ['work_life_balance'],
    'income_potential': ['financial_security'],
    'helping_others': ['helping_others', 'service'],
    'creativity': ['creativity', 'innovation'],
    'job_security': ['stability'],
    'independence': ['independence'],
    'leadership': ['leadership', 'advancement'],
    'learning_growth': ['innovation', 'problem_solving', 'advancement'],
    'recognition': ['prestige'],
    'variety': ['variety'],
  };

  const decisionStyle = personality['decision_making'];
  if (decisionStyle === 1 && metadata.values.includes('problem_solving')) {
    valueScore += 3;
    valuesMatched++;
  }

  for (const [assessmentValue, mappedValues] of Object.entries(valueMapping)) {
    const userRating = values[assessmentValue] || 0;
    if (userRating >= 4) {
      const hasMatch = mappedValues.some(v =>
        metadata.values.includes(v as typeof metadata.values[number])
      );
      if (hasMatch) {
        valueScore += userRating === 5 ? 4 : 2;
        valuesMatched++;
      }
    }
  }

  totalScore += Math.min(15, valueScore);
  if (valuesMatched >= 3) {
    reasons.push('Strong value alignment');
  } else if (valuesMatched >= 2) {
    reasons.push('Shared values');
  }

  // 5. Skills bonus (5 points)
  maxScore += 5;

  if ((decisionStyle === 1 && metadata.skills.analytical >= 7) ||
      (decisionStyle === 2 && metadata.skills.creative >= 7) ||
      (decisionStyle === 3 && metadata.skills.social >= 7)) {
    totalScore += 5;
  }

  // 6. Text match bonus (up to 10 points)
  const assessmentTokens = getAssessmentTokens(assessment);
  const occupationTokens = getOccupationTokens(occupation);

  if (assessmentTokens.length > 0 && occupationTokens.length > 0) {
    maxScore += TEXT_MATCH_WEIGHT;

    // Build a set of stemmed occupation tokens for partial matching
    const occupationStemMap = new Map<string, string>();
    for (const token of occupationTokens) {
      occupationStemMap.set(token, stem(token));
    }
    const occupationTokenSet = new Set(occupationTokens);
    const occupationStemSet = new Set(occupationStemMap.values());

    const matchedTokens: string[] = [];
    for (const token of assessmentTokens) {
      // Exact match first
      if (occupationTokenSet.has(token)) {
        matchedTokens.push(token);
      // Stem match: "development" → "develop", "developers" → "develop"
      } else if (occupationStemSet.has(stem(token))) {
        matchedTokens.push(token);
      }
    }
    const uniqueMatches = Array.from(new Set(matchedTokens));

    if (uniqueMatches.length >= 3) {
      totalScore += TEXT_MATCH_WEIGHT;
      reasons.push(`Keyword match: ${uniqueMatches.slice(0, 3).join(', ')}`);
    } else if (uniqueMatches.length === 2) {
      totalScore += 7;
      reasons.push(`Keyword match: ${uniqueMatches.join(', ')}`);
    } else if (uniqueMatches.length === 1) {
      totalScore += 4;
      reasons.push(`Keyword match: ${uniqueMatches[0]}`);
    }
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  return { score: percentage, reasons };
}

function formatClusterName(cluster: string): string {
  const names: Record<string, string> = {
    stem: 'STEM',
    arts: 'Arts & Creative',
    communication: 'Communication',
    business: 'Business',
    healthcare: 'Healthcare',
    trades: 'Skilled Trades',
    socialServices: 'Social Services',
    law: 'Law & Legal',
  };
  return names[cluster] || cluster;
}

/**
 * Server function to fetch career matches based on assessment results
 * Returns paginated, scored, and filtered career matches
 */
export const fetchCareerMatches = createServerFn({ method: 'POST' })
  .inputValidator((input: CareerMatchParams) => input)
  .handler(async ({ data: params }) => {
    // Use getSpecificOccupations to exclude category headers (-0000 codes)
    const specificOccupations = getSpecificOccupations();

    // Calculate match scores for all occupations
    const scoredMatches: CareerMatch[] = specificOccupations
      .map((occupation) => {
        const { score, reasons } = calculateMatchScore(occupation, params.assessment);
        return {
          ...occupation,
          matchScore: score,
          matchReasons: reasons,
        };
      })
      .filter((match) => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    // Apply threshold filter
    const topScore = scoredMatches[0]?.matchScore || 0;
    const minThreshold = Math.max(40, topScore - 20);
    const filteredMatches = scoredMatches.filter(m => m.matchScore >= minThreshold);

    // Paginate results
    const paginatedMatches = filteredMatches.slice(params.offset, params.offset + params.limit);

    return {
      matches: paginatedMatches,
      total: filteredMatches.length,
      hasMore: params.offset + params.limit < filteredMatches.length,
    };
  });

/**
 * Pagination and filtering parameters
 */
export interface OccupationQueryParams {
  page: number;
  pageSize: number;
  sortBy?: keyof Occupation;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  educationLevel?: string[];
  minSalary?: number;
  maxSalary?: number;
  county?: string;
  socCategory?: string; // 2-digit SOC prefix like "15" for Computer & Mathematical
}

/**
 * Paginated response structure
 */
export interface PaginatedOccupations {
  data: Occupation[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Server function to fetch paginated occupation data
 * This runs on the server and only sends the requested page to the client
 */
export const fetchPaginatedOccupations = createServerFn({ method: 'GET' })
  .inputValidator((input: OccupationQueryParams) => input)
  .handler(async ({ data: params }) => {

  // Use getSpecificOccupations to exclude category headers (-0000 codes)
  let allOccupations = getSpecificOccupations();

  // Apply SOC category filter (filter by 2-digit prefix)
  if (params.socCategory) {
    allOccupations = allOccupations.filter(occ =>
      occ.socCode.startsWith(params.socCategory + '-')
    );
  }

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    allOccupations = allOccupations.filter(occ =>
      occ.title.toLowerCase().includes(searchLower) ||
      occ.socCode.includes(searchLower)
    );
  }

  // Apply county filter - only show occupations with data for the selected county
  if (params.county && params.county !== 'All') {
    allOccupations = allOccupations.filter(occ =>
      occ.wages.byCounty.some(countyData => countyData.county === params.county)
    );
  }

  // Apply education level filter
  if (params.educationLevel && params.educationLevel.length > 0) {
    allOccupations = allOccupations.filter(occ =>
      params.educationLevel!.includes(occ.educationLevel)
    );
  }

  // Apply salary range filter
  if (params.minSalary !== undefined || params.maxSalary !== undefined) {
    allOccupations = allOccupations.filter(occ => {
      const median = occ.wages.statewide.annual.median;
      if (!median) return false;

      if (params.minSalary !== undefined && median < params.minSalary) return false;
      if (params.maxSalary !== undefined && median > params.maxSalary) return false;

      return true;
    });
  }

  // Apply sorting
  if (params.sortBy) {
    allOccupations.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Custom sorting for entrySalary and medianSalary columns
      if (params.sortBy === 'entrySalary') {
        // Use selected county if provided, else statewide
        const getEntry = (occ: Occupation) => {
          if (params.county && params.county !== 'All') {
            const countyData = occ.wages.byCounty.find(c => c.county === params.county);
            return countyData?.wages.annual.entry ?? occ.wages.statewide.annual.entry;
          }
          return occ.wages.statewide.annual.entry;
        };
        aValue = getEntry(a);
        bValue = getEntry(b);
      } else if (params.sortBy === 'medianSalary') {
        const getMedian = (occ: Occupation) => {
          if (params.county && params.county !== 'All') {
            const countyData = occ.wages.byCounty.find(c => c.county === params.county);
            return countyData?.wages.annual.median ?? occ.wages.statewide.annual.median;
          }
          return occ.wages.statewide.annual.median;
        };
        aValue = getMedian(a);
        bValue = getMedian(b);
      } else if (params.sortBy === 'wages') {
        aValue = a.wages.statewide.annual.median || 0;
        bValue = b.wages.statewide.annual.median || 0;
      } else {
        aValue = a[params.sortBy as keyof Occupation];
        bValue = b[params.sortBy as keyof Occupation];
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }

  // Calculate pagination
  const totalCount = allOccupations.length;
  const totalPages = Math.ceil(totalCount / params.pageSize);
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedData = allOccupations.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPreviousPage: params.page > 1,
    },
  };
  });

/**
 * Server function to get all available Pennsylvania counties
 */
export const getAvailableCounties = createServerFn().handler(() => {
  return getCountiesList();
});

/**
 * Server function to get unique education levels for filter options
 */
export const getEducationLevelOptions = createServerFn().handler(() => {
  const educationMap: Record<string, string> = {
    'ND': 'No formal credential',
    'HS': 'High school diploma',
    'PS': 'Postsecondary certificate',
    'SC': 'Some college',
    'AD': "Associate's degree",
    'BD': "Bachelor's degree",
    'BD+': "Bachelor's degree or higher",
    'MD': "Master's degree",
    'DD': 'Doctoral degree',
    '#': 'Varies',
  };

  const levels = new Set<string>();
  getAllOccupations().forEach(occ => levels.add(occ.educationLevel));

  return Array.from(levels)
    .sort()
    .map(level => ({
      value: level,
      label: educationMap[level] || level,
    }));
});

/**
 * Server function to get salary range boundaries for slider filters
 */
export const getSalaryRangeBoundaries = createServerFn().handler(() => {
  const occupations = getAllOccupations();
  const salaries = occupations
    .map(occ => occ.wages.statewide.annual.median)
    .filter((salary): salary is number => salary !== null);

  return {
    min: Math.min(...salaries),
    max: Math.max(...salaries),
  };
});

/**
 * Server function to fetch all occupations for career matching
 */
export const fetchAllOccupations = createServerFn({ method: 'GET' }).handler(() => {
  return getAllOccupations();
});

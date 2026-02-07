/**
 * Occupation Metadata Mapping
 * Maps SOC codes and occupation titles to assessment-related metadata
 * This enables correlation between career assessments and job recommendations
 */

import type { OccupationMetadata } from '../src/types/wages.js';

/**
 * Generate metadata based on SOC code and occupation title
 * Uses pattern matching and keywords to classify occupations
 */
export function generateOccupationMetadata(
  socCode: string,
  title: string
): OccupationMetadata | undefined {
  const titleLower = title.toLowerCase();
  const socMajorGroup = socCode.split('-')[0]; // First 2 digits

  // Default metadata structure
  const metadata: Partial<OccupationMetadata> = {
    keywords: [],
    outlook: {
      growth: 'stable',
      automationRisk: 'medium',
    },
  };

  // SOC Major Groups classification
  // https://www.bls.gov/soc/2018/major_groups.htm

  // 11-XXXX: Management Occupations
  if (socMajorGroup === '11') {
    Object.assign(metadata, {
      careerCluster: 'business',
      workEnvironment: {
        setting: ['office', 'remote'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'sedentary',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 8,
        creative: 6,
        social: 8,
        technical: 5,
        leadership: 10,
        physical: 2,
        detail: 7,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'moderate',
        variety: 'high_variety',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['leadership', 'financial_security', 'advancement', 'prestige'],
    });
  }

  // 13-XXXX: Business and Financial Operations
  else if (socMajorGroup === '13') {
    Object.assign(metadata, {
      careerCluster: 'business',
      workEnvironment: {
        setting: ['office', 'remote'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'sedentary',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 9,
        creative: 5,
        social: 6,
        technical: 7,
        leadership: 5,
        physical: 2,
        detail: 9,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'moderate',
        peopleInteraction: 'moderate',
      },
      values: ['problem_solving', 'financial_security', 'stability'],
    });
  }

  // 15-XXXX: Computer and Mathematical
  else if (socMajorGroup === '15') {
    Object.assign(metadata, {
      careerCluster: 'stem',
      secondaryClusters: ['business'],
      workEnvironment: {
        setting: ['office', 'remote'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'sedentary',
        travelRequired: 'none',
      },
      skills: {
        analytical: 10,
        creative: 7,
        social: 4,
        technical: 10,
        leadership: 4,
        physical: 1,
        detail: 9,
      },
      workStyle: {
        independence: 'independent',
        structure: 'flexible',
        variety: 'high_variety',
        pace: 'fast_paced',
        peopleInteraction: 'minimal',
      },
      values: ['problem_solving', 'innovation', 'financial_security', 'independence'],
      outlook: {
        growth: 'much_faster_than_average',
        automationRisk: 'low',
      },
    });
  }

  // 17-XXXX: Architecture and Engineering
  else if (socMajorGroup === '17') {
    Object.assign(metadata, {
      careerCluster: 'stem',
      workEnvironment: {
        setting: ['office', 'field', 'laboratory'],
        schedule: ['standard'],
        physicalDemands: 'light',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 9,
        creative: 8,
        social: 5,
        technical: 10,
        leadership: 5,
        physical: 3,
        detail: 9,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'highly_structured',
        variety: 'moderate',
        pace: 'methodical',
        peopleInteraction: 'moderate',
      },
      values: ['problem_solving', 'innovation', 'financial_security'],
    });
  }

  // 19-XXXX: Life, Physical, and Social Science
  else if (socMajorGroup === '19') {
    Object.assign(metadata, {
      careerCluster: 'stem',
      workEnvironment: {
        setting: ['laboratory', 'office', 'field'],
        schedule: ['standard'],
        physicalDemands: 'light',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 10,
        creative: 7,
        social: 5,
        technical: 8,
        leadership: 4,
        physical: 4,
        detail: 9,
      },
      workStyle: {
        independence: 'independent',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'methodical',
        peopleInteraction: 'minimal',
      },
      values: ['problem_solving', 'innovation', 'service'],
    });
  }

  // 21-XXXX: Community and Social Service
  else if (socMajorGroup === '21') {
    Object.assign(metadata, {
      careerCluster: 'socialServices',
      workEnvironment: {
        setting: ['office', 'field', 'school'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'light',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 6,
        creative: 5,
        social: 10,
        technical: 3,
        leadership: 6,
        physical: 3,
        detail: 7,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'moderate',
        variety: 'high_variety',
        pace: 'moderate',
        peopleInteraction: 'extensive',
      },
      values: ['helping_others', 'service', 'variety'],
    });
  }

  // 23-XXXX: Legal Occupations
  else if (socMajorGroup === '23') {
    Object.assign(metadata, {
      careerCluster: 'law',
      workEnvironment: {
        setting: ['office'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'sedentary',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 10,
        creative: 7,
        social: 8,
        technical: 5,
        leadership: 7,
        physical: 1,
        detail: 10,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'highly_structured',
        variety: 'moderate',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['problem_solving', 'prestige', 'financial_security', 'service'],
    });
  }

  // 25-XXXX: Educational Instruction and Library
  else if (socMajorGroup === '25') {
    Object.assign(metadata, {
      careerCluster: 'socialServices',
      secondaryClusters: ['communication'],
      workEnvironment: {
        setting: ['school', 'office'],
        schedule: ['standard'],
        physicalDemands: 'light',
        travelRequired: 'none',
      },
      skills: {
        analytical: 7,
        creative: 8,
        social: 10,
        technical: 5,
        leadership: 7,
        physical: 3,
        detail: 6,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'moderate',
        peopleInteraction: 'extensive',
      },
      values: ['helping_others', 'service', 'work_life_balance', 'stability'],
    });
  }

  // 27-XXXX: Arts, Design, Entertainment, Sports, and Media
  else if (socMajorGroup === '27') {
    Object.assign(metadata, {
      careerCluster: 'arts',
      secondaryClusters: ['communication'],
      workEnvironment: {
        setting: ['office', 'remote', 'field'],
        schedule: ['flexible'],
        physicalDemands: 'light',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 5,
        creative: 10,
        social: 6,
        technical: 6,
        leadership: 4,
        physical: 4,
        detail: 7,
      },
      workStyle: {
        independence: 'independent',
        structure: 'flexible',
        variety: 'high_variety',
        pace: 'moderate',
        peopleInteraction: 'moderate',
      },
      values: ['creativity', 'independence', 'variety', 'innovation'],
    });
  }

  // 29-XXXX: Healthcare Practitioners and Technical
  else if (socMajorGroup === '29') {
    Object.assign(metadata, {
      careerCluster: 'healthcare',
      workEnvironment: {
        setting: ['hospital', 'office'],
        schedule: ['shift', 'oncall'],
        physicalDemands: 'medium',
        travelRequired: 'none',
      },
      skills: {
        analytical: 8,
        creative: 5,
        social: 9,
        technical: 9,
        leadership: 6,
        physical: 6,
        detail: 9,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'highly_structured',
        variety: 'moderate',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['helping_others', 'financial_security', 'service'],
      outlook: {
        growth: 'much_faster_than_average',
        automationRisk: 'low',
      },
    });
  }

  // 31-XXXX: Healthcare Support
  else if (socMajorGroup === '31') {
    Object.assign(metadata, {
      careerCluster: 'healthcare',
      workEnvironment: {
        setting: ['hospital', 'office'],
        schedule: ['shift', 'oncall'],
        physicalDemands: 'medium',
        travelRequired: 'none',
      },
      skills: {
        analytical: 5,
        creative: 3,
        social: 9,
        technical: 6,
        leadership: 3,
        physical: 7,
        detail: 7,
      },
      workStyle: {
        independence: 'team',
        structure: 'highly_structured',
        variety: 'routine',
        pace: 'moderate',
        peopleInteraction: 'extensive',
      },
      values: ['helping_others', 'service', 'stability'],
      outlook: {
        growth: 'growing',
        automationRisk: 'low',
      },
    });
  }

  // 33-XXXX: Protective Service
  else if (socMajorGroup === '33') {
    Object.assign(metadata, {
      careerCluster: 'socialServices',
      workEnvironment: {
        setting: ['field', 'office'],
        schedule: ['shift', 'oncall'],
        physicalDemands: 'heavy',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 7,
        creative: 4,
        social: 7,
        technical: 6,
        leadership: 7,
        physical: 9,
        detail: 7,
      },
      workStyle: {
        independence: 'team',
        structure: 'highly_structured',
        variety: 'high_variety',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['service', 'helping_others', 'stability'],
    });
  }

  // 35-XXXX: Food Preparation and Serving
  else if (socMajorGroup === '35') {
    Object.assign(metadata, {
      careerCluster: 'business',
      workEnvironment: {
        setting: ['retail', 'office'],
        schedule: ['shift', 'evening', 'weekend'],
        physicalDemands: 'medium',
        travelRequired: 'none',
      },
      skills: {
        analytical: 3,
        creative: 5,
        social: 8,
        technical: 4,
        leadership: 4,
        physical: 7,
        detail: 6,
      },
      workStyle: {
        independence: 'team',
        structure: 'moderate',
        variety: 'routine',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['work_life_balance', 'variety'],
    });
  }

  // 37-XXXX: Building and Grounds Cleaning and Maintenance
  else if (socMajorGroup === '37') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['field', 'outdoor'],
        schedule: ['standard', 'flexible'],
        physicalDemands: 'heavy',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 4,
        creative: 4,
        social: 4,
        technical: 6,
        leadership: 3,
        physical: 9,
        detail: 6,
      },
      workStyle: {
        independence: 'independent',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'methodical',
        peopleInteraction: 'minimal',
      },
      values: ['independence', 'stability', 'work_life_balance'],
    });
  }

  // 39-XXXX: Personal Care and Service
  else if (socMajorGroup === '39') {
    Object.assign(metadata, {
      careerCluster: 'socialServices',
      workEnvironment: {
        setting: ['office', 'field'],
        schedule: ['flexible'],
        physicalDemands: 'medium',
        travelRequired: 'occasional',
      },
      skills: {
        analytical: 4,
        creative: 6,
        social: 9,
        technical: 4,
        leadership: 4,
        physical: 6,
        detail: 6,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'moderate',
        variety: 'high_variety',
        pace: 'moderate',
        peopleInteraction: 'extensive',
      },
      values: ['helping_others', 'variety', 'independence'],
    });
  }

  // 41-XXXX: Sales and Related
  else if (socMajorGroup === '41') {
    Object.assign(metadata, {
      careerCluster: 'business',
      secondaryClusters: ['communication'],
      workEnvironment: {
        setting: ['office', 'retail', 'remote'],
        schedule: ['flexible'],
        physicalDemands: 'light',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 6,
        creative: 7,
        social: 10,
        technical: 5,
        leadership: 5,
        physical: 4,
        detail: 6,
      },
      workStyle: {
        independence: 'independent',
        structure: 'flexible',
        variety: 'high_variety',
        pace: 'fast_paced',
        peopleInteraction: 'extensive',
      },
      values: ['financial_security', 'independence', 'variety'],
    });
  }

  // 43-XXXX: Office and Administrative Support
  else if (socMajorGroup === '43') {
    Object.assign(metadata, {
      careerCluster: 'business',
      workEnvironment: {
        setting: ['office', 'remote'],
        schedule: ['standard'],
        physicalDemands: 'sedentary',
        travelRequired: 'none',
      },
      skills: {
        analytical: 5,
        creative: 4,
        social: 6,
        technical: 6,
        leadership: 3,
        physical: 2,
        detail: 9,
      },
      workStyle: {
        independence: 'mixed',
        structure: 'highly_structured',
        variety: 'routine',
        pace: 'moderate',
        peopleInteraction: 'moderate',
      },
      values: ['stability', 'work_life_balance'],
      outlook: {
        growth: 'declining',
        automationRisk: 'high',
      },
    });
  }

  // 45-XXXX: Farming, Fishing, and Forestry
  else if (socMajorGroup === '45') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['outdoor', 'field'],
        schedule: ['standard', 'shift'],
        physicalDemands: 'veryHeavy',
        travelRequired: 'none',
      },
      skills: {
        analytical: 5,
        creative: 4,
        social: 3,
        technical: 6,
        leadership: 4,
        physical: 10,
        detail: 6,
      },
      workStyle: {
        independence: 'independent',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'methodical',
        peopleInteraction: 'minimal',
      },
      values: ['independence', 'stability'],
    });
  }

  // 47-XXXX: Construction and Extraction
  else if (socMajorGroup === '47') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['outdoor', 'field'],
        schedule: ['standard'],
        physicalDemands: 'veryHeavy',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 6,
        creative: 5,
        social: 5,
        technical: 8,
        leadership: 5,
        physical: 10,
        detail: 7,
      },
      workStyle: {
        independence: 'team',
        structure: 'moderate',
        variety: 'moderate',
        pace: 'moderate',
        peopleInteraction: 'moderate',
      },
      values: ['financial_security', 'independence'],
      outlook: {
        growth: 'stable',
        automationRisk: 'medium',
      },
    });
  }

  // 49-XXXX: Installation, Maintenance, and Repair
  else if (socMajorGroup === '49') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['field', 'warehouse'],
        schedule: ['standard', 'oncall'],
        physicalDemands: 'heavy',
        travelRequired: 'frequent',
      },
      skills: {
        analytical: 7,
        creative: 5,
        social: 5,
        technical: 9,
        leadership: 4,
        physical: 8,
        detail: 8,
      },
      workStyle: {
        independence: 'independent',
        structure: 'moderate',
        variety: 'high_variety',
        pace: 'moderate',
        peopleInteraction: 'minimal',
      },
      values: ['problem_solving', 'independence', 'variety'],
    });
  }

  // 51-XXXX: Production Occupations
  else if (socMajorGroup === '51') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['warehouse', 'office'],
        schedule: ['shift'],
        physicalDemands: 'medium',
        travelRequired: 'none',
      },
      skills: {
        analytical: 5,
        creative: 4,
        social: 4,
        technical: 7,
        leadership: 3,
        physical: 8,
        detail: 8,
      },
      workStyle: {
        independence: 'team',
        structure: 'highly_structured',
        variety: 'routine',
        pace: 'moderate',
        peopleInteraction: 'minimal',
      },
      values: ['stability', 'financial_security'],
      outlook: {
        growth: 'declining',
        automationRisk: 'high',
      },
    });
  }

  // 53-XXXX: Transportation and Material Moving
  else if (socMajorGroup === '53') {
    Object.assign(metadata, {
      careerCluster: 'trades',
      workEnvironment: {
        setting: ['field', 'warehouse'],
        schedule: ['shift'],
        physicalDemands: 'medium',
        travelRequired: 'constant',
      },
      skills: {
        analytical: 4,
        creative: 3,
        social: 4,
        technical: 6,
        leadership: 3,
        physical: 7,
        detail: 7,
      },
      workStyle: {
        independence: 'independent',
        structure: 'highly_structured',
        variety: 'routine',
        pace: 'methodical',
        peopleInteraction: 'minimal',
      },
      values: ['independence', 'stability'],
    });
  }

  // Generate keywords from title
  metadata.keywords = titleLower
    .split(/[\s,]+/)
    .filter(word => word.length > 3)
    .slice(0, 10);

  return metadata as OccupationMetadata;
}

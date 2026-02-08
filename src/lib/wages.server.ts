import type { Occupation, CountyWageData, SalaryNegotiationData } from '@/types/wages';

// Import the processed occupation data
// Note: This will be loaded at build time - for 810 occupations it's ~2-3MB
// This is a server-only file to keep the data off the client bundle
import occupationsData from '../data/occupations.json';

/**
 * Check if an occupation is a category header (SOC codes ending in -0000)
 * These are summary categories, not specific job titles
 */
export function isCategoryHeader(occupation: Occupation): boolean {
  return occupation.socCode.endsWith('-0000');
}

/**
 * Check if an occupation is a category header by SOC code
 */
export function isCategoryHeaderCode(socCode: string): boolean {
  return socCode.endsWith('-0000');
}

/**
 * Get all occupations (includes category headers)
 */
export function getAllOccupations(): Occupation[] {
  return occupationsData as Occupation[];
}

/**
 * Get all specific occupations (excludes category headers ending in -0000)
 * Use this for career matching and browsing actual job titles
 */
export function getSpecificOccupations(): Occupation[] {
  return getAllOccupations().filter(occ => !isCategoryHeader(occ));
}

/**
 * Get all category headers (occupations ending in -0000)
 * These represent major occupation groups and contain aggregate wage data
 */
export function getCategoryOccupations(): Occupation[] {
  return getAllOccupations().filter(isCategoryHeader);
}

/**
 * Get occupation by SOC code
 */
export function getOccupationByCode(socCode: string): Occupation | undefined {
  return getAllOccupations().find(occ => occ.socCode === socCode);
}

/**
 * Get occupation by ID
 */
export function getOccupationById(id: string): Occupation | undefined {
  return getAllOccupations().find(occ => occ.id === id);
}

/**
 * Search occupations by title
 */
export function searchOccupations(query: string): Occupation[] {
  const lowerQuery = query.toLowerCase();
  return getAllOccupations().filter(occ =>
    occ.title.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter occupations by education level
 */
export function getOccupationsByEducation(educationLevel: string | string[]): Occupation[] {
  const levels = Array.isArray(educationLevel) ? educationLevel : [educationLevel];
  return getAllOccupations().filter(occ =>
    levels.includes(occ.educationLevel)
  );
}

/**
 * Get occupations by salary range (annual)
 * @param minSalary - Minimum annual salary
 * @param maxSalary - Maximum annual salary (optional)
 */
export function getOccupationsBySalaryRange(
  minSalary: number,
  maxSalary?: number
): Occupation[] {
  return getAllOccupations().filter(occ => {
    const median = occ.wages.statewide.annual.median;
    if (!median) return false;

    if (maxSalary) {
      return median >= minSalary && median <= maxSalary;
    }
    return median >= minSalary;
  });
}

/**
 * Get wage data for a specific county
 */
export function getCountyWageData(
  occupation: Occupation,
  county: string
): CountyWageData | undefined {
  return occupation.wages.byCounty.find(
    c => c.county.toLowerCase() === county.toLowerCase()
  );
}

/**
 * Get all available counties
 */
export function getAvailableCounties(): string[] {
  const counties = new Set<string>();
  getAllOccupations().forEach(occ => {
    occ.wages.byCounty.forEach(county => {
      counties.add(county.county);
    });
  });
  return Array.from(counties).sort();
}

/**
 * Calculate salary negotiation data
 * Helps users understand where they stand in the wage distribution
 */
export function getSalaryNegotiationData(
  occupationId: string,
  county: string | 'statewide',
  experienceLevel: 'entry' | 'mid' | 'experienced'
): SalaryNegotiationData | null {
  const occupation = getOccupationById(occupationId);
  if (!occupation) return null;

  const isStatewide = county === 'statewide';
  const wages = isStatewide
    ? occupation.wages.statewide
    : getCountyWageData(occupation, county)?.wages;

  if (!wages) return null;

  // Determine target salary based on experience
  let targetSalary: number | null = null;
  let salaryRange = { low: 0, mid: 0, high: 0 };

  switch (experienceLevel) {
    case 'entry':
      targetSalary = wages.annual.entry;
      salaryRange = {
        low: wages.annual.entry || wages.annual.min || 0,
        mid: wages.annual.median || 0,
        high: wages.annual.average || 0,
      };
      break;
    case 'mid':
      targetSalary = wages.annual.median;
      salaryRange = {
        low: wages.annual.midRangeLow || wages.annual.entry || 0,
        mid: wages.annual.median || 0,
        high: wages.annual.midRangeHigh || wages.annual.average || 0,
      };
      break;
    case 'experienced':
      targetSalary = wages.annual.experienced;
      salaryRange = {
        low: wages.annual.average || 0,
        mid: wages.annual.experienced || 0,
        high: wages.annual.max || 0,
      };
      break;
  }

  if (!targetSalary) return null;

  // Generate insights
  const insights: string[] = [];

  const statewideMedian = occupation.wages.statewide.annual.median || 0;
  const countyMedian = wages.annual.median || 0;

  if (!isStatewide && countyMedian > statewideMedian) {
    const diff = ((countyMedian - statewideMedian) / statewideMedian * 100).toFixed(0);
    insights.push(`${county} County pays ${diff}% above state average for this role`);
  } else if (!isStatewide && countyMedian < statewideMedian) {
    const diff = ((statewideMedian - countyMedian) / statewideMedian * 100).toFixed(0);
    insights.push(`${county} County pays ${diff}% below state average for this role`);
  }

  if (experienceLevel === 'experienced' && wages.annual.experienced) {
    insights.push('With experience, you can earn significantly more than entry-level');
  }

  if (wages.annual.max && targetSalary) {
    const growthPotential = ((wages.annual.max - targetSalary) / targetSalary * 100).toFixed(0);
    insights.push(`${growthPotential}% growth potential in this career`);
  }

  return {
    occupationId: occupation.id,
    title: occupation.title,
    location: isStatewide ? 'Pennsylvania (Statewide)' : `${county} County, PA`,
    experienceLevel,
    targetSalary,
    salaryRange,
    countyMedian,
    statewideMedian,
    percentile: targetSalary && salaryRange.high
      ? Math.round((targetSalary / salaryRange.high) * 100)
      : undefined,
    insights
  };
}

/**
 * Get top paying occupations
 */
export function getTopPayingOccupations(limit = 10): Occupation[] {
  return getAllOccupations()
    .filter(occ => occ.wages.statewide.annual.median)
    .sort((a, b) => {
      const aMedian = a.wages.statewide.annual.median || 0;
      const bMedian = b.wages.statewide.annual.median || 0;
      return bMedian - aMedian;
    })
    .slice(0, limit);
}

/**
 * Get occupations grouped by major SOC category
 * SOC codes are organized: XX-XXXX where first 2 digits are major group
 */
export function getOccupationsByMajorGroup(): Map<string, Occupation[]> {
  const majorGroups = new Map<string, Occupation[]>();

  const groupNames: Record<string, string> = {
    '11': 'Management',
    '13': 'Business & Financial',
    '15': 'Computer & Mathematical',
    '17': 'Architecture & Engineering',
    '19': 'Life, Physical, & Social Science',
    '21': 'Community & Social Service',
    '23': 'Legal',
    '25': 'Education',
    '27': 'Arts, Design, Sports & Media',
    '29': 'Healthcare Practitioners',
    '31': 'Healthcare Support',
    '33': 'Protective Service',
    '35': 'Food Preparation & Serving',
    '37': 'Building & Grounds Maintenance',
    '39': 'Personal Care & Service',
    '41': 'Sales',
    '43': 'Office & Administrative Support',
    '45': 'Farming, Fishing, & Forestry',
    '47': 'Construction & Extraction',
    '49': 'Installation, Maintenance, & Repair',
    '51': 'Production',
    '53': 'Transportation & Material Moving',
  };

  getAllOccupations().forEach(occ => {
    const majorCode = occ.socCode.substring(0, 2);
    const groupName = groupNames[majorCode] || `Group ${majorCode}`;

    if (!majorGroups.has(groupName)) {
      majorGroups.set(groupName, []);
    }
    majorGroups.get(groupName)?.push(occ);
  });

  return majorGroups;
}

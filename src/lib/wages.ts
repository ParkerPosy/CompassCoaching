/**
 * Client-safe formatting utilities for wages
 * Data-loading functions are in wages.server.ts to keep the ~2-3MB occupation data off the client bundle
 */

/**
 * SOC Major Group Categories
 * These are the 2-digit prefixes used to categorize occupations
 */
export const SOC_CATEGORIES = [
  { code: '11', label: 'Management' },
  { code: '13', label: 'Business & Financial Operations' },
  { code: '15', label: 'Computer & Mathematical' },
  { code: '17', label: 'Architecture & Engineering' },
  { code: '19', label: 'Life, Physical & Social Science' },
  { code: '21', label: 'Community & Social Service' },
  { code: '23', label: 'Legal' },
  { code: '25', label: 'Educational Instruction & Library' },
  { code: '27', label: 'Arts, Design, Entertainment & Sports' },
  { code: '29', label: 'Healthcare Practitioners & Technical' },
  { code: '31', label: 'Healthcare Support' },
  { code: '33', label: 'Protective Service' },
  { code: '35', label: 'Food Preparation & Serving' },
  { code: '37', label: 'Building & Grounds Maintenance' },
  { code: '39', label: 'Personal Care & Service' },
  { code: '41', label: 'Sales & Related' },
  { code: '43', label: 'Office & Administrative Support' },
  { code: '45', label: 'Farming, Fishing & Forestry' },
  { code: '47', label: 'Construction & Extraction' },
  { code: '49', label: 'Installation, Maintenance & Repair' },
  { code: '51', label: 'Production' },
  { code: '53', label: 'Transportation & Material Moving' },
] as const;

/**
 * Check if a SOC code is a category header (ending in -0000)
 * These are summary categories, not specific job titles
 */
export function isCategoryHeaderCode(socCode: string): boolean {
  return socCode.endsWith('-0000');
}

/**
 * Format education level for display
 */
export function formatEducationLevel(level: string): string {
  const educationMap: Record<string, string> = {
    'ND': 'No formal credential',
    'HS': 'High school diploma',
    'PS': 'Postsecondary certificate',
    'PS+': 'Postsecondary certificate+',
    'SC': 'Some college',
    'AD': 'Associate\'s degree',
    'AD+': 'Associate\'s degree+',
    'BD': 'Bachelor\'s degree',
    'BD+': 'Bachelor\'s degree+',
    'MD': 'Master\'s degree',
    'MD+': 'Master\'s degree+',
    'DD': 'Doctoral degree',
    'DOCT': 'Doctorate',
    'ST OJT': 'Short-term OJT',
    'MT OJT': 'Moderate-term OJT',
    'LT OJT': 'Long-term OJT',
    'WK EXP': 'Work experience',
    '#': 'Varies'
  };
  return educationMap[level] || level;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

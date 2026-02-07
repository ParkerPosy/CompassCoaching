import { createServerFn } from '@tanstack/react-start';
import type { Occupation } from '@/types/wages';
import { getAllOccupations, getAvailableCounties as getCountiesList } from './wages';

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

  let allOccupations = getAllOccupations();

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

      // Handle nested property access for wages
      if (params.sortBy === 'wages') {
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

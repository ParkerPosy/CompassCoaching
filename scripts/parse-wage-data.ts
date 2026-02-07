import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { OccupationWageRaw, Occupation, WageRange, CountyWageData, EducationLevel, AreaType } from '../src/types/wages.js';
import { generateOccupationMetadata } from './occupation-metadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'pa-wage-data.json');
const OUTPUT_OCCUPATIONS_FILE = path.join(DATA_DIR, 'occupations.json');

interface RawWageRow {
  'SOC Code': string;
  'Occupational Title': string;
  'Educ. Level': string;
  'Area Type': string;
  'Average Hourly Wage ($)': number | string;
  'Average Annual Wage ($)': number | string;
  'Median Annual Wage ($)': number | string;
  'Entry Annual Wage ($)': number | string;
  'Exper\'d Annual\nWage ($)': number | string;
  'Mid Range\nAnnual Wage ($)': number | string;
  '__EMPTY': string;
  '__EMPTY_1': number | string;
}

/**
 * Extract county name from filename
 * Examples: adamsco_ow.xls -> Adams, centco_ow.xls -> Centre, daupco_ow.xls -> Dauphin
 */
function extractCountyName(filename: string): string {
  // Special case mappings for counties with non-standard names
  const countyMap: Record<string, string> = {
    'adamsco': 'Adams',
    'allegco': 'Allegheny',
    'armco': 'Armstrong',
    'beavco': 'Beaver',
    'bedco': 'Bedford',
    'berksco': 'Berks',
    'blairco': 'Blair',
    'bradco': 'Bradford',
    'bucksco': 'Bucks',
    'butlerco': 'Butler',
    'cambco': 'Cambria',
    'cameco': 'Cameron',
    'carbco': 'Carbon',
    'centco': 'Centre',
    'chesco': 'Chester',
    'clarco': 'Clarion',
    'clearco': 'Clearfield',
    'clinco': 'Clinton',
    'coluco': 'Columbia',
    'crawco': 'Crawford',
    'cumbco': 'Cumberland',
    'daupco': 'Dauphin',
    'delaco': 'Delaware',
    'elkco': 'Elk',
    'erieco': 'Erie',
    'fayco': 'Fayette',
    'forestco': 'Forest',
    'frankco': 'Franklin',
    'fultco': 'Fulton',
    'greeneco': 'Greene',
    'huntco': 'Huntingdon',
    'indco': 'Indiana',
    'jeffco': 'Jefferson',
    'junco': 'Juniata',
    'lackco': 'Lackawanna',
    'lancco': 'Lancaster',
    'lawrco': 'Lawrence',
    'lebco': 'Lebanon',
    'lehighco': 'Lehigh',
    'luzco': 'Luzerne',
    'lycoco': 'Lycoming',
    'mckeanco': 'McKean',
    'mercerco': 'Mercer',
    'miffco': 'Mifflin',
    'monroeco': 'Monroe',
    'montgco': 'Montgomery',
    'montoco': 'Montour',
    'northamco': 'Northampton',
    'northumco': 'Northumberland',
    'perryco': 'Perry',
    'philaco': 'Philadelphia',
    'pikeco': 'Pike',
    'potterco': 'Potter',
    'schuyco': 'Schuylkill',
    'snyderco': 'Snyder',
    'somerco': 'Somerset',
    'sullco': 'Sullivan',
    'susqco': 'Susquehanna',
    'tiogaco': 'Tioga',
    'unionco': 'Union',
    'venco': 'Venango',
    'warrenco': 'Warren',
    'washco': 'Washington',
    'wayneco': 'Wayne',
    'westco': 'Westmoreland',
    'wyomco': 'Wyoming',
    'yorkco': 'York',
  };

  const key = filename.replace('_ow.xls', '').toLowerCase();

  // Return mapped name if exists, otherwise capitalize first letter
  return countyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Parse wage value - handles numbers, "*", "#", and null
 */
function parseWageValue(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  if (value === '*' || value === '#' || value === '') return null;

  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse education level code
 */
function parseEducationLevel(code: string): EducationLevel {
  const normalized = code.trim().toUpperCase();
  const validCodes: EducationLevel[] = ['ND', 'HS', 'PS', 'SC', 'AD', 'BD', 'BD+', 'MD', 'DD', '#'];
  return validCodes.includes(normalized as EducationLevel) ? normalized as EducationLevel : '#';
}

/**
 * Parse area type code
 */
function parseAreaType(code: string): AreaType {
  const normalized = code.trim().toUpperCase();
  const validTypes: AreaType[] = ['CTY', 'WDA', 'MSA', 'STW'];
  return validTypes.includes(normalized as AreaType) ? normalized as AreaType : 'CTY';
}

/**
 * Parse a single XLS file
 */
function parseWageFile(filePath: string, county: string, dataDate: string): OccupationWageRaw[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Skip header rows (first 6 rows)
  const data = XLSX.utils.sheet_to_json<RawWageRow>(worksheet, {
    defval: null,
    range: 5
  });

  return data
    .filter(row => row['SOC Code'] && row['SOC Code'] !== '00-0000') // Skip total row
    .map(row => ({
      socCode: row['SOC Code'],
      title: row['Occupational Title'],
      educationLevel: parseEducationLevel(row['Educ. Level']),
      areaType: parseAreaType(row['Area Type']),
      county,
      averageHourlyWage: parseWageValue(row['Average Hourly Wage ($)']),
      averageAnnualWage: parseWageValue(row['Average Annual Wage ($)']),
      medianAnnualWage: parseWageValue(row['Median Annual Wage ($)']),
      entryAnnualWage: parseWageValue(row['Entry Annual Wage ($)']),
      experiencedAnnualWage: parseWageValue(row['Exper\'d Annual\nWage ($)']),
      midRangeLow: parseWageValue(row['Mid Range\nAnnual Wage ($)']),
      midRangeHigh: parseWageValue(row['__EMPTY_1']),
      dataDate
    }));
}

/**
 * Aggregate wage data by occupation across all counties
 */
function aggregateOccupations(rawData: OccupationWageRaw[]): Occupation[] {
  const occupationMap = new Map<string, OccupationWageRaw[]>();

  // Group by SOC code
  for (const record of rawData) {
    const existing = occupationMap.get(record.socCode) || [];
    existing.push(record);
    occupationMap.set(record.socCode, existing);
  }

  // Convert to Occupation objects
  const occupations: Occupation[] = [];

  for (const [socCode, records] of occupationMap.entries()) {
    const firstRecord = records[0];

    // Calculate statewide aggregates
    const validAnnualWages = records
      .map(r => r.averageAnnualWage)
      .filter((w): w is number => w !== null);

    const validMedianWages = records
      .map(r => r.medianAnnualWage)
      .filter((w): w is number => w !== null);

    const validEntryWages = records
      .map(r => r.entryAnnualWage)
      .filter((w): w is number => w !== null);

    const validExpWages = records
      .map(r => r.experiencedAnnualWage)
      .filter((w): w is number => w !== null);

    const validHourlyWages = records
      .map(r => r.averageHourlyWage)
      .filter((w): w is number => w !== null);

    const allAnnualValues = [
      ...validAnnualWages,
      ...validMedianWages,
      ...validEntryWages,
      ...validExpWages
    ];

    const statewideWages: WageRange = {
      hourly: {
        average: validHourlyWages.length > 0
          ? validHourlyWages.reduce((a, b) => a + b, 0) / validHourlyWages.length
          : null,
        min: validHourlyWages.length > 0 ? Math.min(...validHourlyWages) : null,
        max: validHourlyWages.length > 0 ? Math.max(...validHourlyWages) : null,
      },
      annual: {
        average: validAnnualWages.length > 0
          ? validAnnualWages.reduce((a, b) => a + b, 0) / validAnnualWages.length
          : null,
        median: validMedianWages.length > 0
          ? validMedianWages.reduce((a, b) => a + b, 0) / validMedianWages.length
          : null,
        entry: validEntryWages.length > 0
          ? validEntryWages.reduce((a, b) => a + b, 0) / validEntryWages.length
          : null,
        experienced: validExpWages.length > 0
          ? validExpWages.reduce((a, b) => a + b, 0) / validExpWages.length
          : null,
        midRangeLow: null, // Could calculate percentiles here
        midRangeHigh: null,
        min: allAnnualValues.length > 0 ? Math.min(...allAnnualValues) : null,
        max: allAnnualValues.length > 0 ? Math.max(...allAnnualValues) : null,
      }
    };

    // Create county-specific data
    const byCounty: CountyWageData[] = records.map(record => ({
      county: record.county,
      areaType: record.areaType,
      wages: {
        hourly: {
          average: record.averageHourlyWage,
          min: null,
          max: null,
        },
        annual: {
          average: record.averageAnnualWage,
          median: record.medianAnnualWage,
          entry: record.entryAnnualWage,
          experienced: record.experiencedAnnualWage,
          midRangeLow: record.midRangeLow,
          midRangeHigh: record.midRangeHigh,
          min: record.entryAnnualWage,
          max: record.experiencedAnnualWage,
        }
      }
    }));

    const metadata = generateOccupationMetadata(socCode, firstRecord.title);

    occupations.push({
      id: socCode.replace(/-/g, '_'),
      socCode,
      title: firstRecord.title,
      educationLevel: firstRecord.educationLevel,
      wages: {
        statewide: statewideWages,
        byCounty
      },
      metadata
    });
  }

  return occupations.sort((a, b) => a.socCode.localeCompare(b.socCode));
}

/**
 * Main parsing function
 */
function main() {
  console.log('Pennsylvania Wage Data Parser');
  console.log('================================\n');

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.xls'));

  console.log(`Found ${files.length} XLS files`);

  const allWageData: OccupationWageRaw[] = [];
  const dataDate = '2024-05'; // May 2024

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const county = extractCountyName(file);

    console.log(`Processing ${county} County (${file})...`);

    const countyData = parseWageFile(filePath, county, dataDate);
    allWageData.push(...countyData);

    console.log(`  ✓ Parsed ${countyData.length} occupations`);
  }

  console.log(`\nTotal records: ${allWageData.length}`);

  // Save raw data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allWageData, null, 2));
  console.log(`\n✓ Raw data saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);

  // Aggregate and save occupation data
  const occupations = aggregateOccupations(allWageData);
  fs.writeFileSync(OUTPUT_OCCUPATIONS_FILE, JSON.stringify(occupations, null, 2));
  console.log(`✓ Aggregated occupations saved to: ${path.relative(process.cwd(), OUTPUT_OCCUPATIONS_FILE)}`);

  // Summary statistics
  console.log('\n=== Summary ===');
  console.log(`Unique occupations: ${occupations.length}`);
  console.log(`Counties processed: ${files.length}`);
  console.log(`Data date: ${dataDate}`);

  // Sample education level distribution
  const eduLevels = occupations.reduce((acc, occ) => {
    acc[occ.educationLevel] = (acc[occ.educationLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nEducation Level Distribution:');
  Object.entries(eduLevels)
    .sort(([, a], [, b]) => b - a)
    .forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });

  console.log('\n✅ Done!');
}

main();

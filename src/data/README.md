# Pennsylvania Wage Data System

This directory contains Pennsylvania occupational wage data from the Pennsylvania Department of Labor & Industry.

## 📊 Current Data

- **Source**: PA Department of Labor & Industry
- **Date**: May 2024
- **Counties**: 2 of 67 (Adams, Centre)
- **Occupations**: 810+ unique SOC codes
- **Format**: XLS files converted to JSON

## 🗂️ File Structure

```
src/data/
├── *.xls                    # Raw XLS files (one per county)
├── pa-wage-data.json        # Processed raw data (all counties combined)
├── occupations.json         # Aggregated occupation data
└── resources.ts             # Resource library data
```

## 📥 Adding New County Data

When you receive additional XLS files for Pennsylvania counties:

### 1. Add the XLS File

Place the new `.xls` file in `src/data/` directory. The parser automatically processes all `.xls` files in this directory.

**Naming Convention**: Files should follow the pattern `{county}co_ow.xls`
- Examples: `adamsco_ow.xls`, `centco_ow.xls`, `philaco_ow.xls`

### 2. Update County Name Mapping

Edit `scripts/parse-wage-data.ts` and add the county to the `countyMap`:

```typescript
const countyMap: Record<string, string> = {
  'adamsco': 'Adams',
  'centco': 'Centre',
  'philaco': 'Philadelphia',  // Add new entries here
  // ... add more counties
};
```

### 3. Run the Parser

```bash
npm run parse:wages
```

Or manually:

```bash
npx tsx scripts/parse-wage-data.ts
```

This will:
- Read all XLS files in `src/data/`
- Parse the wage data (skipping headers automatically)
- Generate updated `pa-wage-data.json` (raw data)
- Generate updated `occupations.json` (aggregated by occupation)
- Display summary statistics

### 4. Verify the Output

The script will show:
- Number of XLS files processed
- Total occupation records parsed
- Unique occupations found
- Counties included
- Education level distribution

**Example Output:**
```
Pennsylvania Wage Data Parser
================================

Found 2 XLS files
Processing Adams County (adamsco_ow.xls)...
  ✓ Parsed 809 occupations
Processing Centre County (centco_ow.xls)...
  ✓ Parsed 808 occupations

Total records: 1617

✓ Raw data saved to: src\data\pa-wage-data.json
✓ Aggregated occupations saved to: src\data\occupations.json

=== Summary ===
Unique occupations: 810
Counties processed: 2
Data date: 2024-05
```

## 📋 Data Schema

### XLS File Structure

Expected columns (headers at row 6):
- **SOC Code**: Standard Occupational Classification code (e.g., "11-1011")
- **Occupational Title**: Job title (e.g., "Software Developer")
- **Educ. Level**: Education requirement (ND, HS, PS, SC, AD, BD, BD+, MD, DD, #)
- **Area Type**: Data source (CTY=County, WDA=Workforce Area, MSA=Metro, STW=State)
- **Average Hourly Wage ($)**: Mean hourly wage
- **Average Annual Wage ($)**: Mean annual wage
- **Median Annual Wage ($)**: Median annual wage
- **Entry Annual Wage ($)**: Entry-level annual wage
- **Exper'd Annual Wage ($)**: Experienced worker annual wage
- **Mid Range Annual Wage ($)**: Lower bound of mid-range
- **[Column 11]**: Contains "to" separator
- **[Column 12]**: Upper bound of mid-range

### Education Level Codes

- `ND`: No formal educational credential
- `HS`: High school diploma or equivalent
- `PS`: Postsecondary nondegree award
- `SC`: Some college, no degree
- `AD`: Associate's degree
- `BD`: Bachelor's degree
- `BD+`: Bachelor's degree or higher
- `MD`: Master's degree
- `DD`: Doctoral or professional degree
- `#`: Varies or not available

### Area Type Codes

- `CTY`: County-specific data (preferred)
- `WDA`: Workforce Development Area (used when county data unavailable)
- `MSA`: Metropolitan Statistical Area
- `STW`: Statewide

## 🔧 Using the Wage Data

### In TypeScript/React Components

```typescript
import {
  getAllOccupations,
  searchOccupations,
  getSalaryNegotiationData,
  formatCurrency,
  formatEducationLevel
} from '@/lib/wages';

// Get all occupations
const occupations = getAllOccupations();

// Search for occupations
const nurses = searchOccupations('nurse');

// Get salary negotiation data
const negotiationData = getSalaryNegotiationData(
  '29_1141',  // Registered Nurses
  'Adams',    // or 'statewide'
  'mid'       // entry, mid, or experienced
);

// Format for display
if (negotiationData) {
  console.log(`${negotiationData.title} in ${negotiationData.location}`);
  console.log(`Target: ${formatCurrency(negotiationData.targetSalary)}`);
  console.log(`Range: ${formatCurrency(negotiationData.salaryRange.low)} - ${formatCurrency(negotiationData.salaryRange.high)}`);
  console.log(`Insights: ${negotiationData.insights.join(', ')}`);
}

// Get occupation by education level
import { getOccupationsByEducation } from '@/lib/wages';
const bachelorJobs = getOccupationsByEducation(['BD', 'BD+']);

// Get top paying occupations
import { getTopPayingOccupations } from '@/lib/wages';
const topJobs = getTopPayingOccupations(20);
```

### Type Definitions

See `src/types/wages.ts` for complete TypeScript definitions:
- `Occupation`: Aggregated occupation with statewide and county wages
- `OccupationWageRaw`: Raw data as parsed from XLS
- `WageRange`: Wage statistics (hourly and annual)
- `CountyWageData`: County-specific wages
- `SalaryNegotiationData`: Formatted data for salary negotiation features

## 📈 Future Enhancements

### Planned Features
1. **Tag System**: Add tags to occupations for matching with intake form results
   - Values alignment (e.g., "helping-others", "creativity")
   - Personality traits (e.g., "analytical", "social")
   - Aptitudes (e.g., "technical", "communication")

2. **Career Path Mapping**: Link related occupations for career progression

3. **API Integration**: Consider external API for real-time updates

4. **Machine Learning**: Match users to careers based on assessment results

### Adding Tags (Future)

```typescript
// In occupations.json (to be enhanced)
{
  "id": "29_1141",
  "socCode": "29-1141",
  "title": "Registered Nurses",
  "tags": ["healthcare", "patient-care", "science"],
  "relatedValues": ["helping-others", "service", "security"],
  "relatedPersonality": ["social", "analytical", "detail-oriented"],
  "relatedAptitudes": ["medical", "communication", "problem-solving"]
}
```

## 🔄 Data Update Schedule

- **Frequency**: PA Department of Labor updates wage data annually (typically May)
- **Action Required**: When new data is released, replace XLS files and re-run parser
- **Version Control**: Consider keeping previous years' data for historical comparison

## 📞 Data Source

Pennsylvania Department of Labor & Industry
- Website: https://www.workstats.dli.pa.gov/
- Occupational Employment and Wage Statistics (OEWS)

## ⚙️ NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "parse:wages": "tsx scripts/parse-wage-data.ts",
    "examine:wages": "tsx scripts/examine-wage-data.ts"
  }
}
```

## 🐛 Troubleshooting

### Parser Fails
- Verify XLS files are in `src/data/`
- Check file format matches expected structure (headers at row 6)
- Ensure `xlsx` package is installed: `npm install xlsx`

### Missing Data
- Check if occupation shows `null` for wages (marked with * or # in source)
- Verify county name mapping in `parse-wage-data.ts`

### Large File Size
- `occupations.json` will grow as counties are added (~20KB per county)
- Consider lazy loading or API endpoints if > 5MB
- Use code splitting in production builds

## 📝 Notes

- Data marked with "*" or "#" in source files represents unavailable/suppressed data
- Some occupations may use WDA or MSA data when county-specific data is unavailable
- SOC codes ending in "-0000" are category summaries and are excluded from processing

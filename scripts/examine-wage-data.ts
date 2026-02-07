import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script to examine the structure of wage data XLS files
const dataDir = path.join(__dirname, '..', 'src', 'data');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.xls'));

console.log(`Found ${files.length} XLS files:\n`);

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`File: ${file}`);
  console.log('='.repeat(60));

  const workbook = XLSX.readFile(filePath);

  console.log(`\nSheet Names: ${workbook.SheetNames.join(', ')}`);

  // Examine first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Read all data first to find headers
  const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null, header: 1 });

  console.log(`\nTotal Rows: ${rawData.length}`);
  console.log('\nFirst 10 rows (raw):');
  rawData.slice(0, 10).forEach((row: any, index) => {
    console.log(`  Row ${index}: ${JSON.stringify(row)}`);
  });

  // Try to parse with header
  const dataWithHeader = XLSX.utils.sheet_to_json(worksheet, { defval: null, range: 5 });

  if (dataWithHeader.length > 0) {
    console.log('\n\nParsed data (starting from row 6):');
    console.log('\nColumn Names:');
    const firstRow = dataWithHeader[0] as Record<string, unknown>;
    Object.keys(firstRow).forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });

    console.log('\nFirst 5 data rows:');
    console.log(JSON.stringify(dataWithHeader.slice(0, 5), null, 2));
  }
});

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const occupations: any[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/data/occupations.json'), 'utf-8')
);

console.log('=== SPOT CHECKS ===\n');

const checkCodes = [
  '15-1252', '29-1141', '47-2111', '25-2021', '33-3051', '51-4121',
  '13-2011', '19-1042', '53-3032', '27-1024', '43-3031', '49-9021',
  '29-2034', '11-3021', '23-1011', '29-1071',
];

for (const soc of checkCodes) {
  const occ = occupations.find((o: any) => o.socCode === soc);
  if (!occ) continue;
  const m = occ.metadata;
  console.log(`${soc} ${occ.title}`);
  console.log(`  cluster: ${m.careerCluster} | sec: ${(m.secondaryClusters || []).join(', ') || 'none'}`);
  console.log(`  keywords(${m.keywords?.length}): ${(m.keywords || []).slice(0, 8).join(', ')}`);
  console.log(`  certs(${m.certifications?.length || 0}): ${(m.certifications || []).slice(0, 4).join(', ')}`);
  console.log(`  env: ${m.workEnvironment.setting.join('/')} | phys: ${m.workEnvironment.physicalDemands} | travel: ${m.workEnvironment.travelRequired}`);
  console.log(`  style: ind=${m.workStyle.independence} struct=${m.workStyle.structure} pace=${m.workStyle.pace}`);
  console.log(`  outlook: ${m.outlook.growth} | auto-risk: ${m.outlook.automationRisk}`);
  console.log('');
}

console.log('=== STATISTICS ===\n');
const total = occupations.length;
const kwLens = occupations.map((o: any) => o.metadata?.keywords?.length || 0);
const certCounts = occupations.map((o: any) => o.metadata?.certifications?.length || 0);
const withCerts = certCounts.filter((c: number) => c > 0).length;

console.log(`Total: ${total}`);
console.log(`Avg keywords: ${(kwLens.reduce((a: number, b: number) => a + b, 0) / total).toFixed(1)}`);
console.log(`Min/Max keywords: ${Math.min(...kwLens)} / ${Math.max(...kwLens)}`);
console.log(`With certs: ${withCerts}/${total} (${((withCerts / total) * 100).toFixed(1)}%)`);

const clusterDist: Record<string, number> = {};
occupations.forEach((o: any) => {
  const c = o.metadata?.careerCluster || 'unknown';
  clusterDist[c] = (clusterDist[c] || 0) + 1;
});
console.log('\nCluster distribution:');
Object.entries(clusterDist).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`  ${k}: ${v} (${((v / total) * 100).toFixed(1)}%)`);
});

console.log('\n=== QUALITY CHECKS ===\n');
const issues: string[] = [];
occupations.forEach((o: any) => {
  const m = o.metadata;
  if (!m) { issues.push(`${o.socCode} ${o.title}: NO METADATA`); return; }
  if ((m.keywords?.length || 0) < 5) issues.push(`${o.socCode} ${o.title}: only ${m.keywords?.length} keywords`);
  if (!m.careerCluster) issues.push(`${o.socCode} ${o.title}: no career cluster`);
  if (!m.values?.length) issues.push(`${o.socCode} ${o.title}: no values`);
});

if (issues.length === 0) console.log('No quality issues found!');
else { console.log(`${issues.length} issues:`); issues.slice(0, 20).forEach(i => console.log(`  ${i}`)); }

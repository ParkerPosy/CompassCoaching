/**
 * OG Image Generator
 * Converts public/og-image.svg → public/og-image.png (1200×630)
 * Run: npm run generate:og
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const inputPath = join(process.cwd(), "public", "og-image.svg");
const outputPath = join(process.cwd(), "public", "og-image.png");

const svg = readFileSync(inputPath);

const png = await sharp(svg, { density: 150 })
  .resize(1200, 630)
  .png()
  .toBuffer();

writeFileSync(outputPath, png);
console.log(`✓ Generated og-image.png (1200×630, ${(png.length / 1024).toFixed(1)} KB)`);

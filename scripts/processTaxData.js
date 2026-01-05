#!/usr/bin/env node
/**
 * Process Tax Data Script
 * 
 * Converts the raw CSV tax table to a simplified JSON file.
 * Filters for table 31, extracts salary ranges and tax values.
 * Merges consecutive percentage ranges (salary > 80,000) with identical tax rates.
 * 
 * Usage:
 *   node scripts/processTaxData.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCsvLine(line) {
  const columns = line.split(';');
  
  if (columns.length < 6) {
    return null;
  }

  return {
    year: columns[0],
    type: columns[1],
    tableNr: columns[2],
    salaryFrom: columns[3],
    salaryTo: columns[4],
    tax: columns[5],
  };
}

function processTaxData(inputPath) {
  const csvContent = fs.readFileSync(inputPath, 'utf-8');
  
  const lines = csvContent.split('\n');
  const taxBrackets = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const row = parseCsvLine(trimmedLine);
    if (!row) continue;

    // Filter for table 31
    if (row.tableNr !== '31') continue;

    const salaryFrom = parseInt(row.salaryFrom, 10);
    const salaryTo = parseInt(row.salaryTo, 10);
    const tax = parseInt(row.tax, 10);

    // Skip invalid rows
    if (isNaN(salaryFrom) || isNaN(salaryTo) || isNaN(tax)) continue;

    taxBrackets.push({
      salaryFrom,
      salaryTo,
      tax,
    });
  }

  // Sort by salaryFrom to ensure proper ordering
  taxBrackets.sort((a, b) => a.salaryFrom - b.salaryFrom);

  return taxBrackets;
}

function mergeConsecutivePercentages(brackets) {
  const merged = [];
  
  for (const bracket of brackets) {
    const isPercentage = bracket.salaryFrom > 80000;
    
    if (!isPercentage) {
      // Keep fixed amounts as-is
      merged.push(bracket);
      continue;
    }

    // For percentages, check if we can merge with the previous entry
    const lastMerged = merged[merged.length - 1];
    
    if (
      lastMerged &&
      lastMerged.salaryFrom > 80000 && // Previous is also a percentage
      lastMerged.tax === bracket.tax && // Same tax percentage
      lastMerged.salaryTo >= bracket.salaryFrom - 1 // Consecutive or overlapping ranges
    ) {
      // Merge: extend the range
      lastMerged.salaryTo = bracket.salaryTo;
    } else {
      // Cannot merge, add as new entry
      merged.push(bracket);
    }
  }

  return merged;
}

function generateJsonFile(brackets, year) {
  // Extract last 2 digits of year (e.g., 2026 -> 26)
  const yearShort = year.slice(-2);
  const outputPath = path.join(__dirname, `../data/processed/taxTable31_${yearShort}.json`);
  
  const fileContent = JSON.stringify(brackets, null, 2);

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`✅ Successfully processed tax data to ${outputPath}`);
  console.log(`   Total brackets: ${brackets.length}`);
}

// Main execution
try {
  console.log('🔄 Processing tax data...');
  
  // Find CSV files in data/raw directory
  const rawDataDir = path.join(__dirname, '../data/raw');
  const files = fs.readdirSync(rawDataDir);
  const csvFiles = files.filter(f => f.endsWith('.csv') && f.includes('Skattetabell'));
  
  if (csvFiles.length === 0) {
    console.error('❌ No CSV files found in data/raw/');
    process.exit(1);
  }
  
  // Process each CSV file
  for (const csvFile of csvFiles) {
    // Extract year from filename (e.g., "Skattetabell månadslön 2026.csv" -> "2026")
    const yearMatch = csvFile.match(/(\d{4})/);
    if (!yearMatch) {
      console.warn(`⚠️  Could not extract year from filename: ${csvFile}`);
      continue;
    }
    const year = yearMatch[1];
    
    console.log(`\n📄 Processing ${csvFile}...`);
    const inputPath = path.join(rawDataDir, csvFile);
    
    const rawBrackets = processTaxData(inputPath);
    console.log(`   Found ${rawBrackets.length} tax brackets for table 31`);
    
    const mergedBrackets = mergeConsecutivePercentages(rawBrackets);
    console.log(`   After merging: ${mergedBrackets.length} brackets`);
    
    generateJsonFile(mergedBrackets, year);
  }
} catch (error) {
  console.error('❌ Error processing tax data:', error);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies that all required files are present after production build
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'dist/src/main.js',
  'dist/src/app.module.js',
  'dist/src/app.controller.js',
  'dist/src/app.service.js'
];

const REQUIRED_DIRS = [
  'dist'
];

console.log('🔍 Verifying build output...\n');

let hasErrors = false;

// Check required directories
REQUIRED_DIRS.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Missing directory: ${dir}`);
    hasErrors = true;
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
});

// Check required files
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${file}`);
    hasErrors = true;
  } else {
    const stats = fs.statSync(filePath);
    console.log(`✅ File exists: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  }
});

// Check dist directory contents
console.log('\n📦 Build output summary:');
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);
  console.log(`   Total files in dist: ${files.length}`);

  let totalSize = 0;
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.statSync(filePath).isFile()) {
      totalSize += fs.statSync(filePath).size;
    }
  });
  console.log(`   Total build size: ${(totalSize / 1024).toFixed(2)} KB`);
}

console.log('');

if (hasErrors) {
  console.error('❌ Build verification failed!\n');
  process.exit(1);
} else {
  console.log('✅ Build verification passed!\n');
  process.exit(0);
}

#!/usr/bin/env node

/**
 * Staging Deployment Script
 * Deploys the application to staging environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment to STAGING environment...\n');

// Configuration
const STAGING_CONFIG = {
  environment: 'staging',
  nodeEnv: 'production',
  port: 3001,
  logLevel: 'info'
};

// Pre-deployment checks
console.log('📋 Running pre-deployment checks...');

// Check if build exists
const distPath = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Build not found. Please run "npm run build:prod" first.');
  process.exit(1);
}

console.log('✅ Build directory found');

// Check if required files exist
const requiredFiles = ['dist/src/main.js'];
let missingFiles = false;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required file missing: ${file}`);
    missingFiles = true;
  }
});

if (missingFiles) {
  console.error('❌ Pre-deployment checks failed!');
  process.exit(1);
}

console.log('✅ All required files present\n');

// Display deployment configuration
console.log('⚙️  Deployment Configuration:');
console.log(`   Environment: ${STAGING_CONFIG.environment}`);
console.log(`   Node Environment: ${STAGING_CONFIG.nodeEnv}`);
console.log(`   Port: ${STAGING_CONFIG.port}`);
console.log(`   Log Level: ${STAGING_CONFIG.logLevel}\n`);

// Create staging environment file
console.log('📝 Creating staging environment configuration...');
const stagingEnv = `NODE_ENV=${STAGING_CONFIG.nodeEnv}
PORT=${STAGING_CONFIG.port}
LOG_LEVEL=${STAGING_CONFIG.logLevel}
DEPLOYMENT_ENV=${STAGING_CONFIG.environment}
`;

fs.writeFileSync(path.join(process.cwd(), '.env.staging'), stagingEnv);
console.log('✅ Staging environment file created\n');

// Deployment steps
console.log('📦 Deployment steps:');
console.log('   1. Build verification completed');
console.log('   2. Environment configuration created');
console.log('   3. Ready to deploy to staging server\n');

// Deployment instructions
console.log('🎯 Next steps for staging deployment:');
console.log('   - Copy dist/ folder to staging server');
console.log('   - Copy .env.staging to server as .env');
console.log('   - Copy package.json and package-lock.json');
console.log('   - Run: npm ci --omit=dev');
console.log('   - Run: NODE_ENV=production node dist/src/main.js\n');

console.log('💡 For automated deployment, integrate with:');
console.log('   - PM2 for process management');
console.log('   - Docker for containerization');
console.log('   - CI/CD pipeline (GitHub Actions, Jenkins, etc.)\n');

console.log('✅ Staging deployment preparation completed!\n');

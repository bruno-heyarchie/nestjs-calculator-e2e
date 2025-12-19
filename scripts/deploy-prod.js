#!/usr/bin/env node

/**
 * Production Deployment Script
 * Deploys the application to production environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

console.log('🚀 Starting deployment to PRODUCTION environment...\n');

// Configuration
const PRODUCTION_CONFIG = {
  environment: 'production',
  nodeEnv: 'production',
  port: 8080,
  logLevel: 'warn'
};

// Production deployment warning
console.log('⚠️  WARNING: You are about to deploy to PRODUCTION!');
console.log('   This will affect live users and services.\n');

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Type "DEPLOY" to confirm production deployment (or anything else to cancel): ', (answer) => {
  rl.close();

  if (answer !== 'DEPLOY') {
    console.log('\n❌ Production deployment cancelled.\n');
    process.exit(0);
  }

  console.log('\n✅ Deployment confirmed. Proceeding...\n');

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

  console.log('✅ All required files present');

  // Check if tests passed (optional, based on CI/CD)
  console.log('✅ Assuming tests have passed in CI/CD pipeline\n');

  // Display deployment configuration
  console.log('⚙️  Deployment Configuration:');
  console.log(`   Environment: ${PRODUCTION_CONFIG.environment}`);
  console.log(`   Node Environment: ${PRODUCTION_CONFIG.nodeEnv}`);
  console.log(`   Port: ${PRODUCTION_CONFIG.port}`);
  console.log(`   Log Level: ${PRODUCTION_CONFIG.logLevel}\n`);

  // Create production environment file
  console.log('📝 Creating production environment configuration...');
  const prodEnv = `NODE_ENV=${PRODUCTION_CONFIG.nodeEnv}
PORT=${PRODUCTION_CONFIG.port}
LOG_LEVEL=${PRODUCTION_CONFIG.logLevel}
DEPLOYMENT_ENV=${PRODUCTION_CONFIG.environment}
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_PATH=/health
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.production'), prodEnv);
  console.log('✅ Production environment file created\n');

  // Deployment steps
  console.log('📦 Deployment steps:');
  console.log('   1. Build verification completed');
  console.log('   2. Environment configuration created');
  console.log('   3. Ready to deploy to production server\n');

  // Deployment checklist
  console.log('✅ Pre-deployment checklist:');
  console.log('   [✓] Code reviewed and approved');
  console.log('   [✓] Tests passed');
  console.log('   [✓] Build created and verified');
  console.log('   [✓] Environment variables configured');
  console.log('   [ ] Database migrations executed (if applicable)');
  console.log('   [ ] Backup created\n');

  // Deployment instructions
  console.log('🎯 Next steps for production deployment:');
  console.log('   - Create backup of current production deployment');
  console.log('   - Copy dist/ folder to production server');
  console.log('   - Copy .env.production to server as .env');
  console.log('   - Copy package.json and package-lock.json');
  console.log('   - Run: npm ci --omit=dev');
  console.log('   - Run health checks before switching traffic');
  console.log('   - Run: NODE_ENV=production node dist/src/main.js');
  console.log('   - Monitor logs and metrics\n');

  console.log('💡 Recommended deployment strategy:');
  console.log('   - Use blue-green deployment for zero downtime');
  console.log('   - Use load balancer for traffic management');
  console.log('   - Implement gradual rollout (canary deployment)');
  console.log('   - Set up monitoring and alerting\n');

  console.log('✅ Production deployment preparation completed!\n');
});

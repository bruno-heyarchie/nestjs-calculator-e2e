# Build Pipeline and Deployment Guide

## Build Commands

### Production Build
```bash
npm run build:prod
```
Creates optimized production build with webpack (minification, tree shaking, source maps).

### Bundle Analysis
```bash
npm run build:analyze
```
Generates bundle analysis report (creates `bundle-report.html` and `bundle-stats.json`).

### Build Verification
```bash
npm run build:verify
```
Verifies build artifacts (runs automatically after `build:prod`).

## Deployment

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:prod
```
Requires manual confirmation for safety.

## Docker

```bash
docker build -t calculator-api:latest .
docker run -p 3000:3000 calculator-api:latest
```

## Environment Variables

- `.env.development` - Development
- `.env.staging` - Staging
- `.env.production` - Production
- `.env.example` - Template

Key variables: `NODE_ENV`, `PORT`, `LOG_LEVEL`

## Features

- Webpack production optimizations
- Automatic build verification
- Bundle size analysis
- Multi-stage Docker builds
- Deployment safety checks
- Environment-specific configs

See deployment scripts in `scripts/` directory for details.

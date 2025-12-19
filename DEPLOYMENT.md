# Deployment Guide

This guide covers building and deploying the NestJS Calculator API to different environments.

## Table of Contents

- [Build Process](#build-process)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Docker Deployment](#docker-deployment)
- [Health Checks](#health-checks)

## Build Process

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build:prod
```

This command:
- Cleans the `dist/` directory
- Builds the application with webpack optimizations
- Verifies the build output
- Ensures all required files are present

### Build Verification

The build verification script automatically runs after `build:prod` and checks:
- Required directories exist
- Required files are present
- Build output size and file counts

To manually verify a build:

```bash
npm run build:verify
```

## Environment Configuration

### Environment Variables

Copy `.env.example` to create environment-specific configurations:

```bash
# Development
cp .env.example .env

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.production
```

### Required Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Application port | 3000 |
| LOG_LEVEL | Logging level (debug/info/warn/error) | debug |
| DEPLOYMENT_ENV | Deployment environment name | local |
| APP_VERSION | Application version | 0.0.1 |

## Deployment Options

### Option 1: Manual Deployment

#### Staging Deployment

```bash
npm run deploy:staging
```

This script:
- Verifies the build
- Creates staging environment configuration
- Provides deployment instructions

#### Production Deployment

```bash
npm run deploy:prod
```

This script:
- Requires confirmation before proceeding
- Verifies the build
- Creates production environment configuration
- Provides comprehensive deployment checklist
- Outputs deployment instructions

### Option 2: Direct Node Deployment

After building:

```bash
# Set environment
export NODE_ENV=production
export PORT=8080

# Run the application
node dist/main.js
```

### Option 3: PM2 Process Manager

Install PM2:

```bash
npm install -g pm2
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'calculator-api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Deploy with PM2:

```bash
npm run build:prod
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t calculator-api:latest .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name calculator-api \
  calculator-api:latest
```

### Using Docker Compose

Start the application:

```bash
docker-compose up -d
```

Stop the application:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f
```

### Multi-stage Build Benefits

The Dockerfile uses multi-stage builds for:
- Smaller final image size
- Separation of build and runtime dependencies
- Enhanced security (non-root user)
- Optimized layer caching

## Health Checks

### Health Check Endpoint

The application provides a health check endpoint at `/health`:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-19T08:00:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "version": "0.0.1"
}
```

### Docker Health Check

The Docker container includes automatic health checks:

```bash
docker inspect --format='{{json .State.Health}}' calculator-api
```

### Kubernetes Health Probes

If deploying to Kubernetes, configure probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Deployment Checklist

### Pre-deployment

- [ ] All tests passing (`npm test` and `npm run test:e2e`)
- [ ] Code reviewed and approved
- [ ] Dependencies updated and audited (`npm audit`)
- [ ] Environment variables configured
- [ ] Build successful (`npm run build:prod`)
- [ ] Build verification passed

### Deployment

- [ ] Backup current production deployment
- [ ] Deploy new version
- [ ] Verify health check endpoint
- [ ] Smoke test critical endpoints
- [ ] Monitor logs for errors
- [ ] Monitor performance metrics

### Post-deployment

- [ ] Verify all features working
- [ ] Check error rates
- [ ] Monitor resource usage
- [ ] Update documentation if needed
- [ ] Notify team of successful deployment

## Rollback Procedure

If issues occur after deployment:

### Docker

```bash
# Stop current container
docker-compose down

# Start previous version
docker run -d -p 3000:3000 calculator-api:previous-tag
```

### PM2

```bash
# List deployments
pm2 list

# Restart previous version
pm2 restart calculator-api@previous-version
```

## Monitoring and Logging

### Application Logs

The application uses NestJS Logger with different levels based on environment:

- **Development**: error, warn, log, debug, verbose
- **Production**: error, warn, log

### Docker Logs

```bash
docker logs calculator-api
docker logs -f calculator-api  # Follow logs
```

### PM2 Logs

```bash
pm2 logs calculator-api
pm2 logs --lines 100
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files containing secrets
2. **Docker**: Container runs as non-root user
3. **Dependencies**: Regularly audit with `npm audit`
4. **HTTPS**: Use reverse proxy (nginx, caddy) for SSL/TLS
5. **Rate Limiting**: Consider adding rate limiting middleware
6. **CORS**: Configure appropriate CORS settings in `main.ts`

## Troubleshooting

### Build Fails

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build:prod
```

### Container Won't Start

```bash
# Check logs
docker logs calculator-api

# Check environment variables
docker inspect calculator-api

# Verify health check
docker exec calculator-api node -e "require('http').get('http://localhost:3000/health')"
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Support

For issues or questions about deployment, please refer to:
- [Main README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- Project issue tracker

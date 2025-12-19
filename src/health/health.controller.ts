import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthService } from './health.service';

/**
 * Health check controller
 * Provides endpoints for monitoring application health
 * Rate limiting is disabled for health checks
 */
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Basic health check endpoint
   * GET /health
   */
  @Get()
  check() {
    return this.healthService.check();
  }

  /**
   * Detailed health status endpoint
   * GET /health/status
   */
  @Get('status')
  status() {
    return this.healthService.getStatus();
  }
}

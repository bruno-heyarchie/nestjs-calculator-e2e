import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

/**
 * Health check controller
 * Provides endpoints for monitoring application health
 */
@Controller('health')
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

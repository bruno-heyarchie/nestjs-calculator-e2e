import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { HealthService } from './health.service';

/**
 * Health check controller
 * Provides comprehensive endpoints for monitoring application health
 * Rate limiting is disabled for health checks to ensure uninterrupted monitoring
 */
@ApiTags('Health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  /**
   * Basic health check endpoint
   * Lightweight endpoint for load balancer health checks
   * GET /health
   */
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @HealthCheck()
  check() {
    return this.healthService.check();
  }

  /**
   * Detailed health status endpoint
   * Provides comprehensive system information
   * GET /health/detailed
   */
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health status with system metrics' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  @HealthCheck()
  async detailed() {
    return this.health.check([
      () => this.healthService.getDetailedStatus(),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  /**
   * Liveness probe endpoint
   * Kubernetes liveness probe - indicates if the app is running
   * GET /health/live
   */
  @Get('live')
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Indicates whether the application is running',
  })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  @HealthCheck()
  async liveness() {
    return this.health.check([() => this.healthService.checkLiveness()]);
  }

  /**
   * Readiness probe endpoint
   * Kubernetes readiness probe - indicates if the app is ready to accept traffic
   * GET /health/ready
   */
  @Get('ready')
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Indicates whether the application is ready to accept traffic',
  })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  @HealthCheck()
  async readiness() {
    return this.health.check([() => this.healthService.checkReadiness()]);
  }

  /**
   * Application metrics endpoint
   * Provides runtime metrics and statistics
   * GET /health/metrics
   */
  @Get('metrics')
  @ApiOperation({ summary: 'Application metrics and statistics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  metrics() {
    return this.healthService.getMetrics();
  }

  /**
   * Legacy status endpoint
   * Maintained for backward compatibility
   * GET /health/status
   */
  @Get('status')
  @ApiOperation({ summary: 'Legacy status endpoint (use /health/detailed)' })
  @ApiResponse({ status: 200, description: 'Application status' })
  status() {
    return this.healthService.getLegacyStatus();
  }
}

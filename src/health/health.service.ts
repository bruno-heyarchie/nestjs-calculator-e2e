import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';
import * as os from 'os';

/**
 * Health check service
 * Provides comprehensive health status information for the application
 * Implements custom health indicators for liveness and readiness probes
 */
@Injectable()
export class HealthService extends HealthIndicator {
  private readonly startTime = Date.now();
  private isReady = false;
  private requestCount = 0;
  private errorCount = 0;

  constructor() {
    super();
    // Mark as ready after a brief initialization period
    setTimeout(() => {
      this.isReady = true;
    }, 1000);
  }

  /**
   * Basic health check
   * Lightweight endpoint for load balancer health checks
   */
  check() {
    this.requestCount++;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'calculator-api',
    };
  }

  /**
   * Legacy status endpoint
   * Maintained for backward compatibility
   */
  getLegacyStatus() {
    const uptime = Date.now() - this.startTime;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      uptimeHuman: this.formatUptime(uptime),
      environment: process.env['NODE_ENV'] || 'development',
      version: process.env['npm_package_version'] || '0.0.1',
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
      },
    };
  }

  /**
   * Detailed health status
   * Provides comprehensive system information and metrics
   */
  async getDetailedStatus(): Promise<HealthIndicatorResult> {
    const uptime = Date.now() - this.startTime;
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const details = {
      timestamp: new Date().toISOString(),
      uptime: {
        milliseconds: uptime,
        human: this.formatUptime(uptime),
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        hostname: os.hostname(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg(),
      },
      process: {
        pid: process.pid,
        memory: {
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          external: memUsage.external,
          rss: memUsage.rss,
          arrayBuffers: memUsage.arrayBuffers,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
      },
      environment: {
        nodeEnv: process.env['NODE_ENV'] || 'development',
        version: process.env['npm_package_version'] || '0.0.1',
      },
    };

    // Use parent class getStatus method to create proper HealthIndicatorResult
    return super.getStatus('application', true, details);
  }

  /**
   * Liveness probe
   * Indicates whether the application is running
   * Fails if the application is deadlocked or in an unrecoverable state
   */
  async checkLiveness(): Promise<HealthIndicatorResult> {
    const isAlive = this.isApplicationAlive();

    if (!isAlive) {
      return super.getStatus('liveness', false, {
        message: 'Application is not responsive',
      });
    }

    return super.getStatus('liveness', true, {
      message: 'Application is alive and running',
      uptime: Date.now() - this.startTime,
    });
  }

  /**
   * Readiness probe
   * Indicates whether the application is ready to accept traffic
   * Checks if all dependencies and resources are available
   */
  async checkReadiness(): Promise<HealthIndicatorResult> {
    if (!this.isReady) {
      return super.getStatus('readiness', false, {
        message: 'Application is initializing',
      });
    }

    // Check if the application has any critical issues
    const hasIssues = this.hasCriticalIssues();

    if (hasIssues) {
      return super.getStatus('readiness', false, {
        message: 'Application has critical issues',
      });
    }

    return super.getStatus('readiness', true, {
      message: 'Application is ready to accept traffic',
      ready: true,
    });
  }

  /**
   * Application metrics
   * Provides runtime metrics and statistics
   */
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: new Date().toISOString(),
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        human: this.formatUptime(uptime),
      },
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        successRate:
          this.requestCount > 0
            ? ((this.requestCount - this.errorCount) / this.requestCount) * 100
            : 100,
      },
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: memUsage.rss,
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        userSeconds: Math.round(cpuUsage.user / 1000000),
        systemSeconds: Math.round(cpuUsage.system / 1000000),
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        totalMemoryGB: Math.round(os.totalmem() / 1024 / 1024 / 1024),
        freeMemoryGB: Math.round(os.freemem() / 1024 / 1024 / 1024),
        loadAverage: os.loadavg(),
      },
      process: {
        pid: process.pid,
        version: process.version,
        nodeVersion: process.versions.node,
        v8Version: process.versions.v8,
      },
    };
  }

  /**
   * Increment error count for metrics
   */
  incrementErrorCount(): void {
    this.errorCount++;
  }

  /**
   * Increment request count for metrics
   */
  incrementRequestCount(): void {
    this.requestCount++;
  }

  /**
   * Check if the application is alive
   * Can be extended to check for deadlocks or critical failures
   */
  private isApplicationAlive(): boolean {
    // Basic liveness check - process is running
    // Can be extended to check for deadlocks, event loop responsiveness, etc.
    return true;
  }

  /**
   * Check if the application has critical issues
   * Can be extended to check database connectivity, required services, etc.
   */
  private hasCriticalIssues(): boolean {
    // Check memory usage - if > 90% of heap is used, consider it critical
    const memUsage = process.memoryUsage();
    const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    if (heapUsagePercent > 90) {
      return true;
    }

    // Can be extended to check:
    // - Database connectivity
    // - External service availability
    // - File system access
    // - Environment configuration

    return false;
  }

  /**
   * Format uptime in human-readable format
   */
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
}

import { Injectable } from '@nestjs/common';

/**
 * Health check service
 * Provides health status information for the application
 */
@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  /**
   * Basic health check
   * Returns a simple status indicating the service is running
   */
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Detailed health status
   * Returns comprehensive information about the application
   */
  getStatus() {
    const uptime = Date.now() - this.startTime;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      uptimeHuman: this.formatUptime(uptime),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.0.1',
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
      },
    };
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

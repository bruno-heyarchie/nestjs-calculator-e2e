import { Injectable } from '@nestjs/common';

/**
 * Root application service
 * Provides business logic for application-level operations
 */
@Injectable()
export class AppService {
  /**
   * Get application information
   * Returns metadata about the application including name, version, description, and environment
   * @returns Object containing application information
   */
  getAppInfo() {
    return {
      name: 'Calculator API',
      version: process.env['APP_VERSION'] || '0.0.1',
      description:
        'A NestJS-based REST API calculator application providing basic arithmetic operations',
      environment: process.env['NODE_ENV'] || 'development',
    };
  }

  /**
   * Get health status of the application
   * Used for health checks by monitoring systems and load balancers
   * @returns Object containing health status, uptime, timestamp, environment, and version
   */
  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development',
      version: process.env['APP_VERSION'] || '0.0.1',
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Root application controller
 * Provides basic endpoints for application information and health checks
 */
@ApiTags('application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get welcome message and application information
   * @returns Application information including name, version, and description
   */
  @Get()
  @ApiOperation({
    summary: 'Get application information',
    description:
      'Returns basic information about the application including name, version, and description',
  })
  @ApiResponse({
    status: 200,
    description: 'Application information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Calculator API' },
        version: { type: 'string', example: '0.0.1' },
        description: {
          type: 'string',
          example: 'A NestJS-based REST API calculator application',
        },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  getAppInfo() {
    return this.appService.getAppInfo();
  }

  /**
   * Health check endpoint for monitoring and load balancer health checks
   * @returns Health status including uptime, timestamp, environment, and version
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Returns the health status of the application including uptime, timestamp, environment, and version. Used for monitoring and load balancer health checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-12-19T09:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'development' },
        version: { type: 'string', example: '0.0.1' },
      },
    },
  })
  healthCheck() {
    return this.appService.getHealthStatus();
  }
}

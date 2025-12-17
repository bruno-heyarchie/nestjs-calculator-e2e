import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Health module for application health checks
 * Provides endpoints for monitoring application status
 */
@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}

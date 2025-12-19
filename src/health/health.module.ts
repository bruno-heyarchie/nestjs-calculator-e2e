import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Health module for application health checks
 * Provides endpoints for monitoring application status with @nestjs/terminus integration
 * Includes readiness, liveness probes, and detailed system metrics
 */
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}

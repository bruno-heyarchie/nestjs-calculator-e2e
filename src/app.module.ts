import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculatorModule } from './calculator/calculator.module';
import { CalendarModule } from './calendar/calendar.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';

/**
 * Root application module that serves as the entry point for the NestJS application
 * Configures global modules, imports feature modules, and sets up dependency injection
 *
 * @module AppModule
 * @description
 * - Configures NestJS ConfigModule for environment variable management
 * - Configures ThrottlerModule for rate limiting (10 requests per minute)
 * - Imports CommonModule for global filters, interceptors, and pipes
 * - Imports custom ConfigModule for application-specific configuration
 * - Imports HealthModule for health check endpoints
 * - Imports feature modules (CalculatorModule, CalendarModule)
 */
@Module({
  imports: [
    // Global configuration module for environment variables
    // Loads .env files and provides validation for required variables
    NestConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally without explicit import
      envFilePath: [
        '.env',
        '.env.local',
        '.env.development',
        '.env.production',
      ],
      cache: true, // Cache environment variables for better performance
      expandVariables: true, // Allow variable expansion in .env files (e.g., ${VAR})
    }),
    // Rate limiting module to prevent abuse
    // Limits requests to 10 per minute per IP address
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window in milliseconds (60 seconds)
        limit: 10, // Maximum number of requests within the time window
      },
    ]),
    // Global common module with filters, interceptors, and pipes
    CommonModule,
    // Custom configuration service for application-specific config
    ConfigModule,
    // Health check endpoints for monitoring
    HealthModule,
    // Feature modules
    CalculatorModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

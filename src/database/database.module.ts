import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';

/**
 * Database module that configures TypeORM for PostgreSQL database connection
 * This module handles the database connection, entity management, and connection pooling
 *
 * @module DatabaseModule
 * @description
 * - Configures TypeORM with PostgreSQL using environment variables
 * - Auto-loads entities from modules that use TypeOrmModule.forFeature()
 * - Enables synchronization in development mode (creates/updates tables automatically)
 * - Implements connection pooling for better performance and resource management
 * - Provides retry logic for connection failures
 * - Configures migration settings for production deployments
 * - Provides logging in development for debugging database queries
 * - Supports SSL connections for production databases
 *
 * @example
 * ```typescript
 * // In a feature module
 * import { Module } from '@nestjs/common';
 * import { TypeOrmModule } from '@nestjs/typeorm';
 * import { User } from './user.entity';
 *
 * @Module({
 *   imports: [TypeOrmModule.forFeature([User])],
 * })
 * export class UsersModule {}
 * ```
 */
@Module({
  imports: [
    // Import the database configuration
    ConfigModule.forFeature(databaseConfig),

    // Configure TypeORM with async factory pattern
    // This allows us to inject ConfigService and access environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');

        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,

          // Connection pool configuration
          // Manages a pool of database connections for better performance
          extra: dbConfig.extra,

          // Entity configuration
          // Automatically loads entities from modules using TypeOrmModule.forFeature()
          autoLoadEntities: dbConfig.autoLoadEntities,

          // Schema synchronization (development only)
          // WARNING: Never use in production - it can cause data loss
          synchronize: dbConfig.synchronize,

          // Logging configuration
          // Logs database queries and errors based on environment
          logging: dbConfig.logging,

          // Migration configuration
          // Controls automatic migration execution on startup
          migrationsRun: dbConfig.migrationsRun,
          migrationsTableName: dbConfig.migrationsTableName,

          // SSL configuration for secure connections
          // Required for most production database services
          ssl: dbConfig.ssl,

          // Connection retry configuration
          // Automatically retries failed connections with exponential backoff
          retryAttempts: dbConfig.retryAttempts,
          retryDelay: dbConfig.retryDelay,

          // Additional TypeORM options
          // Keep connections alive to prevent premature disconnection
          keepConnectionAlive: true,

          // Connection naming for debugging
          name: 'default',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

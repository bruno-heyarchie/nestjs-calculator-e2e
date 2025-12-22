import { registerAs } from '@nestjs/config';

/**
 * Database configuration factory
 * Provides PostgreSQL connection parameters from environment variables
 *
 * @returns Database configuration object with connection settings
 *
 * @example
 * ```typescript
 * // In a service or module
 * constructor(
 *   @Inject(databaseConfig.KEY)
 *   private dbConfig: ConfigType<typeof databaseConfig>
 * ) {}
 * ```
 */
export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
  database: process.env['DB_DATABASE'] || 'spending_tracker',

  // Connection pool configuration for better performance
  // Limits the number of concurrent connections to the database
  extra: {
    max: parseInt(process.env['DB_POOL_MAX'] || '10', 10), // Maximum pool size
    min: parseInt(process.env['DB_POOL_MIN'] || '2', 10), // Minimum pool size
    idleTimeoutMillis: parseInt(
      process.env['DB_POOL_IDLE_TIMEOUT'] || '30000',
      10,
    ), // How long a client can remain idle before being closed
    connectionTimeoutMillis: parseInt(
      process.env['DB_CONNECTION_TIMEOUT'] || '10000',
      10,
    ), // How long to wait for a connection
  },

  // TypeORM specific settings
  synchronize: process.env['NODE_ENV'] === 'development', // Auto-create database schema (only in development)
  logging:
    process.env['NODE_ENV'] === 'development'
      ? ['query', 'error', 'warn']
      : ['error'], // Log queries in development

  // Migration settings
  migrationsRun: process.env['DB_RUN_MIGRATIONS'] === 'true', // Run migrations automatically on startup
  migrationsTableName: 'migrations', // Name of the migrations table

  // Entity loading configuration
  autoLoadEntities: true, // Automatically load entities from modules

  // SSL configuration for production databases
  ssl:
    process.env['DB_SSL'] === 'true'
      ? {
          rejectUnauthorized:
            process.env['DB_SSL_REJECT_UNAUTHORIZED'] !== 'false',
        }
      : false,

  // Retry connection attempts
  retryAttempts: parseInt(process.env['DB_RETRY_ATTEMPTS'] || '3', 10),
  retryDelay: parseInt(process.env['DB_RETRY_DELAY'] || '3000', 10), // Delay between retry attempts in ms
}));

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../../.env.development') });

/**
 * TypeORM DataSource configuration for CLI migrations
 * This configuration is used by TypeORM CLI commands for generating and running migrations
 */
export default new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
  database: process.env['DB_DATABASE'] || 'spending_tracker',

  // Entity paths for migration generation
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],

  // Migration paths
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],

  // Migration table name
  migrationsTableName: 'migrations',

  // Synchronization settings (should be false for production)
  synchronize: false,

  // Logging
  logging: process.env['NODE_ENV'] === 'development',

  // SSL configuration
  ssl:
    process.env['DB_SSL'] === 'true'
      ? {
          rejectUnauthorized:
            process.env['DB_SSL_REJECT_UNAUTHORIZED'] !== 'false',
        }
      : false,
});

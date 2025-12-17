/**
 * Application configuration
 * Loads configuration from environment variables with sensible defaults
 */
export interface AppConfig {
  port: number;
  environment: string;
  apiPrefix: string;
  corsEnabled: boolean;
}

export default (): { app: AppConfig } => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '',
    corsEnabled: process.env.CORS_ENABLED === 'true',
  },
});

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger/OpenAPI Documentation Configuration
 * Provides environment-specific documentation setup
 */

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
  contactEmail: string;
}

/**
 * Get Swagger configuration based on environment
 * Documentation is only enabled in development and staging environments
 */
export const getSwaggerConfig = (): SwaggerConfig => {
  const environment = process.env['NODE_ENV'] || 'development';
  const deploymentEnv = process.env['DEPLOYMENT_ENV'] || 'local';

  // Enable Swagger only in development and staging environments for security
  const isSwaggerEnabled =
    environment === 'development' ||
    deploymentEnv === 'staging' ||
    process.env['SWAGGER_ENABLED'] === 'true';

  return {
    enabled: isSwaggerEnabled,
    title: process.env['SWAGGER_TITLE'] || 'Calculator API',
    description:
      process.env['SWAGGER_DESCRIPTION'] ||
      'A NestJS-based REST API calculator application providing basic arithmetic operations.\n\n' +
        '## Features\n' +
        '- **Addition**: Add two numbers together\n' +
        '- **Subtraction**: Subtract one number from another\n' +
        '- **Multiplication**: Multiply two numbers\n' +
        '- **Division**: Divide one number by another (with division by zero protection)\n\n' +
        '## Request Methods\n' +
        'All operations support both GET (query parameters) and POST (JSON body) methods.\n\n' +
        '## Validation\n' +
        'All inputs are automatically validated to ensure they are valid finite numbers within JavaScript safe integer range.',
    version: process.env['APP_VERSION'] || '1.0',
    path: process.env['SWAGGER_PATH'] || 'api',
    contactEmail: process.env['SUPPORT_EMAIL'] || 'support@example.com',
  };
};

/**
 * Setup Swagger/OpenAPI documentation for the application
 * Creates interactive API documentation with Swagger UI
 *
 * @param app - NestJS application instance
 */
export const setupSwagger = (app: INestApplication): void => {
  const config = getSwaggerConfig();

  // Only setup Swagger if enabled in current environment
  if (!config.enabled) {
    return;
  }

  // Build OpenAPI document configuration
  const documentConfig = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .setContact('API Support', '', config.contactEmail)
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('application', 'Application-level endpoints')
    .addTag(
      'calculator',
      'Calculator arithmetic operations - supports both GET and POST methods',
    )
    .addTag('health', 'Health check and monitoring endpoints')
    .addServer(
      process.env['API_BASE_URL'] || 'http://localhost:3000',
      'API Server',
    )
    .build();

  // Create OpenAPI document
  const document = SwaggerModule.createDocument(app, documentConfig);

  // Setup Swagger UI
  SwaggerModule.setup(config.path, app, document, {
    customSiteTitle: `${config.title} Documentation`,
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    swaggerOptions: {
      // Persist authorization credentials in browser
      persistAuthorization: true,
      // Default expansion level for operations
      docExpansion: 'list',
      // Enable filtering operations
      filter: true,
      // Show request duration in Swagger UI
      showRequestDuration: true,
      // Display operation IDs
      displayOperationId: false,
      // Show extensions
      showExtensions: false,
      // Show common extensions
      showCommonExtensions: false,
      // Try it out enabled by default
      tryItOutEnabled: true,
    },
    // Custom CSS for Swagger UI (optional)
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .scheme-container { margin: 20px 0; }
    `,
  });
};

/**
 * Get the Swagger documentation URL
 * @param port - Application port
 * @returns Full URL to Swagger documentation or null if disabled
 */
export const getSwaggerUrl = (port: number | string): string | null => {
  const config = getSwaggerConfig();

  if (!config.enabled) {
    return null;
  }

  return `http://localhost:${port}/${config.path}`;
};

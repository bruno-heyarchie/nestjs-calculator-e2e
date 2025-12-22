import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { setupSwagger, getSwaggerUrl } from './config/swagger.config';
import helmet from 'helmet';
import compression from 'compression';

/**
 * Bootstrap the NestJS application
 * Configures global pipes, filters, interceptors, and middleware
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Determine log levels based on environment variable or NODE_ENV
  const getLogLevels = (): Array<
    'error' | 'warn' | 'log' | 'debug' | 'verbose'
  > => {
    const logLevel = process.env['LOG_LEVEL'] || 'info';

    // Map LOG_LEVEL to appropriate NestJS log levels
    switch (logLevel.toLowerCase()) {
      case 'error':
        return ['error'];
      case 'warn':
        return ['error', 'warn'];
      case 'info':
      case 'log':
        return ['error', 'warn', 'log'];
      case 'debug':
        return ['error', 'warn', 'log', 'debug'];
      case 'verbose':
        return ['error', 'warn', 'log', 'debug', 'verbose'];
      default:
        // Default based on NODE_ENV
        return process.env['NODE_ENV'] === 'production'
          ? ['error', 'warn', 'log']
          : ['error', 'warn', 'log', 'debug', 'verbose'];
    }
  };

  // Create NestJS application with environment-specific logging
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Security middleware - helmet for security headers
  // In production, configure CSP properly; in development, disable for Swagger UI
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env['NODE_ENV'] === 'production' ? undefined : false,
    }),
  );

  // Compression middleware for response optimization
  app.use(compression());

  // Enable CORS if needed
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] || '*',
    credentials: true,
  });

  // Configure global validation pipe with class-validator
  // This will automatically validate all incoming requests against DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      // Automatically transform payloads to DTO instances
      transform: true,
      // Strip properties that are not in the DTO
      whitelist: true,
      // Throw error if non-whitelisted properties are present
      forbidNonWhitelisted: true,
      // Return detailed error messages in development, simple in production
      disableErrorMessages: process.env['NODE_ENV'] === 'production',
      // Transform primitive types (e.g., string to number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configure global exception filter
  // Single comprehensive filter that handles all exceptions with consistent formatting
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configure global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(), // Logs all incoming requests and responses
    new TransformInterceptor(), // Transforms response data format
  );

  // Configure Swagger/OpenAPI documentation
  // Only enabled in development and staging environments for security
  setupSwagger(app);

  // Get port from environment or default to 3000
  const port = process.env['PORT'] || 3000;

  await app.listen(port);

  const isDevelopment = process.env['NODE_ENV'] === 'development';
  const isHMREnabled = process.env['HMR_ENABLED'] === 'true';
  const swaggerUrl = getSwaggerUrl(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📦 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  logger.log(`💚 Health check available at: http://localhost:${port}/health`);

  // Only log Swagger URL if it's enabled
  if (swaggerUrl) {
    logger.log(`📚 API documentation available at: ${swaggerUrl}`);
  } else {
    logger.log('📚 API documentation disabled in this environment');
  }

  logger.log('✅ Global validation pipe enabled with class-validator');
  logger.log('✅ Global exception filters configured');
  logger.log('✅ Global logging and transform interceptors configured');
  logger.log('✅ Security headers enabled with helmet');
  logger.log('✅ Response compression enabled');

  if (isDevelopment) {
    logger.log('');
    logger.log('🔧 Development mode features:');
    logger.log('   - Verbose logging enabled');
    logger.log('   - CORS enabled for all origins');
    if (swaggerUrl) {
      const swaggerPath = swaggerUrl.split('/').pop();
      logger.log(`   - Swagger UI enabled at /${swaggerPath}`);
    }
    if (isHMREnabled) {
      logger.log('   - Hot Module Replacement (HMR) enabled');
      logger.log('   - File changes will trigger automatic reload');
    } else {
      logger.log('   - File watching enabled (restart on changes)');
    }
    logger.log('');
    logger.log('💡 TIP: Use npm run start:hmr for Hot Module Replacement');
    logger.log(
      '💡 TIP: Use npm run start:debug to enable debugging on port 9229',
    );
  }
}

void bootstrap();

// Hot Module Replacement (HMR) for development
// This enables fast refresh during development without losing application state
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    const logger = new Logger('HMR');
    logger.log(
      '🔄 Hot Module Replacement triggered - refreshing application...',
    );
    void NestFactory.create(AppModule).then((app) => {
      return app.close().then(() => {
        logger.log('✅ Application disposed successfully');
      });
    });
  });
}

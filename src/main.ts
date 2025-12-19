import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';
import compression from 'compression';

/**
 * Bootstrap the NestJS application
 * Configures global pipes, filters, interceptors, and middleware
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS application with production optimizations
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env['NODE_ENV'] === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
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
  const config = new DocumentBuilder()
    .setTitle('Calculator API')
    .setDescription(
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
    )
    .setVersion('1.0')
    .setContact(
      'API Support',
      '',
      process.env['SUPPORT_EMAIL'] || 'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('application', 'Application-level endpoints')
    .addTag(
      'calculator',
      'Calculator arithmetic operations - supports both GET and POST methods',
    )
    .addTag('health', 'Health check and monitoring endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Calculator API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  // Get port from environment or default to 3000
  const port = process.env['PORT'] || 3000;

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
  logger.log(`Health check available at: http://localhost:${port}/health`);
  logger.log(`API documentation available at: http://localhost:${port}/api`);
  logger.log('Global validation pipe enabled with class-validator');
  logger.log('Global exception filters configured');
  logger.log('Global logging and transform interceptors configured');
  logger.log('Security headers enabled with helmet');
  logger.log('Response compression enabled');
}

void bootstrap();

// Hot Module Replacement (HMR) for development
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    void NestFactory.create(AppModule).then((app) => app.close());
  });
}

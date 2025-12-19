import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Enable CORS if needed
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] || '*',
    credentials: true,
  });

  // Configure Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Calculator API')
    .setDescription(
      'A NestJS-based REST API calculator application providing basic arithmetic operations',
    )
    .setVersion('1.0')
    .addTag('calculator')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get port from environment or default to 3000
  const port = process.env['PORT'] || 3000;

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
  logger.log(`Health check available at: http://localhost:${port}/health`);
  logger.log(`API documentation available at: http://localhost:${port}/api`);
}

void bootstrap();

// Hot Module Replacement (HMR) for development
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    void NestFactory.create(AppModule).then((app) => app.close());
  });
}

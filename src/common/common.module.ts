import { Module, Global } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from './filters/http-exception.filter';

/**
 * Common module providing shared functionality across the application
 * Made global so it's available to all modules without explicit importing
 * Note: ParseNumberPipe is available as an importable class but not as a provider
 * since it requires constructor parameters
 */
@Global()
@Module({
  providers: [
    LoggingInterceptor,
    TransformInterceptor,
    HttpExceptionFilter,
    AllExceptionsFilter,
  ],
  exports: [
    LoggingInterceptor,
    TransformInterceptor,
    HttpExceptionFilter,
    AllExceptionsFilter,
  ],
})
export class CommonModule {}

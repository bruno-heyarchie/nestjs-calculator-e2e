import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MathematicalError } from '../exceptions';

/**
 * Exception filter for mathematical errors
 * Provides consistent error response formatting for all mathematical operations
 */
@Catch(MathematicalError)
export class MathExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MathExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error information
    const errorResponse =
      typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { message: exceptionResponse };

    // Log the error with context
    this.logger.error(
      `Mathematical error occurred - Path: ${request.url} - ` +
        `Method: ${request.method} - ` +
        `Error: ${JSON.stringify(errorResponse)}`,
    );

    // Send formatted response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...errorResponse,
    });
  }
}

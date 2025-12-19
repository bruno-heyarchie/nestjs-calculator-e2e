import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MathematicalError, CalculatorException } from '../exceptions';

/**
 * Exception filter for mathematical and calculator errors
 * Provides consistent error response formatting for all mathematical operations
 * Handles both legacy MathematicalError and new CalculatorException types
 */
@Catch(MathematicalError, CalculatorException)
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

    // Log the error with context including error code if available
    const errorCode = (errorResponse as any).errorCode || 'N/A';
    this.logger.error(
      `Calculator error occurred - Path: ${request.url} - ` +
        `Method: ${request.method} - ` +
        `Error Code: ${errorCode} - ` +
        `Error: ${JSON.stringify(errorResponse)}`,
    );

    // Send formatted response with enhanced structure
    response.status(status).json({
      statusCode: status,
      timestamp: errorResponse.timestamp || new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...errorResponse,
    });
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Interface for consistent error response format
 */
export interface ErrorResponseFormat {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  errorCode?: string;
  description?: string;
  operation?: string;
  details?: string;
}

/**
 * Global exception filter that catches all exceptions and formats them consistently
 * Provides uniform error handling across all calculator endpoints
 *
 * Handles:
 * - HttpException instances with proper status codes
 * - Validation errors from class-validator
 * - Custom calculator exceptions (like division by zero)
 * - Unexpected errors (500 status with generic message)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Build base error response with consistent format
    const errorResponse: ErrorResponseFormat = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Internal server error',
    };

    // Handle different exception types
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        // Simple string message
        errorResponse.message = exceptionResponse;
        errorResponse.error = exception.name;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;

        // Handle validation errors from class-validator
        if (
          exception instanceof BadRequestException &&
          Array.isArray(responseObj.message)
        ) {
          errorResponse.message = responseObj.message;
          errorResponse.error = 'Validation Error';
        }
        // Handle calculator exceptions with error codes
        else if (responseObj.errorCode) {
          errorResponse.message = responseObj.message || exception.message;
          errorResponse.errorCode = responseObj.errorCode;
          errorResponse.error = responseObj.error || 'Calculator Error';

          if (responseObj.description) {
            errorResponse.description = responseObj.description;
          }
          if (responseObj.operation) {
            errorResponse.operation = responseObj.operation;
          }
          if (responseObj.details) {
            errorResponse.details = responseObj.details;
          }
        }
        // Handle standard HttpException with message property
        else if (responseObj.message) {
          errorResponse.message = responseObj.message;
          errorResponse.error = responseObj.error || exception.name;
        } else {
          errorResponse.message = exception.message;
          errorResponse.error = exception.name;
        }
      }
    } else if (exception instanceof Error) {
      // Handle unexpected JavaScript errors
      errorResponse.message = 'Internal server error';
      errorResponse.error = 'Internal Server Error';

      // Only include detailed error message in development
      if (process.env['NODE_ENV'] !== 'production') {
        errorResponse.details = exception.message;
      }
    } else {
      // Handle non-Error exceptions (strings, objects, etc.)
      errorResponse.message = 'Internal server error';
      errorResponse.error = 'Internal Server Error';
    }

    // Log the error with appropriate context
    this.logError(exception, request, status, errorResponse);

    // Send formatted response
    response.status(status).json(errorResponse);
  }

  /**
   * Log error with appropriate level and context
   */
  private logError(
    exception: unknown,
    request: Request,
    status: number,
    errorResponse: ErrorResponseFormat,
  ): void {
    const errorCode = errorResponse.errorCode || 'N/A';
    const logMessage = `${request.method} ${request.url} - Status: ${status} - Error Code: ${errorCode}`;

    if (status >= 500) {
      // Server errors - log with stack trace
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      // Client errors - log as warning
      this.logger.warn(
        `${logMessage} - Message: ${typeof errorResponse.message === 'string' ? errorResponse.message : JSON.stringify(errorResponse.message)}`,
      );
    } else {
      // Other status codes - log as info
      this.logger.log(logMessage);
    }
  }
}

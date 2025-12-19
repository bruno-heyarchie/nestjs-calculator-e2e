import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CalculatorException, UnexpectedException } from '../exceptions';

/**
 * Interceptor that handles all errors from calculator operations
 * Ensures consistent error response format across the application
 */
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const path = request.url;
        const method = request.method;

        // Log the error with context
        this.logger.error(
          `Error in calculator operation - ` +
            `Path: ${path}, Method: ${method}, ` +
            `Error: ${error.message}`,
          error.stack,
        );

        // If it's already a CalculatorException, pass it through
        if (error instanceof CalculatorException) {
          return throwError(() => error);
        }

        // If it's an HttpException but not CalculatorException, wrap it
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();
          const message =
            typeof response === 'string'
              ? response
              : (response as any).message || 'An error occurred';

          return throwError(
            () =>
              new UnexpectedException(
                message,
                `Original status: ${status}, Message: ${message}`,
              ),
          );
        }

        // For unknown errors, create a generic UnexpectedException
        const errorMessage =
          error.message || 'An unexpected error occurred during calculation';

        return throwError(
          () =>
            new UnexpectedException(
              errorMessage,
              `Unexpected error: ${error.toString()}`,
            ),
        );
      }),
    );
  }
}

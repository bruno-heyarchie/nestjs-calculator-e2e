import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ErrorHandlingInterceptor } from './error-handling.interceptor';
import {
  DivisionByZeroException,
  CalculatorException,
  UnexpectedException,
  CalculatorErrorCode,
} from '../exceptions';

describe('ErrorHandlingInterceptor', () => {
  let interceptor: ErrorHandlingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorHandlingInterceptor],
    }).compile();

    interceptor = module.get<ErrorHandlingInterceptor>(ErrorHandlingInterceptor);

    // Mock ExecutionContext
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          url: '/calculator/divide',
          method: 'GET',
        }),
        getResponse: jest.fn(),
      }),
    } as any;

    // Mock CallHandler
    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('Successful Operations', () => {
    it('should pass through successful operations', (done) => {
      const result = { result: 42 };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(result));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual(result);
          done();
        },
        error: () => {
          fail('Should not throw error for successful operation');
        },
      });
    });
  });

  describe('CalculatorException Handling', () => {
    it('should pass through CalculatorException unchanged', (done) => {
      const exception = new DivisionByZeroException(10);
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => exception));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error).toBe(exception);
          expect(error).toBeInstanceOf(DivisionByZeroException);
          done();
        },
      });
    });

    it('should preserve error code from CalculatorException', (done) => {
      const exception = new DivisionByZeroException();
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => exception));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          const response = error.getResponse() as any;
          expect(response.errorCode).toBe(CalculatorErrorCode.DIVISION_BY_ZERO);
          done();
        },
      });
    });
  });

  describe('HttpException Handling', () => {
    it('should wrap non-calculator HttpException in UnexpectedException', (done) => {
      const httpException = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => httpException));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnexpectedException);
          const response = error.getResponse() as any;
          expect(response.errorCode).toBe(CalculatorErrorCode.UNEXPECTED_ERROR);
          expect(response.message).toBe('Not Found');
          done();
        },
      });
    });

    it('should handle HttpException with object response', (done) => {
      const httpException = new HttpException(
        { message: 'Custom error', extra: 'data' },
        HttpStatus.BAD_REQUEST,
      );
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => httpException));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnexpectedException);
          const response = error.getResponse() as any;
          expect(response.message).toBe('Custom error');
          done();
        },
      });
    });
  });

  describe('Unknown Error Handling', () => {
    it('should wrap unknown errors in UnexpectedException', (done) => {
      const unknownError = new Error('Something went wrong');
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => unknownError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnexpectedException);
          const response = error.getResponse() as any;
          expect(response.errorCode).toBe(CalculatorErrorCode.UNEXPECTED_ERROR);
          expect(response.message).toBe('Something went wrong');
          done();
        },
      });
    });

    it('should handle errors without message', (done) => {
      const unknownError = { toString: () => 'Unknown error' };
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => unknownError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(UnexpectedException);
          const response = error.getResponse() as any;
          expect(response.message).toBe('An unexpected error occurred during calculation');
          done();
        },
      });
    });
  });

  describe('Error Logging', () => {
    it('should log error with context information', (done) => {
      const logSpy = jest.spyOn(interceptor['logger'], 'error');
      const exception = new DivisionByZeroException(10);
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => exception));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: () => {
          expect(logSpy).toHaveBeenCalled();
          const logCall = logSpy.mock.calls[0][0];
          expect(logCall).toContain('Error in calculator operation');
          expect(logCall).toContain('/calculator/divide');
          expect(logCall).toContain('GET');
          done();
        },
      });
    });

    it('should include stack trace in logs', (done) => {
      const logSpy = jest.spyOn(interceptor['logger'], 'error');
      const error = new Error('Test error');
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: () => {
          expect(logSpy).toHaveBeenCalled();
          expect(logSpy.mock.calls[0][1]).toBeDefined(); // Stack trace
          done();
        },
      });
    });
  });

  describe('Error Response Structure', () => {
    it('should ensure all wrapped errors have error codes', (done) => {
      const plainError = new Error('Plain error');
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => plainError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          const response = error.getResponse() as any;
          expect(response.errorCode).toBeDefined();
          expect(Object.values(CalculatorErrorCode)).toContain(response.errorCode);
          done();
        },
      });
    });

    it('should ensure all wrapped errors have timestamps', (done) => {
      const plainError = new Error('Plain error');
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => plainError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          const response = error.getResponse() as any;
          expect(response.timestamp).toBeDefined();
          expect(new Date(response.timestamp)).toBeInstanceOf(Date);
          done();
        },
      });
    });

    it('should ensure all wrapped errors have proper HTTP status codes', (done) => {
      const plainError = new Error('Plain error');
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => plainError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should throw error');
        },
        error: (error) => {
          expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          done();
        },
      });
    });
  });
});

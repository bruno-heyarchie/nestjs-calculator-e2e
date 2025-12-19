import { Test, TestingModule } from '@nestjs/testing';
import { MathExceptionFilter } from './math-exception.filter';
import {
  DivisionByZeroException,
  OverflowException,
  UnderflowException,
  InvalidResultException,
  InvalidOperationException,
  MathematicalError,
} from '../exceptions';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';

describe('MathExceptionFilter', () => {
  let filter: MathExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MathExceptionFilter],
    }).compile();

    filter = module.get<MathExceptionFilter>(MathExceptionFilter);

    // Mock Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock Request
    mockRequest = {
      url: '/api/calculator/divide',
      method: 'POST',
      body: { a: 10, b: 0 },
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' } as any,
      headers: {
        'x-correlation-id': 'test-correlation-id-123',
      } as any,
      get: jest.fn((header: string) => {
        if (header === 'user-agent') return 'Jest Test Agent';
        return undefined;
      }),
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  describe('catch', () => {
    it('should handle DivisionByZeroException with comprehensive logging', () => {
      const exception = new DivisionByZeroException(10);

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall).toMatchObject({
        statusCode: 400,
        errorCode: 'CALC_001',
        message: 'Division by zero is not allowed',
        operation: 'division',
        path: '/api/calculator/divide',
        method: 'POST',
      });
    });

    it('should handle OverflowException with operation context', () => {
      const exception = new OverflowException(
        'multiplication',
        'Result exceeds MAX_SAFE_INTEGER',
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.operation).toBe('multiplication');
      expect(responseCall.details).toBe('Result exceeds MAX_SAFE_INTEGER');
    });

    it('should handle UnderflowException with proper status code', () => {
      const exception = new UnderflowException('subtraction');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.errorCode).toBe('CALC_102');
      expect(responseCall.operation).toBe('subtraction');
    });

    it('should handle InvalidResultException', () => {
      const exception = new InvalidResultException(
        'power',
        'Result is infinity',
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.message).toContain('Invalid result');
      expect(responseCall.operation).toBe('power');
    });

    it('should handle InvalidOperationException', () => {
      const exception = new InvalidOperationException(
        'square root',
        'Cannot calculate square root of negative number',
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.message).toContain('square root of negative number');
    });

    it('should handle legacy MathematicalError exceptions', () => {
      const exception = new MathematicalError('test-operation', 'test reason');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should include timestamp in response', () => {
      const exception = new DivisionByZeroException();

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.timestamp).toBeDefined();
      expect(new Date(responseCall.timestamp)).toBeInstanceOf(Date);
    });

    it('should include request path and method in response', () => {
      const exception = new DivisionByZeroException();

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.path).toBe('/api/calculator/divide');
      expect(responseCall.method).toBe('POST');
    });

    it('should handle exceptions with string response', () => {
      const exception = new HttpException('Simple error message', 400);

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.message).toBe('Simple error message');
    });

    it('should log error code in error message', () => {
      const exception = new DivisionByZeroException();
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('CALC_001');
      expect(logMessage).toContain('Error Code');
    });

    it('should log request path in error message', () => {
      const exception = new DivisionByZeroException();
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('/api/calculator/divide');
    });

    it('should log request method in error message', () => {
      const exception = new DivisionByZeroException();
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('POST');
      expect(logMessage).toContain('Method');
    });

    it('should handle unknown error codes gracefully', () => {
      const exception = new HttpException('Simple error', 400);
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('N/A');
    });

    it('should handle missing IP address gracefully', () => {
      mockRequest.ip = undefined;
      mockRequest.socket = { remoteAddress: undefined } as any;
      const exception = new DivisionByZeroException();

      expect(() => {
        filter.catch(exception, mockArgumentsHost as ArgumentsHost);
      }).not.toThrow();
    });

    it('should log error details when present', () => {
      const exception = new DivisionByZeroException(42);
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('42 / 0');
    });

    it('should log full error response in JSON format', () => {
      const exception = new DivisionByZeroException();
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('Error:');
      expect(logMessage).toContain('errorCode');
      expect(logMessage).toContain('message');
    });

    it('should include operation context in error logs', () => {
      const exception = new OverflowException(
        'multiplication',
        'result too large',
      );
      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(loggerSpy).toHaveBeenCalled();
      const logMessage = loggerSpy.mock.calls[0][0];
      expect(logMessage).toContain('multiplication');
    });
  });

  describe('Error Response Format', () => {
    it('should maintain consistent response structure', () => {
      const exception = new DivisionByZeroException();

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];

      // Check all required fields
      expect(responseCall).toHaveProperty('statusCode');
      expect(responseCall).toHaveProperty('timestamp');
      expect(responseCall).toHaveProperty('path');
      expect(responseCall).toHaveProperty('method');
      expect(responseCall).toHaveProperty('errorCode');
      expect(responseCall).toHaveProperty('message');
      expect(responseCall).toHaveProperty('operation');
      expect(responseCall).toHaveProperty('description');
      expect(responseCall).toHaveProperty('error');
    });

    it('should include all exception properties in response', () => {
      const exception = new OverflowException(
        'addition',
        'Result too large: 999999999999999999',
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.operation).toBe('addition');
      expect(responseCall.details).toContain('Result too large');
      expect(responseCall.errorCode).toBe('CALC_101');
    });
  });

  describe('Integration with Different Exception Types', () => {
    it('should handle all calculator exception types consistently', () => {
      const exceptions = [
        new DivisionByZeroException(),
        new OverflowException('multiply'),
        new UnderflowException('subtract'),
        new InvalidResultException('power', 'infinity'),
        new InvalidOperationException('sqrt', 'negative input'),
      ];

      exceptions.forEach((exception) => {
        // Clear previous mock calls
        jest.clearAllMocks();

        filter.catch(exception, mockArgumentsHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalled();

        const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
        expect(responseCall.errorCode).toBeDefined();
        expect(responseCall.message).toBeDefined();
        expect(responseCall.timestamp).toBeDefined();
      });
    });
  });
});

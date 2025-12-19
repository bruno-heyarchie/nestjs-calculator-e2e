import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import {
  DivisionByZeroException,
  ValidationException,
} from '../../calculator/exceptions';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    // Mock response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request
    mockRequest = {
      url: '/calculator/divide',
      method: 'GET',
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HttpException handling', () => {
    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Not found',
          error: 'HttpException',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        {
          message: 'Invalid input',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Invalid input',
          error: 'Bad Request',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('Validation error handling', () => {
    it('should handle BadRequestException with validation error array', () => {
      const validationErrors = [
        'a must be a number',
        'b must be a number',
        'a should not be empty',
      ];
      const exception = new BadRequestException(validationErrors);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: validationErrors,
          error: 'Validation Error',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should handle validation error with single message', () => {
      const exception = new BadRequestException('Invalid query parameter');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Invalid query parameter',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('Calculator exception handling', () => {
    it('should handle DivisionByZeroException with error code and description', () => {
      const exception = new DivisionByZeroException(10);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Division by zero is not allowed',
          error: 'Calculator Error',
          errorCode: 'CALC_001',
          description: 'Division by zero is not mathematically defined',
          operation: 'division',
          details: '10 / 0',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should handle ValidationException with error code', () => {
      const exception = new ValidationException(
        'Operand must be a number',
        'a is not a valid number',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Operand must be a number',
          error: 'Calculator Error',
          errorCode: 'CALC_501',
          description: 'Input validation failed',
          operation: 'validation',
          details: 'a is not a valid number',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should include all error context fields for calculator exceptions', () => {
      const exception = new DivisionByZeroException();

      filter.catch(exception, mockArgumentsHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('statusCode');
      expect(jsonCall).toHaveProperty('timestamp');
      expect(jsonCall).toHaveProperty('path');
      expect(jsonCall).toHaveProperty('method');
      expect(jsonCall).toHaveProperty('message');
      expect(jsonCall).toHaveProperty('error');
      expect(jsonCall).toHaveProperty('errorCode');
      expect(jsonCall).toHaveProperty('description');
      expect(jsonCall).toHaveProperty('operation');
    });
  });

  describe('Unexpected error handling', () => {
    it('should handle generic Error with 500 status', () => {
      const exception = new Error('Unexpected database error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should handle non-Error exceptions', () => {
      const exception = 'Something went wrong';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          path: '/calculator/divide',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should include error details in development environment', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      const exception = new Error('Database connection failed');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          details: 'Database connection failed',
        }),
      );

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should not include error details in production environment', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';

      const exception = new Error('Database connection failed');

      filter.catch(exception, mockArgumentsHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.details).toBeUndefined();

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('Response format consistency', () => {
    it('should always include required fields', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const response = mockResponse.json.mock.calls[0][0];
      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('timestamp');
      expect(response).toHaveProperty('path');
      expect(response).toHaveProperty('method');
      expect(response).toHaveProperty('message');
    });

    it('should format timestamp as ISO string', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const response = mockResponse.json.mock.calls[0][0];
      expect(response.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should include request path and method', () => {
      mockRequest.url = '/calculator/add';
      mockRequest.method = 'POST';

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/calculator/add',
          method: 'POST',
        }),
      );
    });
  });

  describe('Status code handling', () => {
    it('should use correct status code for different HttpException types', () => {
      const testCases = [
        { status: HttpStatus.BAD_REQUEST, expected: 400 },
        { status: HttpStatus.UNAUTHORIZED, expected: 401 },
        { status: HttpStatus.FORBIDDEN, expected: 403 },
        { status: HttpStatus.NOT_FOUND, expected: 404 },
        { status: HttpStatus.INTERNAL_SERVER_ERROR, expected: 500 },
      ];

      testCases.forEach(({ status, expected }) => {
        const exception = new HttpException('Test error', status);
        filter.catch(exception, mockArgumentsHost);
        expect(mockResponse.status).toHaveBeenCalledWith(expected);
      });
    });

    it('should default to 500 for non-HttpException errors', () => {
      const exception = new Error('Unexpected error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});

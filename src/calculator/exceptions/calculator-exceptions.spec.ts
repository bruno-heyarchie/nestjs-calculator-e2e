import {
  DivisionByZeroException,
  ModuloByZeroException,
  OverflowException,
  UnderflowException,
  InvalidResultException,
  InvalidOperationException,
  InvalidOperandException,
  ValidationException,
  UnexpectedException,
  CalculatorException,
} from './calculator-exceptions';
import { CalculatorErrorCode, ErrorCodeDescriptions } from './error-codes.enum';
import { HttpStatus } from '@nestjs/common';

describe('Calculator Exceptions', () => {
  describe('DivisionByZeroException', () => {
    it('should create exception with correct error code', () => {
      const exception = new DivisionByZeroException();
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.DIVISION_BY_ZERO);
      expect(response.message).toBe('Division by zero is not allowed');
      expect(response.operation).toBe('division');
      expect(response.description).toBe(
        ErrorCodeDescriptions[CalculatorErrorCode.DIVISION_BY_ZERO],
      );
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include numerator in details when provided', () => {
      const exception = new DivisionByZeroException(10);
      const response = exception.getResponse() as any;

      expect(response.details).toBe('10 / 0');
    });

    it('should include timestamp in response', () => {
      const exception = new DivisionByZeroException();
      const response = exception.getResponse() as any;

      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('ModuloByZeroException', () => {
    it('should create exception with correct error code', () => {
      const exception = new ModuloByZeroException();
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.MODULO_BY_ZERO);
      expect(response.message).toBe('Modulo by zero is not allowed');
      expect(response.operation).toBe('modulo');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include dividend in details when provided', () => {
      const exception = new ModuloByZeroException(15);
      const response = exception.getResponse() as any;

      expect(response.details).toBe('15 % 0');
    });
  });

  describe('OverflowException', () => {
    it('should create exception with correct error code', () => {
      const exception = new OverflowException('addition');
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.OVERFLOW_ERROR);
      expect(response.message).toBe('Operation resulted in overflow');
      expect(response.operation).toBe('addition');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include details when provided', () => {
      const exception = new OverflowException(
        'multiplication',
        'Result exceeds MAX_SAFE_INTEGER',
      );
      const response = exception.getResponse() as any;

      expect(response.details).toBe('Result exceeds MAX_SAFE_INTEGER');
    });
  });

  describe('UnderflowException', () => {
    it('should create exception with correct error code', () => {
      const exception = new UnderflowException('subtraction');
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.UNDERFLOW_ERROR);
      expect(response.message).toBe('Operation resulted in underflow');
      expect(response.operation).toBe('subtraction');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include details when provided', () => {
      const exception = new UnderflowException(
        'subtraction',
        'Result below MIN_SAFE_INTEGER',
      );
      const response = exception.getResponse() as any;

      expect(response.details).toBe('Result below MIN_SAFE_INTEGER');
    });
  });

  describe('InvalidResultException', () => {
    it('should create exception with correct error code', () => {
      const exception = new InvalidResultException(
        'power',
        'Result is infinity',
      );
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.INVALID_RESULT);
      expect(response.message).toBe('Invalid result: Result is infinity');
      expect(response.operation).toBe('power');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('InvalidOperationException', () => {
    it('should create exception with correct error code', () => {
      const exception = new InvalidOperationException(
        'square root',
        'Cannot calculate square root of negative number',
      );
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.INVALID_OPERATION);
      expect(response.message).toBe(
        'Cannot calculate square root of negative number',
      );
      expect(response.operation).toBe('square root');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should allow custom error code', () => {
      const exception = new InvalidOperationException(
        'square root',
        'Negative input',
        CalculatorErrorCode.NEGATIVE_SQUARE_ROOT,
      );
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.NEGATIVE_SQUARE_ROOT);
    });
  });

  describe('InvalidOperandException', () => {
    it('should create exception with correct error code', () => {
      const exception = new InvalidOperandException(
        'First operand',
        'must be a number',
      );
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.INVALID_OPERAND);
      expect(response.message).toBe('First operand: must be a number');
      expect(response.operation).toBe('validation');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should allow custom error code', () => {
      const exception = new InvalidOperandException(
        'Operand',
        'must not be NaN',
        CalculatorErrorCode.OPERAND_IS_NAN,
      );
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.OPERAND_IS_NAN);
    });
  });

  describe('ValidationException', () => {
    it('should create exception with correct error code', () => {
      const exception = new ValidationException('Input validation failed');
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.VALIDATION_ERROR);
      expect(response.message).toBe('Input validation failed');
      expect(response.operation).toBe('validation');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include details when provided', () => {
      const exception = new ValidationException(
        'Invalid input',
        'Expected number, got string',
      );
      const response = exception.getResponse() as any;

      expect(response.details).toBe('Expected number, got string');
    });
  });

  describe('UnexpectedException', () => {
    it('should create exception with correct error code and status', () => {
      const exception = new UnexpectedException('Unexpected system error');
      const response = exception.getResponse() as any;

      expect(response.errorCode).toBe(CalculatorErrorCode.UNEXPECTED_ERROR);
      expect(response.message).toBe('Unexpected system error');
      expect(response.operation).toBe('system');
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should include details when provided', () => {
      const exception = new UnexpectedException(
        'Database error',
        'Connection timeout',
      );
      const response = exception.getResponse() as any;

      expect(response.details).toBe('Connection timeout');
    });
  });

  describe('CalculatorException Base Class', () => {
    it('should create exception with all required fields', () => {
      const exception = new CalculatorException(
        CalculatorErrorCode.DIVISION_BY_ZERO,
        'Test message',
        'test-operation',
        'test-details',
        HttpStatus.BAD_REQUEST,
      );
      const response = exception.getResponse() as any;

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.errorCode).toBe(CalculatorErrorCode.DIVISION_BY_ZERO);
      expect(response.message).toBe('Test message');
      expect(response.operation).toBe('test-operation');
      expect(response.details).toBe('test-details');
      expect(response.timestamp).toBeDefined();
      expect(response.error).toBe('Calculator Error');
      expect(response.description).toBe(
        ErrorCodeDescriptions[CalculatorErrorCode.DIVISION_BY_ZERO],
      );
    });

    it('should use default status code when not provided', () => {
      const exception = new CalculatorException(
        CalculatorErrorCode.INVALID_OPERAND,
        'Test message',
      );

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Error Response Structure', () => {
    it('should have consistent structure across all exception types', () => {
      const exceptions = [
        new DivisionByZeroException(),
        new ModuloByZeroException(),
        new OverflowException('add'),
        new UnderflowException('sub'),
        new InvalidResultException('pow', 'infinity'),
        new InvalidOperationException('sqrt', 'negative'),
        new InvalidOperandException('a', 'NaN'),
        new ValidationException('invalid'),
        new UnexpectedException('error'),
      ];

      exceptions.forEach((exception) => {
        const response = exception.getResponse() as any;

        // Check all required fields exist
        expect(response.statusCode).toBeDefined();
        expect(response.errorCode).toBeDefined();
        expect(response.message).toBeDefined();
        expect(response.description).toBeDefined();
        expect(response.timestamp).toBeDefined();
        expect(response.error).toBe('Calculator Error');

        // Verify error code is valid
        expect(Object.values(CalculatorErrorCode)).toContain(
          response.errorCode,
        );

        // Verify description matches error code
        expect(response.description).toBe(
          ErrorCodeDescriptions[response.errorCode],
        );
      });
    });
  });

  describe('Error Code Descriptions', () => {
    it('should have descriptions for all error codes', () => {
      const errorCodes = Object.values(CalculatorErrorCode);
      const descriptions = Object.keys(ErrorCodeDescriptions);

      expect(descriptions.length).toBe(errorCodes.length);

      errorCodes.forEach((code) => {
        expect(ErrorCodeDescriptions[code]).toBeDefined();
        expect(ErrorCodeDescriptions[code].length).toBeGreaterThan(0);
      });
    });

    it('should have user-friendly descriptions', () => {
      Object.values(ErrorCodeDescriptions).forEach((description) => {
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(10); // Reasonably descriptive
        expect(description[0]).toBe(description[0].toUpperCase()); // Starts with capital
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';
import { ValidationService } from './validation/validation.service';
import {
  DivisionByZeroError,
  ModuloByZeroError,
  OverflowError,
  UnderflowError,
  InvalidResultError,
  InvalidOperationError,
  InvalidOperandError,
} from './exceptions';

describe('CalculatorService - Comprehensive Error Handling', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService, ValidationService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  describe('Division by Zero Error', () => {
    it('should throw DivisionByZeroError when dividing by zero', () => {
      expect(() => service.divide(5, 0)).toThrow(DivisionByZeroError);
    });

    it('should throw DivisionByZeroError with proper error message', () => {
      try {
        service.divide(10, 0);
        fail('Should have thrown DivisionByZeroError');
      } catch (error) {
        expect(error).toBeInstanceOf(DivisionByZeroError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('division');
        expect(response.reason).toBe('Division by zero is not allowed');
        expect(response.timestamp).toBeDefined();
      }
    });
  });

  describe('Modulo by Zero Error', () => {
    it('should throw ModuloByZeroError when modulo by zero', () => {
      expect(() => service.modulo(5, 0)).toThrow(ModuloByZeroError);
    });

    it('should throw ModuloByZeroError with proper error message', () => {
      try {
        service.modulo(10, 0);
        fail('Should have thrown ModuloByZeroError');
      } catch (error) {
        expect(error).toBeInstanceOf(ModuloByZeroError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('modulo');
        expect(response.reason).toBe('Modulo by zero is not allowed');
      }
    });
  });

  describe('Overflow Detection', () => {
    it('should throw OverflowError for addition overflow', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      expect(() => service.add(largeNumber, 1000)).toThrow(OverflowError);
    });

    it('should throw OverflowError for multiplication overflow', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      expect(() => service.multiply(largeNumber, 2)).toThrow(OverflowError);
    });

    it('should throw OverflowError with operation context', () => {
      try {
        service.add(Number.MAX_SAFE_INTEGER, 1000);
        fail('Should have thrown OverflowError');
      } catch (error) {
        expect(error).toBeInstanceOf(OverflowError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('addition');
        expect(response.reason).toContain('overflow');
      }
    });
  });

  describe('Underflow Detection', () => {
    it('should throw UnderflowError for subtraction underflow', () => {
      const largeNegative = Number.MIN_SAFE_INTEGER;
      expect(() => service.subtract(largeNegative, 1000)).toThrow(
        UnderflowError,
      );
    });

    it('should throw UnderflowError with operation context', () => {
      try {
        service.subtract(Number.MIN_SAFE_INTEGER, 1000);
        fail('Should have thrown UnderflowError');
      } catch (error) {
        expect(error).toBeInstanceOf(UnderflowError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('subtraction');
        expect(response.reason).toContain('underflow');
      }
    });
  });

  describe('Invalid Result Error', () => {
    it('should throw InvalidResultError for power operation resulting in Infinity', () => {
      expect(() => service.power(10, 1000)).toThrow(InvalidResultError);
    });

    it('should throw InvalidResultError for invalid power result', () => {
      try {
        service.power(10, 1000);
        fail('Should have thrown InvalidResultError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidResultError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('power');
        expect(response.reason).toContain('Invalid result');
      }
    });
  });

  describe('Invalid Operation Error', () => {
    it('should throw InvalidOperationError for negative square root', () => {
      expect(() => service.sqrt(-4)).toThrow(InvalidOperationError);
    });

    it('should throw InvalidOperationError for negative factorial', () => {
      expect(() => service.factorial(-5)).toThrow(InvalidOperationError);
    });

    it('should throw InvalidOperationError for factorial input too large', () => {
      expect(() => service.factorial(171)).toThrow(InvalidOperationError);
    });

    it('should provide descriptive error message for square root of negative', () => {
      try {
        service.sqrt(-4);
        fail('Should have thrown InvalidOperationError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidOperationError);
        const response = error.getResponse() as any;
        expect(response.operation).toBe('square root');
        expect(response.reason).toContain('negative number');
      }
    });
  });

  describe('Invalid Operand Error', () => {
    it('should throw InvalidOperandError for NaN operand', () => {
      expect(() => service.add(NaN, 5)).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError for Infinity operand', () => {
      expect(() => service.add(Infinity, 5)).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError for non-integer factorial', () => {
      expect(() => service.factorial(5.5)).toThrow(InvalidOperandError);
    });

    it('should provide descriptive error message for NaN', () => {
      try {
        service.add(NaN, 5);
        fail('Should have thrown InvalidOperandError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidOperandError);
        const response = error.getResponse() as any;
        expect(response.reason).toContain('not be NaN');
      }
    });

    it('should provide descriptive error message for Infinity', () => {
      try {
        service.multiply(5, Infinity);
        fail('Should have thrown InvalidOperandError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidOperandError);
        const response = error.getResponse() as any;
        expect(response.reason).toContain('finite number');
      }
    });
  });

  describe('Error Response Structure', () => {
    it('should include timestamp in error response', () => {
      try {
        service.divide(5, 0);
        fail('Should have thrown error');
      } catch (error) {
        const response = error.getResponse() as any;
        expect(response.timestamp).toBeDefined();
        expect(new Date(response.timestamp)).toBeInstanceOf(Date);
      }
    });

    it('should include operation context in error response', () => {
      try {
        service.modulo(10, 0);
        fail('Should have thrown error');
      } catch (error) {
        const response = error.getResponse() as any;
        expect(response.operation).toBe('modulo');
      }
    });

    it('should include reason in error response', () => {
      try {
        service.divide(10, 0);
        fail('Should have thrown error');
      } catch (error) {
        const response = error.getResponse() as any;
        expect(response.reason).toBeDefined();
        expect(response.reason).toBeTruthy();
      }
    });

    it('should include descriptive message in error response', () => {
      try {
        service.sqrt(-9);
        fail('Should have thrown error');
      } catch (error) {
        const response = error.getResponse() as any;
        expect(response.message).toBeDefined();
        expect(response.message).toContain('Mathematical error');
      }
    });
  });

  describe('Mathematical Operation Limits', () => {
    it('should enforce MAX_SAFE_INTEGER limit for addition', () => {
      expect(() => service.add(Number.MAX_SAFE_INTEGER, 1)).toThrow(
        OverflowError,
      );
    });

    it('should enforce MIN_SAFE_INTEGER limit for subtraction', () => {
      expect(() => service.subtract(Number.MIN_SAFE_INTEGER, 1)).toThrow(
        UnderflowError,
      );
    });

    it('should enforce factorial input limit of 170', () => {
      expect(() => service.factorial(171)).toThrow(InvalidOperationError);
      expect(() => service.factorial(500)).toThrow(InvalidOperationError);
    });

    it('should allow factorial up to 170', () => {
      expect(() => service.factorial(170)).not.toThrow();
    });
  });
});

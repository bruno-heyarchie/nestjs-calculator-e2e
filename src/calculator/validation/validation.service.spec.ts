import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { InvalidOperandError } from '../exceptions';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isNotNullOrUndefined', () => {
    it('should pass validation for valid numbers', () => {
      const result = service.isNotNullOrUndefined(5, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(5);
    });

    it('should fail validation for null', () => {
      const result = service.isNotNullOrUndefined(null, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not be null');
    });

    it('should fail validation for undefined', () => {
      const result = service.isNotNullOrUndefined(undefined, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not be undefined');
    });

    it('should pass validation for zero', () => {
      const result = service.isNotNullOrUndefined(0, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });
  });

  describe('isNotNaN', () => {
    it('should pass validation for valid numbers', () => {
      const result = service.isNotNaN(42, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should fail validation for NaN', () => {
      const result = service.isNotNaN(NaN, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not be NaN');
    });

    it('should fail validation for null', () => {
      const result = service.isNotNaN(null, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should fail validation for undefined', () => {
      const result = service.isNotNaN(undefined, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should pass validation for negative numbers', () => {
      const result = service.isNotNaN(-10, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(-10);
    });
  });

  describe('isFinite', () => {
    it('should pass validation for finite numbers', () => {
      const result = service.isFinite(100, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(100);
    });

    it('should fail validation for positive Infinity', () => {
      const result = service.isFinite(Infinity, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a finite number');
    });

    it('should fail validation for negative Infinity', () => {
      const result = service.isFinite(-Infinity, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a finite number');
    });

    it('should pass validation for zero', () => {
      const result = service.isFinite(0, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });

    it('should pass validation for very large numbers', () => {
      const result = service.isFinite(Number.MAX_VALUE, 'testParam');
      expect(result.isValid).toBe(true);
    });
  });

  describe('isInteger', () => {
    it('should pass validation for integers', () => {
      const result = service.isInteger(10, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should pass validation for negative integers', () => {
      const result = service.isInteger(-5, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(-5);
    });

    it('should pass validation for zero', () => {
      const result = service.isInteger(0, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });

    it('should fail validation for decimal numbers', () => {
      const result = service.isInteger(10.5, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be an integer');
    });

    it('should fail validation for very small decimals', () => {
      const result = service.isInteger(0.0001, 'testParam');
      expect(result.isValid).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should pass validation for values within range', () => {
      const result = service.isInRange(5, 0, 10, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(5);
    });

    it('should pass validation for minimum boundary value', () => {
      const result = service.isInRange(0, 0, 10, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should pass validation for maximum boundary value', () => {
      const result = service.isInRange(10, 0, 10, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should fail validation for values below minimum', () => {
      const result = service.isInRange(-1, 0, 10, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be between');
    });

    it('should fail validation for values above maximum', () => {
      const result = service.isInRange(11, 0, 10, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be between');
    });

    it('should work with negative ranges', () => {
      const result = service.isInRange(-5, -10, 0, 'testParam');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateNumber', () => {
    it('should pass validation for valid numbers', () => {
      const result = service.validateNumber(42, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should fail validation for null', () => {
      const result = service.validateNumber(null, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should fail validation for undefined', () => {
      const result = service.validateNumber(undefined, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should fail validation for NaN', () => {
      const result = service.validateNumber(NaN, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not be NaN');
    });

    it('should fail validation for Infinity', () => {
      const result = service.validateNumber(Infinity, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a finite number');
    });

    it('should fail validation for strings', () => {
      const result = service.validateNumber('not a number' as any, 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a number');
    });

    it('should fail validation for objects', () => {
      const result = service.validateNumber({} as any, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should fail validation for arrays', () => {
      const result = service.validateNumber([] as any, 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should pass validation for negative numbers', () => {
      const result = service.validateNumber(-100, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should pass validation for decimal numbers', () => {
      const result = service.validateNumber(3.14159, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should pass validation for zero', () => {
      const result = service.validateNumber(0, 'testParam');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateWithOptions', () => {
    it('should pass basic validation with default options', () => {
      const result = service.validateWithOptions(42, {});
      expect(result.isValid).toBe(true);
    });

    it('should allow Infinity when allowInfinity is true', () => {
      const result = service.validateWithOptions(Infinity, {
        allowInfinity: true,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject Infinity when allowInfinity is false', () => {
      const result = service.validateWithOptions(Infinity, {
        allowInfinity: false,
      });
      expect(result.isValid).toBe(false);
    });

    it('should reject negative numbers when allowNegative is false', () => {
      const result = service.validateWithOptions(-5, {
        allowNegative: false,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not be negative');
    });

    it('should accept negative numbers when allowNegative is true', () => {
      const result = service.validateWithOptions(-5, {
        allowNegative: true,
      });
      expect(result.isValid).toBe(true);
    });

    it('should require integer when requireInteger is true', () => {
      const result = service.validateWithOptions(10.5, {
        requireInteger: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be an integer');
    });

    it('should accept integers when requireInteger is true', () => {
      const result = service.validateWithOptions(10, {
        requireInteger: true,
      });
      expect(result.isValid).toBe(true);
    });

    it('should validate minimum range', () => {
      const result = service.validateWithOptions(5, {
        min: 10,
      });
      expect(result.isValid).toBe(false);
    });

    it('should validate maximum range', () => {
      const result = service.validateWithOptions(15, {
        max: 10,
      });
      expect(result.isValid).toBe(false);
    });

    it('should validate both min and max range', () => {
      const result = service.validateWithOptions(5, {
        min: 0,
        max: 10,
      });
      expect(result.isValid).toBe(true);
    });

    it('should use custom parameter name', () => {
      const result = service.validateWithOptions('invalid' as any, {
        parameterName: 'CustomParam',
      });
      expect(result.error).toContain('CustomParam');
    });

    it('should combine multiple validation rules', () => {
      const result = service.validateWithOptions(5, {
        allowNegative: false,
        requireInteger: true,
        min: 0,
        max: 10,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMultiple', () => {
    it('should validate multiple valid values', () => {
      const results = service.validateMultiple(
        [1, 2, 3],
        ['first', 'second', 'third'],
      );
      expect(results).toHaveLength(3);
      expect(results.every((r) => r.isValid)).toBe(true);
    });

    it('should detect invalid values in array', () => {
      const results = service.validateMultiple(
        [1, NaN, 3],
        ['first', 'second', 'third'],
      );
      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
    });

    it('should throw error when arrays have different lengths', () => {
      expect(() => {
        service.validateMultiple([1, 2], ['first']);
      }).toThrow();
    });

    it('should handle empty arrays', () => {
      const results = service.validateMultiple([], []);
      expect(results).toHaveLength(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid numbers', () => {
      expect(() => {
        service.validateOrThrow(42, 'testParam');
      }).not.toThrow();
    });

    it('should throw InvalidOperandError for null', () => {
      expect(() => {
        service.validateOrThrow(null, 'testParam');
      }).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError for undefined', () => {
      expect(() => {
        service.validateOrThrow(undefined, 'testParam');
      }).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError for NaN', () => {
      expect(() => {
        service.validateOrThrow(NaN, 'testParam');
      }).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError for Infinity', () => {
      expect(() => {
        service.validateOrThrow(Infinity, 'testParam');
      }).toThrow(InvalidOperandError);
    });

    it('should throw InvalidOperandError with correct parameter name', () => {
      expect(() => {
        service.validateOrThrow(null, 'MyParam');
      }).toThrow(/MyParam/);
    });
  });

  describe('validateOperandsOrThrow', () => {
    it('should not throw for two valid numbers', () => {
      expect(() => {
        service.validateOperandsOrThrow(10, 20);
      }).not.toThrow();
    });

    it('should throw for invalid first operand', () => {
      expect(() => {
        service.validateOperandsOrThrow(NaN, 20);
      }).toThrow(InvalidOperandError);
    });

    it('should throw for invalid second operand', () => {
      expect(() => {
        service.validateOperandsOrThrow(10, null);
      }).toThrow(InvalidOperandError);
    });

    it('should throw for both invalid operands', () => {
      expect(() => {
        service.validateOperandsOrThrow(null, undefined);
      }).toThrow(InvalidOperandError);
    });

    it('should throw with correct parameter names', () => {
      expect(() => {
        service.validateOperandsOrThrow(null, 20);
      }).toThrow(/First operand/);
    });
  });

  describe('validateSingleOperandOrThrow', () => {
    it('should not throw for valid number', () => {
      expect(() => {
        service.validateSingleOperandOrThrow(42);
      }).not.toThrow();
    });

    it('should throw for invalid operand', () => {
      expect(() => {
        service.validateSingleOperandOrThrow(NaN);
      }).toThrow(InvalidOperandError);
    });
  });

  describe('parseNumber', () => {
    it('should validate existing numbers', () => {
      const result = service.parseNumber(42, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should parse valid string numbers', () => {
      const result = service.parseNumber('42', 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should parse decimal strings', () => {
      const result = service.parseNumber('3.14', 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(3.14);
    });

    it('should parse negative string numbers', () => {
      const result = service.parseNumber('-10', 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(-10);
    });

    it('should trim whitespace from strings', () => {
      const result = service.parseNumber('  42  ', 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should fail for empty strings', () => {
      const result = service.parseNumber('', 'testParam');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be an empty string');
    });

    it('should fail for whitespace-only strings', () => {
      const result = service.parseNumber('   ', 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should fail for non-numeric strings', () => {
      const result = service.parseNumber('not a number', 'testParam');
      expect(result.isValid).toBe(false);
    });

    it('should handle scientific notation strings', () => {
      const result = service.parseNumber('1e5', 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(100000);
    });
  });

  describe('validateResultRange', () => {
    it('should pass validation for values within safe integer range', () => {
      const result = service.validateResultRange(1000, 'testOp');
      expect(result.isValid).toBe(true);
    });

    it('should fail validation for positive infinity', () => {
      const result = service.validateResultRange(Infinity, 'testOp');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('positive infinity');
    });

    it('should fail validation for negative infinity', () => {
      const result = service.validateResultRange(-Infinity, 'testOp');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('negative infinity');
    });

    it('should fail validation for NaN', () => {
      const result = service.validateResultRange(NaN, 'testOp');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not a number');
    });

    it('should fail validation for overflow', () => {
      const result = service.validateResultRange(
        Number.MAX_SAFE_INTEGER + 1,
        'testOp',
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum safe integer');
    });

    it('should fail validation for underflow', () => {
      const result = service.validateResultRange(
        Number.MIN_SAFE_INTEGER - 1,
        'testOp',
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('below minimum safe integer');
    });

    it('should pass validation at maximum safe boundary', () => {
      const result = service.validateResultRange(
        Number.MAX_SAFE_INTEGER,
        'testOp',
      );
      expect(result.isValid).toBe(true);
    });

    it('should pass validation at minimum safe boundary', () => {
      const result = service.validateResultRange(
        Number.MIN_SAFE_INTEGER,
        'testOp',
      );
      expect(result.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small numbers', () => {
      const result = service.validateNumber(Number.MIN_VALUE, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should handle very large numbers', () => {
      const result = service.validateNumber(Number.MAX_VALUE, 'testParam');
      expect(result.isValid).toBe(true);
    });

    it('should handle negative zero', () => {
      const result = service.validateNumber(-0, 'testParam');
      expect(result.isValid).toBe(true);
      // Note: -0 and 0 are treated as equal in JavaScript, but Object.is distinguishes them
      expect(result.value == 0 || Object.is(result.value, -0)).toBe(true);
    });

    it('should handle positive zero', () => {
      const result = service.validateNumber(+0, 'testParam');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work with calculator service pattern', () => {
      // Simulate how calculator service would use validation
      const validateOperands = (a: number, b: number) => {
        service.validateOperandsOrThrow(a, b);
      };

      expect(() => validateOperands(10, 20)).not.toThrow();
      expect(() => validateOperands(NaN, 20)).toThrow();
      expect(() => validateOperands(10, Infinity)).toThrow();
    });

    it('should provide detailed error messages', () => {
      const result = service.validateNumber(null, 'FirstOperand');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('FirstOperand');
      expect(result.error).toContain('null');
    });
  });
});

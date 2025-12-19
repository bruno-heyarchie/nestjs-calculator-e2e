import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CalculatorService } from './calculator.service';

describe('Calculator Edge Cases and Error Conditions', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  describe('Division by Zero', () => {
    it('should throw error when dividing positive number by zero', () => {
      expect(() => service.divide(10, 0)).toThrow(BadRequestException);
      expect(() => service.divide(10, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing negative number by zero', () => {
      expect(() => service.divide(-10, 0)).toThrow(BadRequestException);
      expect(() => service.divide(-10, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing zero by zero', () => {
      expect(() => service.divide(0, 0)).toThrow(BadRequestException);
      expect(() => service.divide(0, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing decimal by zero', () => {
      expect(() => service.divide(3.14, 0)).toThrow(BadRequestException);
      expect(() => service.divide(3.14, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing large number by zero', () => {
      expect(() => service.divide(Number.MAX_SAFE_INTEGER, 0)).toThrow(
        BadRequestException,
      );
      expect(() => service.divide(Number.MAX_SAFE_INTEGER, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error for modulo by zero', () => {
      expect(() => service.modulo(10, 0)).toThrow(BadRequestException);
      expect(() => service.modulo(10, 0)).toThrow(
        'Modulo by zero is not allowed',
      );
    });

    it('should throw error for modulo with zero dividend and zero divisor', () => {
      expect(() => service.modulo(0, 0)).toThrow(BadRequestException);
      expect(() => service.modulo(0, 0)).toThrow(
        'Modulo by zero is not allowed',
      );
    });
  });

  describe('Invalid Number Inputs (NaN)', () => {
    describe('add operation', () => {
      it('should throw error for NaN as first operand', () => {
        expect(() => service.add(NaN, 5)).toThrow(BadRequestException);
        expect(() => service.add(NaN, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as second operand', () => {
        expect(() => service.add(5, NaN)).toThrow(BadRequestException);
        expect(() => service.add(5, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as both operands', () => {
        expect(() => service.add(NaN, NaN)).toThrow(BadRequestException);
      });
    });

    describe('subtract operation', () => {
      it('should throw error for NaN as first operand', () => {
        expect(() => service.subtract(NaN, 5)).toThrow(BadRequestException);
        expect(() => service.subtract(NaN, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as second operand', () => {
        expect(() => service.subtract(5, NaN)).toThrow(BadRequestException);
        expect(() => service.subtract(5, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });
    });

    describe('multiply operation', () => {
      it('should throw error for NaN as first operand', () => {
        expect(() => service.multiply(NaN, 5)).toThrow(BadRequestException);
        expect(() => service.multiply(NaN, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as second operand', () => {
        expect(() => service.multiply(5, NaN)).toThrow(BadRequestException);
        expect(() => service.multiply(5, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });
    });

    describe('divide operation', () => {
      it('should throw error for NaN as first operand', () => {
        expect(() => service.divide(NaN, 5)).toThrow(BadRequestException);
        expect(() => service.divide(NaN, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as second operand', () => {
        expect(() => service.divide(5, NaN)).toThrow(BadRequestException);
        expect(() => service.divide(5, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });
    });

    describe('power operation', () => {
      it('should throw error for NaN as base', () => {
        expect(() => service.power(NaN, 2)).toThrow(BadRequestException);
        expect(() => service.power(NaN, 2)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as exponent', () => {
        expect(() => service.power(2, NaN)).toThrow(BadRequestException);
        expect(() => service.power(2, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });
    });

    describe('sqrt operation', () => {
      it('should throw error for NaN', () => {
        expect(() => service.sqrt(NaN)).toThrow(BadRequestException);
        expect(() => service.sqrt(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });
    });

    describe('factorial operation', () => {
      it('should throw error for NaN', () => {
        expect(() => service.factorial(NaN)).toThrow(BadRequestException);
        expect(() => service.factorial(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });
    });

    describe('modulo operation', () => {
      it('should throw error for NaN as dividend', () => {
        expect(() => service.modulo(NaN, 5)).toThrow(BadRequestException);
        expect(() => service.modulo(NaN, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for NaN as divisor', () => {
        expect(() => service.modulo(5, NaN)).toThrow(BadRequestException);
        expect(() => service.modulo(5, NaN)).toThrow(
          'Second operand must be a valid finite number',
        );
      });
    });

    describe('unary operations', () => {
      it('should throw error for absolute value of NaN', () => {
        expect(() => service.absolute(NaN)).toThrow(BadRequestException);
        expect(() => service.absolute(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });

      it('should throw error for ceiling of NaN', () => {
        expect(() => service.ceiling(NaN)).toThrow(BadRequestException);
        expect(() => service.ceiling(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });

      it('should throw error for floor of NaN', () => {
        expect(() => service.floor(NaN)).toThrow(BadRequestException);
        expect(() => service.floor(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });

      it('should throw error for round of NaN', () => {
        expect(() => service.round(NaN)).toThrow(BadRequestException);
        expect(() => service.round(NaN)).toThrow(
          'Operand must be a valid finite number',
        );
      });
    });
  });

  describe('Invalid Number Inputs (Infinity)', () => {
    describe('add operation', () => {
      it('should throw error for positive Infinity as first operand', () => {
        expect(() => service.add(Infinity, 5)).toThrow(BadRequestException);
        expect(() => service.add(Infinity, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for positive Infinity as second operand', () => {
        expect(() => service.add(5, Infinity)).toThrow(BadRequestException);
        expect(() => service.add(5, Infinity)).toThrow(
          'Second operand must be a valid finite number',
        );
      });

      it('should throw error for negative Infinity as first operand', () => {
        expect(() => service.add(-Infinity, 5)).toThrow(BadRequestException);
        expect(() => service.add(-Infinity, 5)).toThrow(
          'First operand must be a valid finite number',
        );
      });

      it('should throw error for negative Infinity as second operand', () => {
        expect(() => service.add(5, -Infinity)).toThrow(BadRequestException);
        expect(() => service.add(5, -Infinity)).toThrow(
          'Second operand must be a valid finite number',
        );
      });

      it('should throw error for Infinity plus Infinity', () => {
        expect(() => service.add(Infinity, Infinity)).toThrow(
          BadRequestException,
        );
      });
    });

    describe('subtract operation', () => {
      it('should throw error for positive Infinity as first operand', () => {
        expect(() => service.subtract(Infinity, 5)).toThrow(
          BadRequestException,
        );
      });

      it('should throw error for positive Infinity as second operand', () => {
        expect(() => service.subtract(5, Infinity)).toThrow(
          BadRequestException,
        );
      });

      it('should throw error for negative Infinity as first operand', () => {
        expect(() => service.subtract(-Infinity, 5)).toThrow(
          BadRequestException,
        );
      });

      it('should throw error for negative Infinity as second operand', () => {
        expect(() => service.subtract(5, -Infinity)).toThrow(
          BadRequestException,
        );
      });
    });

    describe('multiply operation', () => {
      it('should throw error for positive Infinity as first operand', () => {
        expect(() => service.multiply(Infinity, 5)).toThrow(
          BadRequestException,
        );
      });

      it('should throw error for positive Infinity as second operand', () => {
        expect(() => service.multiply(5, Infinity)).toThrow(
          BadRequestException,
        );
      });

      it('should throw error for negative Infinity', () => {
        expect(() => service.multiply(-Infinity, 5)).toThrow(
          BadRequestException,
        );
      });
    });

    describe('divide operation', () => {
      it('should throw error for positive Infinity as numerator', () => {
        expect(() => service.divide(Infinity, 5)).toThrow(BadRequestException);
      });

      it('should throw error for positive Infinity as denominator', () => {
        expect(() => service.divide(5, Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for negative Infinity as numerator', () => {
        expect(() => service.divide(-Infinity, 5)).toThrow(BadRequestException);
      });

      it('should throw error for negative Infinity as denominator', () => {
        expect(() => service.divide(5, -Infinity)).toThrow(BadRequestException);
      });
    });

    describe('unary operations', () => {
      it('should throw error for absolute value of Infinity', () => {
        expect(() => service.absolute(Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for absolute value of negative Infinity', () => {
        expect(() => service.absolute(-Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for ceiling of Infinity', () => {
        expect(() => service.ceiling(Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for floor of Infinity', () => {
        expect(() => service.floor(Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for round of Infinity', () => {
        expect(() => service.round(Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for sqrt of Infinity', () => {
        expect(() => service.sqrt(Infinity)).toThrow(BadRequestException);
      });

      it('should throw error for factorial of Infinity', () => {
        expect(() => service.factorial(Infinity)).toThrow(BadRequestException);
      });
    });
  });

  describe('Boundary Values - JavaScript Number Limits', () => {
    describe('MAX_SAFE_INTEGER operations', () => {
      const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991

      it('should handle addition at MAX_SAFE_INTEGER boundary', () => {
        expect(service.add(maxSafe, 0)).toBe(maxSafe);
      });

      it('should handle subtraction at MAX_SAFE_INTEGER boundary', () => {
        expect(service.subtract(maxSafe, 0)).toBe(maxSafe);
      });

      it('should handle multiplication with MAX_SAFE_INTEGER', () => {
        expect(service.multiply(maxSafe, 1)).toBe(maxSafe);
      });

      it('should handle division with MAX_SAFE_INTEGER', () => {
        expect(service.divide(maxSafe, 1)).toBe(maxSafe);
      });

      it('should handle division of MAX_SAFE_INTEGER by itself', () => {
        expect(service.divide(maxSafe, maxSafe)).toBe(1);
      });
    });

    describe('MIN_SAFE_INTEGER operations', () => {
      const minSafe = Number.MIN_SAFE_INTEGER; // -9007199254740991

      it('should handle addition at MIN_SAFE_INTEGER boundary', () => {
        expect(service.add(minSafe, 0)).toBe(minSafe);
      });

      it('should handle subtraction at MIN_SAFE_INTEGER boundary', () => {
        expect(service.subtract(minSafe, 0)).toBe(minSafe);
      });

      it('should handle multiplication with MIN_SAFE_INTEGER', () => {
        expect(service.multiply(minSafe, 1)).toBe(minSafe);
      });

      it('should handle absolute value of MIN_SAFE_INTEGER', () => {
        expect(service.absolute(minSafe)).toBe(Math.abs(minSafe));
      });
    });

    describe('MIN_VALUE operations (smallest positive number)', () => {
      const minValue = Number.MIN_VALUE; // 5e-324

      it('should handle addition with MIN_VALUE', () => {
        expect(service.add(minValue, minValue)).toBeGreaterThan(0);
      });

      it('should handle multiplication with MIN_VALUE', () => {
        expect(service.multiply(minValue, 2)).toBeGreaterThan(minValue);
      });

      it('should handle division with MIN_VALUE as dividend', () => {
        const result = service.divide(minValue, 2);
        // MIN_VALUE divided by 2 may underflow to 0 in JavaScript
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });

    describe('MAX_VALUE boundary (largest finite number)', () => {
      const maxValue = Number.MAX_VALUE; // ~1.7976931348623157e+308

      it('should handle division with MAX_VALUE as dividend', () => {
        expect(service.divide(maxValue, 2)).toBeLessThan(maxValue);
      });

      it('should handle division with MAX_VALUE as divisor', () => {
        expect(service.divide(100, maxValue)).toBeCloseTo(0);
      });
    });

    describe('Epsilon operations (smallest difference)', () => {
      const epsilon = Number.EPSILON; // 2.220446049250313e-16

      it('should handle addition with epsilon', () => {
        expect(service.add(1, epsilon)).toBeGreaterThan(1);
      });

      it('should handle subtraction with epsilon', () => {
        expect(service.subtract(1, epsilon)).toBeLessThan(1);
      });

      it('should handle multiplication with epsilon', () => {
        expect(service.multiply(epsilon, epsilon)).toBeGreaterThan(0);
      });
    });
  });

  describe('Boundary Values - Operation Results', () => {
    describe('Power operation overflow', () => {
      it('should throw error when power result exceeds finite bounds', () => {
        expect(() => service.power(10, 1000)).toThrow(BadRequestException);
        expect(() => service.power(10, 1000)).toThrow(
          'Power operation resulted in non-finite number',
        );
      });

      it('should throw error for negative base with fractional exponent', () => {
        expect(() => service.power(-4, 0.5)).toThrow(BadRequestException);
        expect(() => service.power(-4, 0.5)).toThrow(
          'Power operation resulted in non-finite number',
        );
      });

      it('should throw error for large base and exponent', () => {
        expect(() => service.power(999999, 999999)).toThrow(
          BadRequestException,
        );
      });
    });

    describe('Factorial boundary conditions', () => {
      it('should throw error for factorial greater than 170', () => {
        expect(() => service.factorial(171)).toThrow(BadRequestException);
        expect(() => service.factorial(171)).toThrow(
          'Factorial input too large (maximum is 170)',
        );
      });

      it('should throw error for factorial of 500', () => {
        expect(() => service.factorial(500)).toThrow(BadRequestException);
        expect(() => service.factorial(500)).toThrow(
          'Factorial input too large (maximum is 170)',
        );
      });

      it('should calculate factorial at maximum allowed value', () => {
        const result = service.factorial(170);
        expect(result).toBeGreaterThan(0);
        expect(Number.isFinite(result)).toBe(true);
      });

      it('should throw error for fractional factorial', () => {
        expect(() => service.factorial(5.5)).toThrow(BadRequestException);
        expect(() => service.factorial(5.5)).toThrow(
          'Factorial requires an integer input',
        );
      });

      it('should throw error for negative factorial', () => {
        expect(() => service.factorial(-1)).toThrow(BadRequestException);
        expect(() => service.factorial(-1)).toThrow(
          'Cannot calculate factorial of negative number',
        );
      });
    });

    describe('Square root boundary conditions', () => {
      it('should throw error for square root of negative number', () => {
        expect(() => service.sqrt(-1)).toThrow(BadRequestException);
        expect(() => service.sqrt(-1)).toThrow(
          'Cannot calculate square root of negative number',
        );
      });

      it('should throw error for square root of large negative number', () => {
        expect(() => service.sqrt(-1000000)).toThrow(BadRequestException);
        expect(() => service.sqrt(-1000000)).toThrow(
          'Cannot calculate square root of negative number',
        );
      });

      it('should handle square root of zero', () => {
        expect(service.sqrt(0)).toBe(0);
      });

      it('should handle square root of very large number', () => {
        expect(service.sqrt(Number.MAX_SAFE_INTEGER)).toBeGreaterThan(0);
      });
    });
  });

  describe('Special Values and Edge Cases', () => {
    describe('Zero operations', () => {
      it('should handle zero plus zero', () => {
        expect(service.add(0, 0)).toBe(0);
      });

      it('should handle zero minus zero', () => {
        expect(service.subtract(0, 0)).toBe(0);
      });

      it('should handle zero times any number', () => {
        expect(service.multiply(0, 1000000)).toBe(0);
        expect(service.multiply(1000000, 0)).toBe(0);
      });

      it('should handle zero divided by non-zero', () => {
        expect(service.divide(0, 5)).toBe(0);
      });

      it('should handle zero to positive power', () => {
        expect(service.power(0, 5)).toBe(0);
      });

      it('should handle any number to power of zero', () => {
        expect(service.power(5, 0)).toBe(1);
        expect(service.power(1000, 0)).toBe(1);
      });
    });

    describe('Negative zero handling', () => {
      it('should handle negative zero in division', () => {
        const result = service.divide(0, -5);
        expect(Math.abs(result)).toBe(0);
      });

      it('should handle negative zero in multiplication', () => {
        const result = service.multiply(0, -5);
        expect(Math.abs(result)).toBe(0);
      });
    });

    describe('Very small decimal operations', () => {
      it('should handle addition of very small decimals', () => {
        expect(service.add(0.0000001, 0.0000002)).toBeCloseTo(0.0000003);
      });

      it('should handle multiplication of very small decimals', () => {
        expect(service.multiply(0.001, 0.001)).toBeCloseTo(0.000001);
      });

      it('should handle division resulting in very small decimals', () => {
        expect(service.divide(1, 1000000)).toBeCloseTo(0.000001);
      });
    });

    describe('Floating point precision edge cases', () => {
      it('should handle classic floating point addition issue', () => {
        const result = service.add(0.1, 0.2);
        expect(result).toBeCloseTo(0.3);
      });

      it('should handle floating point subtraction precision', () => {
        const result = service.subtract(1, 0.9);
        expect(result).toBeCloseTo(0.1);
      });

      it('should handle floating point multiplication precision', () => {
        const result = service.multiply(0.1, 0.2);
        expect(result).toBeCloseTo(0.02);
      });
    });

    describe('Modulo edge cases', () => {
      it('should handle modulo with negative dividend', () => {
        expect(service.modulo(-7, 3)).toBe(-1);
      });

      it('should handle modulo with negative divisor', () => {
        expect(service.modulo(7, -3)).toBe(1);
      });

      it('should handle modulo with both negative', () => {
        expect(service.modulo(-7, -3)).toBe(-1);
      });

      it('should handle modulo when dividend is smaller than divisor', () => {
        expect(service.modulo(3, 7)).toBe(3);
      });

      it('should handle modulo with decimal numbers', () => {
        expect(service.modulo(5.5, 2)).toBeCloseTo(1.5);
      });
    });

    describe('Rounding edge cases', () => {
      it('should handle ceiling with very small positive decimal', () => {
        expect(service.ceiling(0.0001)).toBe(1);
      });

      it('should handle floor with very small negative decimal', () => {
        expect(service.floor(-0.0001)).toBe(-1);
      });

      it('should handle rounding at exactly 0.5', () => {
        expect(service.round(0.5)).toBe(1);
        expect(service.round(1.5)).toBe(2);
      });

      it('should handle rounding at negative 0.5', () => {
        expect(service.round(-0.5)).toBe(-0);
      });
    });
  });

  describe('Error Message Consistency', () => {
    it('should provide consistent error messages for invalid first operand across operations', () => {
      const expectedMessage = 'First operand must be a valid finite number';

      expect(() => service.add(NaN, 5)).toThrow(expectedMessage);
      expect(() => service.subtract(NaN, 5)).toThrow(expectedMessage);
      expect(() => service.multiply(NaN, 5)).toThrow(expectedMessage);
      expect(() => service.divide(NaN, 5)).toThrow(expectedMessage);
      expect(() => service.power(NaN, 5)).toThrow(expectedMessage);
      expect(() => service.modulo(NaN, 5)).toThrow(expectedMessage);
    });

    it('should provide consistent error messages for invalid second operand across operations', () => {
      const expectedMessage = 'Second operand must be a valid finite number';

      expect(() => service.add(5, NaN)).toThrow(expectedMessage);
      expect(() => service.subtract(5, NaN)).toThrow(expectedMessage);
      expect(() => service.multiply(5, NaN)).toThrow(expectedMessage);
      expect(() => service.divide(5, NaN)).toThrow(expectedMessage);
      expect(() => service.power(5, NaN)).toThrow(expectedMessage);
      expect(() => service.modulo(5, NaN)).toThrow(expectedMessage);
    });

    it('should provide consistent error messages for unary operations', () => {
      const expectedMessage = 'Operand must be a valid finite number';

      expect(() => service.sqrt(NaN)).toThrow(expectedMessage);
      expect(() => service.absolute(NaN)).toThrow(expectedMessage);
      expect(() => service.ceiling(NaN)).toThrow(expectedMessage);
      expect(() => service.floor(NaN)).toThrow(expectedMessage);
      expect(() => service.round(NaN)).toThrow(expectedMessage);
      expect(() => service.factorial(NaN)).toThrow(expectedMessage);
    });

    it('should provide clear error message for division by zero', () => {
      expect(() => service.divide(5, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should provide clear error message for modulo by zero', () => {
      expect(() => service.modulo(5, 0)).toThrow(
        'Modulo by zero is not allowed',
      );
    });

    it('should provide clear error message for square root of negative', () => {
      expect(() => service.sqrt(-4)).toThrow(
        'Cannot calculate square root of negative number',
      );
    });

    it('should provide clear error message for negative factorial', () => {
      expect(() => service.factorial(-5)).toThrow(
        'Cannot calculate factorial of negative number',
      );
    });

    it('should provide clear error message for non-integer factorial', () => {
      expect(() => service.factorial(5.5)).toThrow(
        'Factorial requires an integer input',
      );
    });

    it('should provide clear error message for factorial overflow', () => {
      expect(() => service.factorial(171)).toThrow(
        'Factorial input too large (maximum is 170)',
      );
    });

    it('should provide clear error message for power overflow', () => {
      expect(() => service.power(10, 1000)).toThrow(
        'Power operation resulted in non-finite number',
      );
    });
  });

  describe('Type Coercion Edge Cases', () => {
    it('should handle string-like numbers that get coerced (undefined behavior)', () => {
      // Note: In actual API, ParseFloatPipe would handle this before service
      // These tests verify service behavior if invalid types somehow reach it
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const notANumber = undefined as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => service.add(notANumber, 5)).toThrow(BadRequestException);
    });

    it('should handle null values that get coerced (undefined behavior)', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const nullValue = null as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => service.add(nullValue, 5)).toThrow(BadRequestException);
    });
  });

  describe('Performance and Stress Edge Cases', () => {
    it('should handle repeated operations without degradation', () => {
      for (let i = 0; i < 1000; i++) {
        expect(service.add(1, 1)).toBe(2);
      }
    });

    it('should handle large multiplication chains', () => {
      let result = 1;
      for (let i = 1; i <= 5; i++) {
        result = service.multiply(result, 2);
      }
      expect(result).toBe(32);
    });

    it('should handle complex calculation chains', () => {
      const step1 = service.add(10, 5); // 15
      const step2 = service.multiply(step1, 2); // 30
      const step3 = service.divide(step2, 3); // 10
      const step4 = service.subtract(step3, 5); // 5
      expect(step4).toBe(5);
    });
  });
});

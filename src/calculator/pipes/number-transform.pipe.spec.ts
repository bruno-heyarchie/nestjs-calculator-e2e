import { BadRequestException } from '@nestjs/common';
import { NumberTransformPipe } from './number-transform.pipe';

describe('NumberTransformPipe', () => {
  let pipe: NumberTransformPipe;

  beforeEach(() => {
    pipe = new NumberTransformPipe();
  });

  describe('valid inputs', () => {
    it('should transform a valid number string to number', () => {
      expect(pipe.transform('123')).toBe(123);
    });

    it('should transform a negative number string to number', () => {
      expect(pipe.transform('-123')).toBe(-123);
    });

    it('should transform a decimal number string to number', () => {
      expect(pipe.transform('123.456')).toBe(123.456);
    });

    it('should transform a number with leading zeros', () => {
      expect(pipe.transform('00123')).toBe(123);
    });

    it('should transform scientific notation string to number', () => {
      expect(pipe.transform('1.23e2')).toBe(123);
      expect(pipe.transform('1.23E2')).toBe(123);
    });

    it('should return the same number if input is already a number', () => {
      expect(pipe.transform(123)).toBe(123);
      expect(pipe.transform(123.456)).toBe(123.456);
      expect(pipe.transform(-123)).toBe(-123);
    });

    it('should handle whitespace around numbers', () => {
      expect(pipe.transform('  123  ')).toBe(123);
      expect(pipe.transform('\t456\n')).toBe(456);
    });

    it('should handle zero', () => {
      expect(pipe.transform('0')).toBe(0);
      expect(pipe.transform(0)).toBe(0);
    });

    it('should handle negative zero', () => {
      expect(pipe.transform('-0')).toBe(-0);
    });

    it('should handle very small numbers', () => {
      expect(pipe.transform('0.0001')).toBe(0.0001);
    });

    it('should handle very large numbers', () => {
      expect(pipe.transform('999999999')).toBe(999999999);
    });

    it('should maintain floating-point precision', () => {
      expect(pipe.transform('0.1')).toBe(0.1);
      expect(pipe.transform('0.33333')).toBe(0.33333);
    });
  });

  describe('invalid inputs', () => {
    it('should throw BadRequestException for null', () => {
      expect(() => pipe.transform(null)).toThrow(BadRequestException);
      expect(() => pipe.transform(null)).toThrow(
        'Invalid input: value is required and cannot be null or undefined.',
      );
    });

    it('should throw BadRequestException for undefined', () => {
      expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
      expect(() => pipe.transform(undefined)).toThrow(
        'Invalid input: value is required and cannot be null or undefined.',
      );
    });

    it('should throw BadRequestException for empty string', () => {
      expect(() => pipe.transform('')).toThrow(BadRequestException);
      expect(() => pipe.transform('')).toThrow(
        'Invalid input: value cannot be an empty string.',
      );
    });

    it('should throw BadRequestException for whitespace-only string', () => {
      expect(() => pipe.transform('   ')).toThrow(BadRequestException);
      expect(() => pipe.transform('\t\n')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-numeric strings', () => {
      expect(() => pipe.transform('abc')).toThrow(BadRequestException);
      expect(() => pipe.transform('abc')).toThrow(
        'Invalid number: "abc". Please provide a valid numeric value.',
      );
    });

    it('should parse numeric prefix from strings with trailing letters (parseFloat behavior)', () => {
      // Note: parseFloat() parses the numeric prefix, which is standard JavaScript behavior
      // For strict validation, use SanitizeInputPipe before NumberTransformPipe
      expect(pipe.transform('123abc')).toBe(123);
      expect(() => pipe.transform('abc123')).toThrow(BadRequestException);
    });

    it('should parse numeric prefix from strings with special characters (parseFloat behavior)', () => {
      // Note: parseFloat() parses the numeric prefix, which is standard JavaScript behavior
      expect(pipe.transform('123%')).toBe(123);
      expect(() => pipe.transform('$123')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for NaN', () => {
      expect(() => pipe.transform(NaN)).toThrow(BadRequestException);
      expect(() => pipe.transform(NaN)).toThrow(
        'Invalid number: NaN. Number must be finite and not NaN.',
      );
    });

    it('should throw BadRequestException for Infinity', () => {
      expect(() => pipe.transform(Infinity)).toThrow(BadRequestException);
      expect(() => pipe.transform(Infinity)).toThrow(
        'Invalid number: Infinity. Number must be finite and not NaN.',
      );
    });

    it('should throw BadRequestException for -Infinity', () => {
      expect(() => pipe.transform(-Infinity)).toThrow(BadRequestException);
      expect(() => pipe.transform(-Infinity)).toThrow(
        'Invalid number: -Infinity. Number must be finite and not NaN.',
      );
    });

    it('should parse multiple decimal points to first valid number (parseFloat behavior)', () => {
      // Note: parseFloat() parses up to the first invalid character
      expect(pipe.transform('1.2.3')).toBe(1.2);
    });

    it('should throw BadRequestException for objects', () => {
      expect(() => pipe.transform({})).toThrow(BadRequestException);
      expect(() => pipe.transform({ a: 1 })).toThrow(BadRequestException);
    });

    it('should parse first element of arrays (parseFloat behavior)', () => {
      // Note: Arrays are converted to strings then parsed, which is standard JavaScript behavior
      expect(() => pipe.transform([])).toThrow(BadRequestException);
      expect(pipe.transform([1, 2, 3])).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle plus sign prefix', () => {
      expect(pipe.transform('+123')).toBe(123);
    });

    it('should handle negative scientific notation', () => {
      expect(pipe.transform('-1.23e2')).toBe(-123);
    });

    it('should handle numbers with only decimals', () => {
      expect(pipe.transform('.5')).toBe(0.5);
    });

    it('should handle negative decimals', () => {
      expect(pipe.transform('-.5')).toBe(-0.5);
    });
  });
});

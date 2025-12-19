import { BadRequestException } from '@nestjs/common';
import { SanitizeInputPipe } from './sanitize-input.pipe';

describe('SanitizeInputPipe', () => {
  let pipe: SanitizeInputPipe;

  beforeEach(() => {
    pipe = new SanitizeInputPipe();
  });

  describe('valid inputs', () => {
    it('should return a number as a string', () => {
      expect(pipe.transform(123)).toBe('123');
    });

    it('should return a clean numeric string as-is', () => {
      expect(pipe.transform('123')).toBe('123');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(pipe.transform('  123  ')).toBe('123');
      expect(pipe.transform('\t456\n')).toBe('456');
    });

    it('should remove spaces within numbers', () => {
      expect(pipe.transform('1 000')).toBe('1000');
      expect(pipe.transform('1 234 567')).toBe('1234567');
    });

    it('should handle negative numbers', () => {
      expect(pipe.transform('-123')).toBe('-123');
      expect(pipe.transform('  -456  ')).toBe('-456');
    });

    it('should handle positive sign', () => {
      expect(pipe.transform('+123')).toBe('+123');
    });

    it('should handle decimal numbers', () => {
      expect(pipe.transform('123.456')).toBe('123.456');
      expect(pipe.transform('.5')).toBe('.5');
    });

    it('should handle scientific notation', () => {
      expect(pipe.transform('1.23e2')).toBe('1.23e2');
      expect(pipe.transform('1.23E2')).toBe('1.23E2');
      expect(pipe.transform('1e-5')).toBe('1e-5');
    });

    it('should handle negative scientific notation', () => {
      expect(pipe.transform('-1.23e2')).toBe('-1.23e2');
    });

    it('should handle zero', () => {
      expect(pipe.transform('0')).toBe('0');
      expect(pipe.transform(0)).toBe('0');
    });

    it('should handle negative zero', () => {
      expect(pipe.transform('-0')).toBe('-0');
    });

    it('should remove multiple consecutive spaces', () => {
      expect(pipe.transform('1   2   3')).toBe('123');
    });

    it('should handle numbers with leading zeros', () => {
      expect(pipe.transform('00123')).toBe('00123');
    });

    it('should handle very small decimal numbers', () => {
      expect(pipe.transform('0.0001')).toBe('0.0001');
    });

    it('should handle very large numbers', () => {
      expect(pipe.transform('999999999')).toBe('999999999');
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

    it('should throw BadRequestException for letters', () => {
      expect(() => pipe.transform('abc')).toThrow(BadRequestException);
      expect(() => pipe.transform('abc')).toThrow(
        /contains invalid characters/,
      );
    });

    it('should throw BadRequestException for strings with letters', () => {
      expect(() => pipe.transform('123abc')).toThrow(BadRequestException);
      expect(() => pipe.transform('abc123')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for special characters', () => {
      expect(() => pipe.transform('$123')).toThrow(BadRequestException);
      expect(() => pipe.transform('123%')).toThrow(BadRequestException);
      expect(() => pipe.transform('123#')).toThrow(BadRequestException);
      expect(() => pipe.transform('123@')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for currency symbols', () => {
      expect(() => pipe.transform('$100')).toThrow(BadRequestException);
      expect(() => pipe.transform('€100')).toThrow(BadRequestException);
      expect(() => pipe.transform('£100')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for parentheses', () => {
      expect(() => pipe.transform('(123)')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for commas', () => {
      expect(() => pipe.transform('1,000')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for underscores', () => {
      expect(() => pipe.transform('1_000')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for mixed invalid characters', () => {
      expect(() => pipe.transform('123!@#')).toThrow(BadRequestException);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple signs (though may be invalid number)', () => {
      expect(pipe.transform('+-123')).toBe('+-123');
    });

    it('should handle multiple decimal points (though may be invalid number)', () => {
      expect(pipe.transform('1.2.3')).toBe('1.2.3');
    });

    it('should handle numbers starting with decimal point', () => {
      expect(pipe.transform('.123')).toBe('.123');
    });

    it('should handle numbers ending with decimal point', () => {
      expect(pipe.transform('123.')).toBe('123.');
    });

    it('should handle negative number with spaces', () => {
      expect(pipe.transform('- 123')).toBe('-123');
    });

    it('should handle scientific notation with spaces', () => {
      expect(pipe.transform('1.23 e 2')).toBe('1.23e2');
    });

    it('should handle complex scientific notation', () => {
      expect(pipe.transform('1.23e-10')).toBe('1.23e-10');
    });
  });

  describe('number conversion', () => {
    it('should convert negative numbers to string', () => {
      expect(pipe.transform(-123)).toBe('-123');
    });

    it('should convert decimal numbers to string', () => {
      expect(pipe.transform(123.456)).toBe('123.456');
    });

    it('should convert very large numbers to string', () => {
      expect(pipe.transform(999999999)).toBe('999999999');
    });

    it('should convert very small numbers to string', () => {
      expect(pipe.transform(0.0001)).toBe('0.0001');
    });
  });
});

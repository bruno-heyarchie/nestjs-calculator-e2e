import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(service.add(5, 3)).toBe(8);
    });

    it('should add two negative numbers', () => {
      expect(service.add(-5, -3)).toBe(-8);
    });

    it('should add positive and negative numbers', () => {
      expect(service.add(5, -3)).toBe(2);
    });

    it('should add zero to a number', () => {
      expect(service.add(5, 0)).toBe(5);
    });

    it('should add zero to zero', () => {
      expect(service.add(0, 0)).toBe(0);
    });

    it('should add decimal numbers', () => {
      expect(service.add(1.5, 2.3)).toBeCloseTo(3.8);
    });

    it('should add very large numbers', () => {
      expect(service.add(1000000, 2000000)).toBe(3000000);
    });

    it('should add very small decimal numbers', () => {
      expect(service.add(0.1, 0.2)).toBeCloseTo(0.3);
    });

    it('should add negative decimal numbers', () => {
      expect(service.add(-1.5, -2.5)).toBe(-4);
    });

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

    it('should throw error for Infinity as first operand', () => {
      expect(() => service.add(Infinity, 5)).toThrow(BadRequestException);
      expect(() => service.add(Infinity, 5)).toThrow(
        'First operand must be a valid finite number',
      );
    });

    it('should throw error for Infinity as second operand', () => {
      expect(() => service.add(5, Infinity)).toThrow(BadRequestException);
      expect(() => service.add(5, Infinity)).toThrow(
        'Second operand must be a valid finite number',
      );
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.add(-Infinity, 5)).toThrow(BadRequestException);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(service.subtract(5, 3)).toBe(2);
    });

    it('should subtract two negative numbers', () => {
      expect(service.subtract(-5, -3)).toBe(-2);
    });

    it('should subtract negative from positive', () => {
      expect(service.subtract(5, -3)).toBe(8);
    });

    it('should subtract zero from a number', () => {
      expect(service.subtract(5, 0)).toBe(5);
    });

    it('should subtract a number from zero', () => {
      expect(service.subtract(0, 5)).toBe(-5);
    });

    it('should subtract zero from zero', () => {
      expect(service.subtract(0, 0)).toBe(0);
    });

    it('should subtract decimal numbers', () => {
      expect(service.subtract(5.5, 2.3)).toBeCloseTo(3.2);
    });

    it('should subtract large numbers', () => {
      expect(service.subtract(1000000, 500000)).toBe(500000);
    });

    it('should handle negative result from positive numbers', () => {
      expect(service.subtract(3, 5)).toBe(-2);
    });

    it('should subtract negative decimal numbers', () => {
      expect(service.subtract(-5.5, -2.5)).toBe(-3);
    });

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

    it('should throw error for Infinity as first operand', () => {
      expect(() => service.subtract(Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity as first operand', () => {
      expect(() => service.subtract(-Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity as second operand', () => {
      expect(() => service.subtract(5, Infinity)).toThrow(BadRequestException);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(service.multiply(5, 3)).toBe(15);
    });

    it('should multiply two negative numbers', () => {
      expect(service.multiply(-5, -3)).toBe(15);
    });

    it('should multiply positive and negative numbers', () => {
      expect(service.multiply(5, -3)).toBe(-15);
    });

    it('should multiply by zero', () => {
      expect(service.multiply(5, 0)).toBe(0);
    });

    it('should multiply zero by zero', () => {
      expect(service.multiply(0, 0)).toBe(0);
    });

    it('should multiply zero by negative number', () => {
      const result = service.multiply(0, -5);
      // JavaScript can return -0, so we check the absolute value
      expect(Math.abs(result)).toBe(0);
    });

    it('should multiply by one', () => {
      expect(service.multiply(5, 1)).toBe(5);
    });

    it('should multiply by negative one', () => {
      expect(service.multiply(5, -1)).toBe(-5);
    });

    it('should multiply decimal numbers', () => {
      expect(service.multiply(2.5, 4)).toBe(10);
    });

    it('should multiply two decimal numbers', () => {
      expect(service.multiply(2.5, 3.5)).toBeCloseTo(8.75);
    });

    it('should multiply negative decimal numbers', () => {
      expect(service.multiply(-2.5, -4)).toBe(10);
    });

    it('should multiply large numbers', () => {
      expect(service.multiply(1000, 2000)).toBe(2000000);
    });

    it('should multiply very small decimal numbers', () => {
      expect(service.multiply(0.1, 0.2)).toBeCloseTo(0.02);
    });

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

    it('should throw error for Infinity as first operand', () => {
      expect(() => service.multiply(Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity as first operand', () => {
      expect(() => service.multiply(-Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity as second operand', () => {
      expect(() => service.multiply(5, Infinity)).toThrow(BadRequestException);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(service.divide(6, 3)).toBe(2);
    });

    it('should divide two negative numbers', () => {
      expect(service.divide(-6, -3)).toBe(2);
    });

    it('should divide positive by negative', () => {
      expect(service.divide(6, -3)).toBe(-2);
    });

    it('should divide negative by positive', () => {
      expect(service.divide(-6, 3)).toBe(-2);
    });

    it('should divide zero by a number', () => {
      expect(service.divide(0, 5)).toBe(0);
    });

    it('should divide zero by negative number', () => {
      const result = service.divide(0, -5);
      // JavaScript can return -0, so we check the absolute value
      expect(Math.abs(result)).toBe(0);
    });

    it('should divide by one', () => {
      expect(service.divide(5, 1)).toBe(5);
    });

    it('should divide by negative one', () => {
      expect(service.divide(5, -1)).toBe(-5);
    });

    it('should divide decimal numbers', () => {
      expect(service.divide(7.5, 2.5)).toBe(3);
    });

    it('should divide with decimal result', () => {
      expect(service.divide(5, 2)).toBe(2.5);
    });

    it('should divide decimals resulting in decimal', () => {
      expect(service.divide(10.5, 3)).toBeCloseTo(3.5);
    });

    it('should divide large numbers', () => {
      expect(service.divide(1000000, 1000)).toBe(1000);
    });

    it('should divide small decimal numbers', () => {
      expect(service.divide(0.5, 0.1)).toBeCloseTo(5);
    });

    it('should handle division resulting in repeating decimal', () => {
      expect(service.divide(10, 3)).toBeCloseTo(3.333333, 5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => service.divide(5, 0)).toThrow(BadRequestException);
      expect(() => service.divide(5, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing zero by zero', () => {
      expect(() => service.divide(0, 0)).toThrow(BadRequestException);
      expect(() => service.divide(0, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

    it('should throw error when dividing negative number by zero', () => {
      expect(() => service.divide(-5, 0)).toThrow(BadRequestException);
      expect(() => service.divide(-5, 0)).toThrow(
        'Division by zero is not allowed',
      );
    });

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

    it('should throw error for Infinity as first operand', () => {
      expect(() => service.divide(Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity as first operand', () => {
      expect(() => service.divide(-Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity as second operand', () => {
      expect(() => service.divide(5, Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity as second operand', () => {
      expect(() => service.divide(5, -Infinity)).toThrow(BadRequestException);
    });
  });
});

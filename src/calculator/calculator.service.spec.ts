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

    it('should add decimal numbers', () => {
      expect(service.add(1.5, 2.3)).toBeCloseTo(3.8);
    });

    it('should throw error for NaN', () => {
      expect(() => service.add(NaN, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity', () => {
      expect(() => service.add(Infinity, 5)).toThrow(BadRequestException);
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

    it('should subtract decimal numbers', () => {
      expect(service.subtract(5.5, 2.3)).toBeCloseTo(3.2);
    });

    it('should throw error for NaN', () => {
      expect(() => service.subtract(5, NaN)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity', () => {
      expect(() => service.subtract(-Infinity, 5)).toThrow(BadRequestException);
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

    it('should multiply decimal numbers', () => {
      expect(service.multiply(2.5, 4)).toBe(10);
    });

    it('should throw error for NaN', () => {
      expect(() => service.multiply(NaN, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity', () => {
      expect(() => service.multiply(Infinity, 5)).toThrow(BadRequestException);
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

    it('should divide zero by a number', () => {
      expect(service.divide(0, 5)).toBe(0);
    });

    it('should divide decimal numbers', () => {
      expect(service.divide(7.5, 2.5)).toBe(3);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => service.divide(5, 0)).toThrow(BadRequestException);
      expect(() => service.divide(5, 0)).toThrow('Division by zero is not allowed');
    });

    it('should throw error for NaN', () => {
      expect(() => service.divide(NaN, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity', () => {
      expect(() => service.divide(5, Infinity)).toThrow(BadRequestException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { ValidationService } from './validation/validation.service';
import { CalculationResultDto } from './dto/calculation-result.dto';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService, ValidationService],
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
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as second operand', () => {
      expect(() => service.add(5, NaN)).toThrow(BadRequestException);
      expect(() => service.add(5, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
      );
    });

    it('should throw error for Infinity as first operand', () => {
      expect(() => service.add(Infinity, 5)).toThrow(BadRequestException);
      expect(() => service.add(Infinity, 5)).toThrow(
        'First operand: First operand must be a finite number',
      );
    });

    it('should throw error for Infinity as second operand', () => {
      expect(() => service.add(5, Infinity)).toThrow(BadRequestException);
      expect(() => service.add(5, Infinity)).toThrow(
        'Second operand: Second operand must be a finite number',
      );
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.add(-Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw OverflowError when result exceeds MAX_SAFE_INTEGER', () => {
      expect(() => service.add(Number.MAX_SAFE_INTEGER, 1)).toThrow(
        BadRequestException,
      );
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
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as second operand', () => {
      expect(() => service.subtract(5, NaN)).toThrow(BadRequestException);
      expect(() => service.subtract(5, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
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

    it('should throw UnderflowError when result is below MIN_SAFE_INTEGER', () => {
      expect(() => service.subtract(Number.MIN_SAFE_INTEGER, 1)).toThrow(
        BadRequestException,
      );
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
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as second operand', () => {
      expect(() => service.multiply(5, NaN)).toThrow(BadRequestException);
      expect(() => service.multiply(5, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
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

    it('should throw OverflowError when result exceeds MAX_SAFE_INTEGER', () => {
      expect(() => service.multiply(Number.MAX_SAFE_INTEGER, 2)).toThrow(
        BadRequestException,
      );
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
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as second operand', () => {
      expect(() => service.divide(5, NaN)).toThrow(BadRequestException);
      expect(() => service.divide(5, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
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

  describe('power', () => {
    it('should calculate positive base to positive exponent', () => {
      expect(service.power(2, 3)).toBe(8);
    });

    it('should calculate positive base to zero exponent', () => {
      expect(service.power(5, 0)).toBe(1);
    });

    it('should calculate zero to positive exponent', () => {
      expect(service.power(0, 5)).toBe(0);
    });

    it('should calculate one to any exponent', () => {
      expect(service.power(1, 100)).toBe(1);
    });

    it('should calculate negative base to even exponent', () => {
      expect(service.power(-2, 2)).toBe(4);
    });

    it('should calculate negative base to odd exponent', () => {
      expect(service.power(-2, 3)).toBe(-8);
    });

    it('should calculate positive base to negative exponent', () => {
      expect(service.power(2, -2)).toBe(0.25);
    });

    it('should calculate decimal base to positive exponent', () => {
      expect(service.power(1.5, 2)).toBe(2.25);
    });

    it('should calculate base to decimal exponent', () => {
      expect(service.power(4, 0.5)).toBe(2);
    });

    it('should calculate large powers', () => {
      expect(service.power(10, 6)).toBe(1000000);
    });

    it('should calculate fractional powers', () => {
      expect(service.power(27, 1 / 3)).toBeCloseTo(3);
    });

    it('should throw error for NaN as base', () => {
      expect(() => service.power(NaN, 2)).toThrow(BadRequestException);
      expect(() => service.power(NaN, 2)).toThrow(
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as exponent', () => {
      expect(() => service.power(2, NaN)).toThrow(BadRequestException);
      expect(() => service.power(2, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
      );
    });

    it('should throw error for Infinity as base', () => {
      expect(() => service.power(Infinity, 2)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity as exponent', () => {
      expect(() => service.power(2, Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for result that is not finite', () => {
      expect(() => service.power(10, 1000)).toThrow(BadRequestException);
      expect(() => service.power(10, 1000)).toThrow(
        'Result is positive infinity',
      );
    });

    it('should throw error for negative base with fractional exponent', () => {
      expect(() => service.power(-4, 0.5)).toThrow(BadRequestException);
      expect(() => service.power(-4, 0.5)).toThrow('Result is not a number');
    });

    it('should throw OverflowError when result exceeds MAX_SAFE_INTEGER', () => {
      expect(() => service.power(Number.MAX_SAFE_INTEGER, 2)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('sqrt', () => {
    it('should calculate square root of positive number', () => {
      expect(service.sqrt(4)).toBe(2);
    });

    it('should calculate square root of zero', () => {
      expect(service.sqrt(0)).toBe(0);
    });

    it('should calculate square root of one', () => {
      expect(service.sqrt(1)).toBe(1);
    });

    it('should calculate square root of large number', () => {
      expect(service.sqrt(100)).toBe(10);
    });

    it('should calculate square root of decimal', () => {
      expect(service.sqrt(2.25)).toBe(1.5);
    });

    it('should calculate square root resulting in irrational number', () => {
      expect(service.sqrt(2)).toBeCloseTo(1.414213, 5);
    });

    it('should calculate square root of very small number', () => {
      expect(service.sqrt(0.01)).toBeCloseTo(0.1);
    });

    it('should calculate square root of very large number', () => {
      expect(service.sqrt(1000000)).toBe(1000);
    });

    it('should throw error for negative number', () => {
      expect(() => service.sqrt(-4)).toThrow(BadRequestException);
      expect(() => service.sqrt(-4)).toThrow(
        'Cannot calculate square root of negative number',
      );
    });

    it('should throw error for NaN', () => {
      expect(() => service.sqrt(NaN)).toThrow(BadRequestException);
      expect(() => service.sqrt(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.sqrt(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.sqrt(-Infinity)).toThrow(BadRequestException);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of zero', () => {
      expect(service.factorial(0)).toBe(1);
    });

    it('should calculate factorial of one', () => {
      expect(service.factorial(1)).toBe(1);
    });

    it('should calculate factorial of small positive integer', () => {
      expect(service.factorial(5)).toBe(120);
    });

    it('should calculate factorial of 10', () => {
      expect(service.factorial(10)).toBe(3628800);
    });

    it('should calculate factorial of larger integer', () => {
      expect(service.factorial(7)).toBe(5040);
    });

    it('should calculate factorial of 3', () => {
      expect(service.factorial(3)).toBe(6);
    });

    it('should calculate factorial of 4', () => {
      expect(service.factorial(4)).toBe(24);
    });

    it('should calculate factorial of 20', () => {
      expect(service.factorial(20)).toBe(2432902008176640000);
    });

    it('should throw error for negative number', () => {
      expect(() => service.factorial(-5)).toThrow(BadRequestException);
      expect(() => service.factorial(-5)).toThrow(
        'Cannot calculate factorial of negative number',
      );
    });

    it('should throw error for decimal number', () => {
      expect(() => service.factorial(5.5)).toThrow(BadRequestException);
      expect(() => service.factorial(5.5)).toThrow(
        'Operand: must be an integer',
      );
    });

    it('should throw error for NaN', () => {
      expect(() => service.factorial(NaN)).toThrow(BadRequestException);
      expect(() => service.factorial(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.factorial(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for number greater than 170', () => {
      expect(() => service.factorial(171)).toThrow(BadRequestException);
      expect(() => service.factorial(171)).toThrow(
        'Input too large (maximum is 170)',
      );
    });

    it('should throw error for large number', () => {
      expect(() => service.factorial(500)).toThrow(BadRequestException);
      expect(() => service.factorial(500)).toThrow(
        'Input too large (maximum is 170)',
      );
    });
  });

  describe('modulo', () => {
    it('should calculate modulo of two positive numbers', () => {
      expect(service.modulo(7, 3)).toBe(1);
    });

    it('should calculate modulo when dividend is smaller', () => {
      expect(service.modulo(3, 7)).toBe(3);
    });

    it('should calculate modulo with zero remainder', () => {
      expect(service.modulo(6, 3)).toBe(0);
    });

    it('should calculate modulo with negative dividend', () => {
      expect(service.modulo(-7, 3)).toBe(-1);
    });

    it('should calculate modulo with negative divisor', () => {
      expect(service.modulo(7, -3)).toBe(1);
    });

    it('should calculate modulo with both negative', () => {
      expect(service.modulo(-7, -3)).toBe(-1);
    });

    it('should calculate modulo with zero dividend', () => {
      expect(service.modulo(0, 5)).toBe(0);
    });

    it('should calculate modulo with decimal numbers', () => {
      expect(service.modulo(5.5, 2)).toBeCloseTo(1.5);
    });

    it('should calculate modulo with large numbers', () => {
      expect(service.modulo(1000000, 7)).toBe(1);
    });

    it('should throw error for modulo by zero', () => {
      expect(() => service.modulo(5, 0)).toThrow(BadRequestException);
      expect(() => service.modulo(5, 0)).toThrow(
        'Modulo by zero is not allowed',
      );
    });

    it('should throw error for NaN as dividend', () => {
      expect(() => service.modulo(NaN, 5)).toThrow(BadRequestException);
      expect(() => service.modulo(NaN, 5)).toThrow(
        'First operand: First operand must not be NaN',
      );
    });

    it('should throw error for NaN as divisor', () => {
      expect(() => service.modulo(5, NaN)).toThrow(BadRequestException);
      expect(() => service.modulo(5, NaN)).toThrow(
        'Second operand: Second operand must not be NaN',
      );
    });

    it('should throw error for Infinity as dividend', () => {
      expect(() => service.modulo(Infinity, 5)).toThrow(BadRequestException);
    });

    it('should throw error for Infinity as divisor', () => {
      expect(() => service.modulo(5, Infinity)).toThrow(BadRequestException);
    });
  });

  describe('absolute', () => {
    it('should return absolute value of positive number', () => {
      expect(service.absolute(5)).toBe(5);
    });

    it('should return absolute value of negative number', () => {
      expect(service.absolute(-5)).toBe(5);
    });

    it('should return absolute value of zero', () => {
      expect(service.absolute(0)).toBe(0);
    });

    it('should return absolute value of negative zero', () => {
      expect(service.absolute(-0)).toBe(0);
    });

    it('should return absolute value of decimal', () => {
      expect(service.absolute(-3.14)).toBe(3.14);
    });

    it('should return absolute value of large negative number', () => {
      expect(service.absolute(-1000000)).toBe(1000000);
    });

    it('should return absolute value of small decimal', () => {
      expect(service.absolute(-0.001)).toBe(0.001);
    });

    it('should throw error for NaN', () => {
      expect(() => service.absolute(NaN)).toThrow(BadRequestException);
      expect(() => service.absolute(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.absolute(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.absolute(-Infinity)).toThrow(BadRequestException);
    });
  });

  describe('ceiling', () => {
    it('should round up positive decimal', () => {
      expect(service.ceiling(3.2)).toBe(4);
    });

    it('should round up positive decimal close to integer', () => {
      expect(service.ceiling(3.9)).toBe(4);
    });

    it('should return same value for integer', () => {
      expect(service.ceiling(5)).toBe(5);
    });

    it('should round up negative decimal toward zero', () => {
      expect(service.ceiling(-3.2)).toBe(-3);
    });

    it('should round up negative decimal close to integer', () => {
      expect(service.ceiling(-3.9)).toBe(-3);
    });

    it('should return zero for zero', () => {
      expect(service.ceiling(0)).toBe(0);
    });

    it('should round up small positive decimal', () => {
      expect(service.ceiling(0.1)).toBe(1);
    });

    it('should round up small negative decimal', () => {
      expect(Math.abs(service.ceiling(-0.1))).toBe(0);
    });

    it('should round up large decimal', () => {
      expect(service.ceiling(999999.1)).toBe(1000000);
    });

    it('should throw error for NaN', () => {
      expect(() => service.ceiling(NaN)).toThrow(BadRequestException);
      expect(() => service.ceiling(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.ceiling(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.ceiling(-Infinity)).toThrow(BadRequestException);
    });
  });

  describe('floor', () => {
    it('should round down positive decimal', () => {
      expect(service.floor(3.9)).toBe(3);
    });

    it('should round down positive decimal close to integer', () => {
      expect(service.floor(3.1)).toBe(3);
    });

    it('should return same value for integer', () => {
      expect(service.floor(5)).toBe(5);
    });

    it('should round down negative decimal away from zero', () => {
      expect(service.floor(-3.1)).toBe(-4);
    });

    it('should round down negative decimal close to integer', () => {
      expect(service.floor(-3.9)).toBe(-4);
    });

    it('should return zero for zero', () => {
      expect(service.floor(0)).toBe(0);
    });

    it('should round down small positive decimal', () => {
      expect(service.floor(0.9)).toBe(0);
    });

    it('should round down small negative decimal', () => {
      expect(service.floor(-0.1)).toBe(-1);
    });

    it('should round down large decimal', () => {
      expect(service.floor(999999.9)).toBe(999999);
    });

    it('should throw error for NaN', () => {
      expect(() => service.floor(NaN)).toThrow(BadRequestException);
      expect(() => service.floor(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.floor(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.floor(-Infinity)).toThrow(BadRequestException);
    });
  });

  describe('round', () => {
    it('should round up when decimal is 0.5 or greater', () => {
      expect(service.round(3.5)).toBe(4);
    });

    it('should round down when decimal is less than 0.5', () => {
      expect(service.round(3.4)).toBe(3);
    });

    it('should round up when decimal is greater than 0.5', () => {
      expect(service.round(3.6)).toBe(4);
    });

    it('should return same value for integer', () => {
      expect(service.round(5)).toBe(5);
    });

    it('should round negative decimal', () => {
      expect(service.round(-3.5)).toBe(-3);
    });

    it('should round negative decimal down', () => {
      expect(service.round(-3.6)).toBe(-4);
    });

    it('should round negative decimal up', () => {
      expect(service.round(-3.4)).toBe(-3);
    });

    it('should return zero for zero', () => {
      expect(service.round(0)).toBe(0);
    });

    it('should round small positive decimal down', () => {
      expect(service.round(0.4)).toBe(0);
    });

    it('should round small positive decimal up', () => {
      expect(service.round(0.5)).toBe(1);
    });

    it('should round large decimal', () => {
      expect(service.round(999999.5)).toBe(1000000);
    });

    it('should throw error for NaN', () => {
      expect(() => service.round(NaN)).toThrow(BadRequestException);
      expect(() => service.round(NaN)).toThrow(
        'Operand: Operand must not be NaN',
      );
    });

    it('should throw error for Infinity', () => {
      expect(() => service.round(Infinity)).toThrow(BadRequestException);
    });

    it('should throw error for negative Infinity', () => {
      expect(() => service.round(-Infinity)).toThrow(BadRequestException);
    });
  });

  describe('DTO Response Formatting', () => {
    describe('add with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.add(5, 3, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(8);
        expect(result.operation).toBe('add');
        expect(result.timestamp).toBeDefined();
        expect(result.calculationId).toBeDefined();
      });

      it('should return number when formatResponse is false', () => {
        const result = service.add(5, 3, false);

        expect(typeof result).toBe('number');
        expect(result).toBe(8);
      });

      it('should return number when formatResponse is omitted', () => {
        const result = service.add(5, 3);

        expect(typeof result).toBe('number');
        expect(result).toBe(8);
      });

      it('should include valid ISO timestamp', () => {
        const result = service.add(5, 3, true);

        expect(result.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        );
      });

      it('should include unique calculation ID', () => {
        const result1 = service.add(5, 3, true);
        const result2 = service.add(5, 3, true);

        expect(result1.calculationId).toBeDefined();
        expect(result2.calculationId).toBeDefined();
        expect(result1.calculationId).not.toBe(result2.calculationId);
      });
    });

    describe('subtract with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.subtract(10, 3, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(7);
        expect(result.operation).toBe('subtract');
      });
    });

    describe('multiply with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.multiply(5, 3, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(15);
        expect(result.operation).toBe('multiply');
      });
    });

    describe('divide with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.divide(10, 2, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(5);
        expect(result.operation).toBe('divide');
      });
    });

    describe('power with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.power(2, 3, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(8);
        expect(result.operation).toBe('power');
      });
    });

    describe('sqrt with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.sqrt(16, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(4);
        expect(result.operation).toBe('sqrt');
      });
    });

    describe('factorial with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.factorial(5, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(120);
        expect(result.operation).toBe('factorial');
      });
    });

    describe('modulo with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.modulo(10, 3, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(1);
        expect(result.operation).toBe('modulo');
      });
    });

    describe('absolute with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.absolute(-5, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(5);
        expect(result.operation).toBe('absolute');
      });
    });

    describe('ceiling with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.ceiling(3.2, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(4);
        expect(result.operation).toBe('ceiling');
      });
    });

    describe('floor with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.floor(3.8, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(3);
        expect(result.operation).toBe('floor');
      });
    });

    describe('round with formatResponse', () => {
      it('should return CalculationResultDto when formatResponse is true', () => {
        const result = service.round(3.5, true);

        expect(result).toBeInstanceOf(CalculationResultDto);
        expect(result.result).toBe(4);
        expect(result.operation).toBe('round');
      });
    });

    describe('response consistency', () => {
      it('should format responses consistently across different operations', () => {
        const addResult = service.add(5, 3, true);
        const subtractResult = service.subtract(10, 3, true);
        const multiplyResult = service.multiply(5, 3, true);

        // All should have the same structure
        expect(addResult).toHaveProperty('result');
        expect(addResult).toHaveProperty('operation');
        expect(addResult).toHaveProperty('timestamp');
        expect(addResult).toHaveProperty('calculationId');

        expect(subtractResult).toHaveProperty('result');
        expect(subtractResult).toHaveProperty('operation');
        expect(subtractResult).toHaveProperty('timestamp');
        expect(subtractResult).toHaveProperty('calculationId');

        expect(multiplyResult).toHaveProperty('result');
        expect(multiplyResult).toHaveProperty('operation');
        expect(multiplyResult).toHaveProperty('timestamp');
        expect(multiplyResult).toHaveProperty('calculationId');
      });

      it('should maintain result precision in DTO', () => {
        const result = service.divide(22, 7, true);

        expect(result.result).toBeCloseTo(3.142857142857143);
      });

      it('should handle negative results in DTO', () => {
        const result = service.subtract(5, 10, true);

        expect(result.result).toBe(-5);
      });

      it('should handle zero results in DTO', () => {
        const result = service.subtract(5, 5, true);

        expect(result.result).toBe(0);
      });
    });
  });
});

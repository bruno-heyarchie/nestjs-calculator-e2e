import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  CalculatorOperationDto,
  BinaryOperationResponseDto,
  UnaryOperationResponseDto,
} from './calculator-operation.dto';

describe('CalculatorOperationDto', () => {
  describe('validation', () => {
    it('should pass validation with valid numbers', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 10,
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with decimal numbers', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 10.5,
        b: 5.25,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with negative numbers', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: -10,
        b: -5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with zero', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 0,
        b: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should transform string numbers to numbers', () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: '15',
        b: '25',
      });

      expect(typeof dto.a).toBe('number');
      expect(typeof dto.b).toBe('number');
      expect(dto.a).toBe(15);
      expect(dto.b).toBe(25);
    });
  });

  describe('validation errors', () => {
    it('should fail validation when first operand is missing', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('a');
    });

    it('should fail validation when second operand is missing', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('b');
    });

    it('should fail validation when first operand is not a number', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 'invalid',
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const aError = errors.find((e) => e.property === 'a');
      expect(aError).toBeDefined();
    });

    it('should fail validation when second operand is not a number', async () => {
      const dto = plainToInstance(CalculatorOperationDto, {
        a: 10,
        b: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const bError = errors.find((e) => e.property === 'b');
      expect(bError).toBeDefined();
    });
  });
});

describe('BinaryOperationResponseDto', () => {
  describe('properties', () => {
    it('should have all required properties', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'add';
      dto.a = 10;
      dto.b = 5;
      dto.result = 15;

      expect(dto).toHaveProperty('operation');
      expect(dto).toHaveProperty('a');
      expect(dto).toHaveProperty('b');
      expect(dto).toHaveProperty('result');
    });

    it('should allow direct property assignment', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'multiply';
      dto.a = 6;
      dto.b = 7;
      dto.result = 42;

      expect(dto.operation).toBe('multiply');
      expect(dto.a).toBe(6);
      expect(dto.b).toBe(7);
      expect(dto.result).toBe(42);
    });

    it('should support negative numbers', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'subtract';
      dto.a = 5;
      dto.b = 10;
      dto.result = -5;

      expect(dto.result).toBe(-5);
    });

    it('should support decimal numbers', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'divide';
      dto.a = 10;
      dto.b = 3;
      dto.result = 3.333333;

      expect(dto.result).toBeCloseTo(3.333333);
    });
  });

  describe('operation types', () => {
    it('should support addition operation', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'add';
      expect(dto.operation).toBe('add');
    });

    it('should support subtraction operation', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'subtract';
      expect(dto.operation).toBe('subtract');
    });

    it('should support multiplication operation', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'multiply';
      expect(dto.operation).toBe('multiply');
    });

    it('should support division operation', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'divide';
      expect(dto.operation).toBe('divide');
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'multiply';
      dto.a = 5;
      dto.b = 0;
      dto.result = 0;

      expect(dto.result).toBe(0);
    });

    it('should handle very large numbers', () => {
      const dto = new BinaryOperationResponseDto();
      dto.operation = 'add';
      dto.a = 1000000;
      dto.b = 2000000;
      dto.result = 3000000;

      expect(dto.result).toBe(3000000);
    });
  });
});

describe('UnaryOperationResponseDto', () => {
  describe('properties', () => {
    it('should have all required properties', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'sqrt';
      dto.value = 9;
      dto.result = 3;

      expect(dto).toHaveProperty('operation');
      expect(dto).toHaveProperty('value');
      expect(dto).toHaveProperty('result');
    });

    it('should allow direct property assignment', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'factorial';
      dto.value = 5;
      dto.result = 120;

      expect(dto.operation).toBe('factorial');
      expect(dto.value).toBe(5);
      expect(dto.result).toBe(120);
    });

    it('should support negative values', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'absolute';
      dto.value = -10;
      dto.result = 10;

      expect(dto.value).toBe(-10);
      expect(dto.result).toBe(10);
    });

    it('should support decimal values', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'ceiling';
      dto.value = 3.2;
      dto.result = 4;

      expect(dto.value).toBe(3.2);
      expect(dto.result).toBe(4);
    });
  });

  describe('operation types', () => {
    it('should support square root operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'sqrt';
      expect(dto.operation).toBe('sqrt');
    });

    it('should support factorial operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'factorial';
      expect(dto.operation).toBe('factorial');
    });

    it('should support absolute operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'absolute';
      expect(dto.operation).toBe('absolute');
    });

    it('should support ceiling operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'ceiling';
      expect(dto.operation).toBe('ceiling');
    });

    it('should support floor operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'floor';
      expect(dto.operation).toBe('floor');
    });

    it('should support round operation', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'round';
      expect(dto.operation).toBe('round');
    });
  });

  describe('edge cases', () => {
    it('should handle zero value', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'absolute';
      dto.value = 0;
      dto.result = 0;

      expect(dto.result).toBe(0);
    });

    it('should handle very large numbers', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'ceiling';
      dto.value = 999999.1;
      dto.result = 1000000;

      expect(dto.result).toBe(1000000);
    });

    it('should handle very small decimals', () => {
      const dto = new UnaryOperationResponseDto();
      dto.operation = 'sqrt';
      dto.value = 0.0001;
      dto.result = 0.01;

      expect(dto.result).toBe(0.01);
    });
  });
});

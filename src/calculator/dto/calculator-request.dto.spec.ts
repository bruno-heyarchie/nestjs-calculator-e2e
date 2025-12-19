import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CalculatorRequestDto } from './calculator-request.dto';

describe('CalculatorRequestDto', () => {
  describe('validation', () => {
    it('should pass validation with valid numbers', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 10,
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with decimal numbers', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 10.5,
        b: 5.25,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with negative numbers', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: -10,
        b: -5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with zero', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 0,
        b: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with large numbers', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 9999999,
        b: 1000000,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should transform string numbers to numbers', () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: '10',
        b: '5',
      });

      expect(typeof dto.a).toBe('number');
      expect(typeof dto.b).toBe('number');
      expect(dto.a).toBe(10);
      expect(dto.b).toBe(5);
    });

    it('should transform string decimal numbers to numbers', () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: '10.5',
        b: '5.25',
      });

      expect(typeof dto.a).toBe('number');
      expect(typeof dto.b).toBe('number');
      expect(dto.a).toBe(10.5);
      expect(dto.b).toBe(5.25);
    });
  });

  describe('validation errors', () => {
    it('should fail validation when first operand is missing', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('a');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when second operand is missing', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('b');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when both operands are missing', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });

    it('should fail validation when first operand is not a number', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 'not-a-number',
        b: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const aError = errors.find((e) => e.property === 'a');
      expect(aError).toBeDefined();
      expect(aError?.constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when second operand is not a number', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 10,
        b: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const bError = errors.find((e) => e.property === 'b');
      expect(bError).toBeDefined();
      expect(bError?.constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when operands are null', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: null,
        b: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });

    it('should fail validation when operands are undefined', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: undefined,
        b: undefined,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });

    it('should transform boolean to numbers (class-transformer behavior)', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: true,
        b: false,
      });

      // class-transformer converts booleans: true -> 1, false -> 0
      expect(dto.a).toBe(1);
      expect(dto.b).toBe(0);

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when operands are objects', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: { value: 10 },
        b: { value: 5 },
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });

    it('should fail validation when operands are arrays', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: [10],
        b: [5],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle very small decimal numbers', async () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: 0.0001,
        b: 0.0002,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should handle scientific notation strings', () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: '1e10',
        b: '2e5',
      });

      expect(dto.a).toBe(10000000000);
      expect(dto.b).toBe(200000);
    });

    it('should handle negative scientific notation', () => {
      const dto = plainToInstance(CalculatorRequestDto, {
        a: '1e-10',
        b: '2e-5',
      });

      expect(dto.a).toBe(0.0000000001);
      expect(dto.b).toBe(0.00002);
    });

    it('should validate properties exist', () => {
      const dto = new CalculatorRequestDto();
      expect(dto).toHaveProperty('a');
      expect(dto).toHaveProperty('b');
    });
  });
});

import { validate } from 'class-validator';
import { CalculationResultDto } from './calculation-result.dto';
import { CalculatorOperation } from '../interfaces/calculator.interface';

describe('CalculationResultDto', () => {
  describe('constructor', () => {
    it('should create an instance with all properties', () => {
      const timestamp = new Date().toISOString();
      const calculationId = 'calc_123';
      const dto = new CalculationResultDto(42, 'add', timestamp, calculationId);

      expect(dto.result).toBe(42);
      expect(dto.operation).toBe('add');
      expect(dto.timestamp).toBe(timestamp);
      expect(dto.calculationId).toBe(calculationId);
    });

    it('should create an instance without parameters', () => {
      const dto = new CalculationResultDto();

      expect(dto.result).toBeUndefined();
      expect(dto.operation).toBeUndefined();
      expect(dto.timestamp).toBeUndefined();
      expect(dto.calculationId).toBeUndefined();
    });

    it('should create an instance with partial properties', () => {
      const dto = new CalculationResultDto(100, 'multiply');

      expect(dto.result).toBe(100);
      expect(dto.operation).toBe('multiply');
      expect(dto.timestamp).toBeUndefined();
      expect(dto.calculationId).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should pass validation for a valid DTO', async () => {
      const dto = new CalculationResultDto(
        42,
        'add',
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when result is not a number', async () => {
      const dto = new CalculationResultDto();
      dto.result = 'not a number' as any;
      dto.operation = 'add';
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.calculationId = 'calc_123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('result');
    });

    it('should fail validation when operation is invalid', async () => {
      const dto = new CalculationResultDto();
      dto.result = 42;
      dto.operation = 'invalid_operation' as CalculatorOperation;
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.calculationId = 'calc_123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('operation');
    });

    it('should fail validation when timestamp is not a valid ISO string', async () => {
      const dto = new CalculationResultDto();
      dto.result = 42;
      dto.operation = 'add';
      dto.timestamp = 'invalid-date';
      dto.calculationId = 'calc_123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timestamp');
    });

    it('should fail validation when calculationId is not a string', async () => {
      const dto = new CalculationResultDto();
      dto.result = 42;
      dto.operation = 'add';
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.calculationId = 123 as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('calculationId');
    });

    it('should pass validation for all supported operations', async () => {
      const operations: CalculatorOperation[] = [
        'add',
        'subtract',
        'multiply',
        'divide',
        'power',
        'sqrt',
        'factorial',
        'modulo',
        'absolute',
        'ceiling',
        'floor',
        'round',
      ];

      for (const operation of operations) {
        const dto = new CalculationResultDto(
          42,
          operation,
          '2025-12-19T10:30:00.000Z',
          'calc_123',
        );

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('data integrity', () => {
    it('should maintain result precision for decimal numbers', () => {
      const dto = new CalculationResultDto(
        3.14159,
        'divide',
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      expect(dto.result).toBe(3.14159);
    });

    it('should handle negative results', () => {
      const dto = new CalculationResultDto(
        -42,
        'subtract',
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      expect(dto.result).toBe(-42);
    });

    it('should handle zero result', () => {
      const dto = new CalculationResultDto(
        0,
        'subtract',
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      expect(dto.result).toBe(0);
    });

    it('should handle very large numbers', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      const dto = new CalculationResultDto(
        largeNumber,
        'multiply',
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      expect(dto.result).toBe(largeNumber);
    });
  });
});

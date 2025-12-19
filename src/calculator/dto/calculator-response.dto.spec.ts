import { CalculatorResponseDto } from './calculator-response.dto';

describe('CalculatorResponseDto', () => {
  describe('constructor', () => {
    it('should create dto with result and operation', () => {
      const dto = new CalculatorResponseDto(15, 'add');

      expect(dto.result).toBe(15);
      expect(dto.operation).toBe('add');
    });

    it('should create dto with zero result', () => {
      const dto = new CalculatorResponseDto(0, 'subtract');

      expect(dto.result).toBe(0);
      expect(dto.operation).toBe('subtract');
    });

    it('should create dto with negative result', () => {
      const dto = new CalculatorResponseDto(-10, 'multiply');

      expect(dto.result).toBe(-10);
      expect(dto.operation).toBe('multiply');
    });

    it('should create dto with decimal result', () => {
      const dto = new CalculatorResponseDto(3.14159, 'divide');

      expect(dto.result).toBe(3.14159);
      expect(dto.operation).toBe('divide');
    });

    it('should create dto without constructor arguments', () => {
      const dto = new CalculatorResponseDto();

      expect(dto.result).toBeUndefined();
      expect(dto.operation).toBeUndefined();
    });

    it('should create dto with only result', () => {
      const dto = new CalculatorResponseDto(42);

      expect(dto.result).toBe(42);
      expect(dto.operation).toBeUndefined();
    });

    it('should create dto with only operation', () => {
      const dto = new CalculatorResponseDto(undefined, 'add');

      expect(dto.result).toBeUndefined();
      expect(dto.operation).toBe('add');
    });
  });

  describe('properties', () => {
    it('should allow direct property assignment', () => {
      const dto = new CalculatorResponseDto();
      dto.result = 100;
      dto.operation = 'power';

      expect(dto.result).toBe(100);
      expect(dto.operation).toBe('power');
    });

    it('should have required properties', () => {
      const dto = new CalculatorResponseDto(50, 'modulo');

      expect(dto).toHaveProperty('result');
      expect(dto).toHaveProperty('operation');
    });

    it('should preserve type of result', () => {
      const dto = new CalculatorResponseDto(25.5, 'sqrt');

      expect(typeof dto.result).toBe('number');
      expect(typeof dto.operation).toBe('string');
    });
  });

  describe('operation types', () => {
    it('should support addition operation', () => {
      const dto = new CalculatorResponseDto(10, 'add');
      expect(dto.operation).toBe('add');
    });

    it('should support subtraction operation', () => {
      const dto = new CalculatorResponseDto(10, 'subtract');
      expect(dto.operation).toBe('subtract');
    });

    it('should support multiplication operation', () => {
      const dto = new CalculatorResponseDto(10, 'multiply');
      expect(dto.operation).toBe('multiply');
    });

    it('should support division operation', () => {
      const dto = new CalculatorResponseDto(10, 'divide');
      expect(dto.operation).toBe('divide');
    });
  });

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      const dto = new CalculatorResponseDto(Number.MAX_SAFE_INTEGER, 'add');

      expect(dto.result).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle very small numbers', () => {
      const dto = new CalculatorResponseDto(
        Number.MIN_SAFE_INTEGER,
        'subtract',
      );

      expect(dto.result).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('should handle decimal precision', () => {
      const dto = new CalculatorResponseDto(0.1 + 0.2, 'add');

      expect(dto.result).toBeCloseTo(0.3);
    });

    it('should create instance from object literal', () => {
      const obj = { result: 42, operation: 'test' };
      const dto = Object.assign(new CalculatorResponseDto(), obj);

      expect(dto.result).toBe(42);
      expect(dto.operation).toBe('test');
    });
  });
});

import {
  createCalculatorTestModule,
  getCalculatorService,
  getValidationService,
  assertValidCalculationResult,
  assertValidTimestamp,
  assertValidCalculationId,
  generateBinaryOperationTestCases,
  generateUnaryOperationTestCases,
  generateInvalidInputTestCases,
  generateLargeNumberTestCases,
  generateEdgeCaseNumbers,
  approximatelyEqual,
  randomInt,
  randomFloat,
  generateRandomNumbers,
} from './calculator-test.utils';
import { CalculatorService } from '../calculator.service';
import { ValidationService } from '../validation/validation.service';
import {
  VALID_OPERATIONS,
  INVALID_INPUTS,
  EDGE_CASE_NUMBERS,
  ERROR_SCENARIOS,
  PERFORMANCE_TEST_DATA,
  EXPECTED_RESULT_STRUCTURE,
} from './mock-data';

describe('Test Utilities', () => {
  describe('Module Creation Utilities', () => {
    it('should create a calculator test module', async () => {
      const module = await createCalculatorTestModule();
      expect(module).toBeDefined();
    });

    it('should get calculator service from module', async () => {
      const module = await createCalculatorTestModule();
      const service = getCalculatorService(module);
      expect(service).toBeInstanceOf(CalculatorService);
    });

    it('should get validation service from module', async () => {
      const module = await createCalculatorTestModule();
      const service = getValidationService(module);
      expect(service).toBeInstanceOf(ValidationService);
    });
  });

  describe('Result Assertion Utilities', () => {
    it('should validate a proper calculation result', async () => {
      const module = await createCalculatorTestModule();
      const service = getCalculatorService(module);
      const result = service.add(5, 3, true);

      expect(() => assertValidCalculationResult(result)).not.toThrow();
    });

    it('should validate timestamp format', () => {
      const timestamp = new Date().toISOString();
      expect(() => assertValidTimestamp(timestamp)).not.toThrow();
    });

    it('should validate calculation ID format', () => {
      const calcId = `calc_${Date.now()}_abc123`;
      expect(() => assertValidCalculationId(calcId)).not.toThrow();
    });
  });

  describe('Test Case Generation Utilities', () => {
    it('should generate binary operation test cases', () => {
      const testCases = generateBinaryOperationTestCases('addition');
      expect(testCases).toBeDefined();
      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases[0]).toHaveProperty('description');
      expect(testCases[0]).toHaveProperty('a');
      expect(testCases[0]).toHaveProperty('b');
    });

    it('should generate unary operation test cases', () => {
      const testCases = generateUnaryOperationTestCases('sqrt');
      expect(testCases).toBeDefined();
      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases[0]).toHaveProperty('description');
      expect(testCases[0]).toHaveProperty('a');
    });

    it('should generate invalid input test cases', () => {
      const testCases = generateInvalidInputTestCases();
      expect(testCases).toBeDefined();
      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases[0]).toHaveProperty('description');
      expect(testCases[0]).toHaveProperty('value');
    });

    it('should generate large number test cases', () => {
      const testCases = generateLargeNumberTestCases();
      expect(testCases).toBeDefined();
      expect(testCases).toHaveProperty('maxSafe');
      expect(testCases).toHaveProperty('minSafe');
      expect(testCases.maxSafe).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should generate edge case numbers', () => {
      const edges = generateEdgeCaseNumbers();
      expect(edges).toBeDefined();
      expect(edges).toHaveProperty('zero');
      expect(edges).toHaveProperty('negativeZero');
      expect(edges.zero).toBe(0);
    });
  });

  describe('Number Comparison Utilities', () => {
    it('should check if numbers are approximately equal', () => {
      expect(approximatelyEqual(1.0, 1.0000001, 0.001)).toBe(true);
      expect(approximatelyEqual(1.0, 1.1, 0.001)).toBe(false);
    });

    it('should handle negative numbers in approximatelyEqual', () => {
      expect(approximatelyEqual(-1.0, -1.0000001, 0.001)).toBe(true);
    });
  });

  describe('Random Number Generation Utilities', () => {
    it('should generate random integers in range', () => {
      const random = randomInt(1, 10);
      expect(random).toBeGreaterThanOrEqual(1);
      expect(random).toBeLessThanOrEqual(10);
      expect(Number.isInteger(random)).toBe(true);
    });

    it('should generate random floats in range', () => {
      const random = randomFloat(1.0, 10.0);
      expect(random).toBeGreaterThanOrEqual(1.0);
      expect(random).toBeLessThanOrEqual(10.0);
    });

    it('should generate array of random numbers', () => {
      const numbers = generateRandomNumbers(10, 1, 100);
      expect(numbers).toHaveLength(10);
      numbers.forEach((num) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(100);
      });
    });
  });
});

describe('Mock Data', () => {
  describe('Valid Operations Data', () => {
    it('should have valid operations for all basic operations', () => {
      expect(VALID_OPERATIONS).toHaveProperty('addition');
      expect(VALID_OPERATIONS).toHaveProperty('subtraction');
      expect(VALID_OPERATIONS).toHaveProperty('multiplication');
      expect(VALID_OPERATIONS).toHaveProperty('division');
      expect(VALID_OPERATIONS.addition).toBeInstanceOf(Array);
    });

    it('should have properly structured operation test data', () => {
      const addCase = VALID_OPERATIONS.addition[0];
      expect(addCase).toHaveProperty('a');
      expect(addCase).toHaveProperty('b');
      expect(addCase).toHaveProperty('expected');
      expect(addCase).toHaveProperty('description');
    });
  });

  describe('Invalid Inputs Data', () => {
    it('should have all invalid input types', () => {
      expect(INVALID_INPUTS).toHaveProperty('nan');
      expect(INVALID_INPUTS).toHaveProperty('infinity');
      expect(INVALID_INPUTS).toHaveProperty('null');
      expect(INVALID_INPUTS).toHaveProperty('undefined');
    });

    it('should have correct invalid values', () => {
      expect(Number.isNaN(INVALID_INPUTS.nan)).toBe(true);
      expect(INVALID_INPUTS.infinity).toBe(Infinity);
    });
  });

  describe('Edge Case Numbers Data', () => {
    it('should have all boundary numbers', () => {
      expect(EDGE_CASE_NUMBERS).toHaveProperty('maxSafeInteger');
      expect(EDGE_CASE_NUMBERS).toHaveProperty('minSafeInteger');
      expect(EDGE_CASE_NUMBERS).toHaveProperty('zero');
      expect(EDGE_CASE_NUMBERS).toHaveProperty('negativeZero');
    });

    it('should have correct boundary values', () => {
      expect(EDGE_CASE_NUMBERS.maxSafeInteger).toBe(Number.MAX_SAFE_INTEGER);
      expect(EDGE_CASE_NUMBERS.minSafeInteger).toBe(Number.MIN_SAFE_INTEGER);
    });
  });

  describe('Error Scenarios Data', () => {
    it('should have error scenarios for all error types', () => {
      expect(ERROR_SCENARIOS).toHaveProperty('divisionByZero');
      expect(ERROR_SCENARIOS).toHaveProperty('moduloByZero');
      expect(ERROR_SCENARIOS).toHaveProperty('negativeSquareRoot');
      expect(ERROR_SCENARIOS).toHaveProperty('negativeFactorial');
    });

    it('should have properly structured error scenarios', () => {
      const divByZero = ERROR_SCENARIOS.divisionByZero[0];
      expect(divByZero).toHaveProperty('a');
      expect(divByZero).toHaveProperty('b');
      expect(divByZero).toHaveProperty('errorMessage');
    });
  });

  describe('Performance Test Data', () => {
    it('should have large numbers for performance testing', () => {
      expect(PERFORMANCE_TEST_DATA).toHaveProperty('largeNumbers');
      expect(PERFORMANCE_TEST_DATA).toHaveProperty('batchOperations');
    });

    it('should have batch operation arrays', () => {
      expect(PERFORMANCE_TEST_DATA.batchOperations.smallBatch).toBeInstanceOf(
        Array,
      );
      expect(
        PERFORMANCE_TEST_DATA.batchOperations.smallBatch.length,
      ).toBeGreaterThan(0);
    });
  });

  describe('Expected Result Structure Data', () => {
    it('should define expected result properties', () => {
      expect(EXPECTED_RESULT_STRUCTURE.properties).toContain('result');
      expect(EXPECTED_RESULT_STRUCTURE.properties).toContain('operation');
      expect(EXPECTED_RESULT_STRUCTURE.properties).toContain('timestamp');
      expect(EXPECTED_RESULT_STRUCTURE.properties).toContain('calculationId');
    });

    it('should define expected result types', () => {
      expect(EXPECTED_RESULT_STRUCTURE.types.result).toBe('number');
      expect(EXPECTED_RESULT_STRUCTURE.types.operation).toBe('string');
    });

    it('should define validation patterns', () => {
      expect(EXPECTED_RESULT_STRUCTURE.patterns.timestamp).toBeInstanceOf(
        RegExp,
      );
      expect(EXPECTED_RESULT_STRUCTURE.patterns.calculationId).toBeInstanceOf(
        RegExp,
      );
    });
  });
});

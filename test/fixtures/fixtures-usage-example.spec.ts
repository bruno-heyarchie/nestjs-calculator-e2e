/**
 * Example test demonstrating usage of test fixtures, mocks, and constants
 * This file serves as documentation for how to use the test utilities
 */

import { CalculatorFixtures } from './calculator.fixtures';
import {
  MockCalculatorService,
  ServiceMockFactory,
  MockPresets,
} from '../mocks/calculator.mocks';
import {
  TEST_NUMBERS,
  OPERATIONS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  COMMON_TEST_PAIRS,
} from '../data/test-constants';

describe('Test Fixtures Usage Examples', () => {
  describe('Using CalculatorFixtures', () => {
    it('should provide valid calculation requests', () => {
      const request = CalculatorFixtures.getValidCalculationRequest(
        'add',
        TEST_NUMBERS.TEN,
        TEST_NUMBERS.FIVE,
      );

      expect(request).toEqual({
        operation: 'add',
        a: 10,
        b: 5,
      });
    });

    it('should generate random number pairs', () => {
      const pairs = CalculatorFixtures.generateRandomIntegerPairs(5);

      expect(pairs).toHaveLength(5);
      pairs.forEach((pair) => {
        expect(typeof pair.a).toBe('number');
        expect(typeof pair.b).toBe('number');
      });
    });

    it('should provide boundary values for edge case testing', () => {
      const boundaries = CalculatorFixtures.getBoundaryValues();

      expect(boundaries).toContain(0);
      expect(boundaries).toContain(1);
      expect(boundaries).toContain(-1);
      expect(boundaries.length).toBeGreaterThan(0);
    });

    it('should provide parametrized test scenarios', () => {
      const scenarios = CalculatorFixtures.getParametrizedTestScenarios();

      expect(scenarios.addition).toBeDefined();
      expect(scenarios.subtraction).toBeDefined();
      expect(scenarios.multiplication).toBeDefined();
      expect(scenarios.division).toBeDefined();
    });
  });

  describe('Using MockCalculatorService', () => {
    it('should create a mock service with jest functions', () => {
      const mockService = new MockCalculatorService();

      const result = mockService.add(10, 5);

      expect(result).toBe(15);
      expect(mockService.add).toHaveBeenCalledWith(10, 5);
      expect(mockService.add).toHaveBeenCalledTimes(1);
    });

    it('should allow customizing mock implementations', () => {
      const mockService = new MockCalculatorService();
      mockService.add.mockReturnValue(100);

      const result = mockService.add(10, 5);

      expect(result).toBe(100);
    });

    it('should use preset mock configurations', () => {
      const standardService = MockPresets.standardService;

      expect(standardService.add).toBeDefined();
      expect(standardService.subtract).toBeDefined();
      expect(standardService.multiply).toBeDefined();
      expect(standardService.divide).toBeDefined();
    });
  });

  describe('Using ServiceMockFactory', () => {
    it('should create successful service mock', () => {
      const mockService = ServiceMockFactory.createSuccessfulService();

      const result = mockService.add(10, 5);

      expect(result).toBe(15);
      expect(mockService.add).toHaveBeenCalled();
    });

    it('should create error-throwing service mock', () => {
      const mockService = ServiceMockFactory.createErrorService('Test error');

      expect(() => mockService.add(10, 5)).toThrow('Test error');
    });

    it('should create service with custom implementations', () => {
      const mockService = ServiceMockFactory.createCustomService({
        add: (a: number, b: number) => a + b + 100,
        multiply: (a: number, b: number) => a * b * 2,
      });

      expect(mockService.add(10, 5)).toBe(115);
      expect(mockService.multiply(10, 5)).toBe(100);
    });
  });

  describe('Using Test Constants', () => {
    it('should use common test numbers', () => {
      expect(TEST_NUMBERS.ZERO).toBe(0);
      expect(TEST_NUMBERS.TEN).toBe(10);
      expect(TEST_NUMBERS.HUNDRED).toBe(100);
    });

    it('should use operation names', () => {
      expect(OPERATIONS.ADD).toBe('addition');
      expect(OPERATIONS.SUBTRACT).toBe('subtraction');
      expect(OPERATIONS.MULTIPLY).toBe('multiplication');
      expect(OPERATIONS.DIVIDE).toBe('division');
    });

    it('should use error messages', () => {
      expect(ERROR_MESSAGES.DIVISION_BY_ZERO).toBe(
        'Division by zero is not allowed',
      );
      expect(ERROR_MESSAGES.NEGATIVE_SQRT).toBe(
        'Cannot calculate square root of negative number',
      );
    });

    it('should use HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
    });

    it('should use common test pairs', () => {
      const { a, b } = COMMON_TEST_PAIRS.POSITIVE_POSITIVE;

      expect(a).toBe(10);
      expect(b).toBe(5);
    });
  });

  describe('Combined Usage Example', () => {
    it('should demonstrate using multiple utilities together', () => {
      // Use fixtures to create test data
      const request = CalculatorFixtures.getValidAddRequest(
        TEST_NUMBERS.TEN,
        TEST_NUMBERS.FIVE,
      );

      // Use mock service
      const mockService = new MockCalculatorService();
      const result = mockService.add(request.a, request.b);

      // Use constants for assertions
      expect(result).toBe(TEST_NUMBERS.TEN + TEST_NUMBERS.FIVE);
      expect(mockService.add).toHaveBeenCalledWith(
        TEST_NUMBERS.TEN,
        TEST_NUMBERS.FIVE,
      );
    });

    it('should demonstrate parametrized testing with fixtures', () => {
      const scenarios = CalculatorFixtures.getParametrizedTestScenarios();
      const mockService = new MockCalculatorService();

      scenarios.addition.forEach(({ a, b, expected, description }) => {
        const result = mockService.add(a, b);
        expect(result).toBe(expected);
      });

      expect(mockService.add).toHaveBeenCalledTimes(
        scenarios.addition.length,
      );
    });
  });
});

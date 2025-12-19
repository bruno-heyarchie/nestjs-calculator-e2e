import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from '../calculator.service';
import { ValidationService } from '../validation/validation.service';
import { CalculationResultDto } from '../dto/calculation-result.dto';

/**
 * Test utilities for calculator service testing
 * Provides helper functions for creating test modules, mocks, and test data
 */

/**
 * Creates a testing module with CalculatorService and dependencies
 * @returns Testing module with all required providers
 */
export async function createCalculatorTestModule(): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [CalculatorService, ValidationService],
  }).compile();

  return module;
}

/**
 * Gets an instance of CalculatorService from a test module
 * @param module - The testing module
 * @returns CalculatorService instance
 */
export function getCalculatorService(module: TestingModule): CalculatorService {
  return module.get<CalculatorService>(CalculatorService);
}

/**
 * Gets an instance of ValidationService from a test module
 * @param module - The testing module
 * @returns ValidationService instance
 */
export function getValidationService(module: TestingModule): ValidationService {
  return module.get<ValidationService>(ValidationService);
}

/**
 * Creates a mock ValidationService with default behavior
 * @returns Mock ValidationService
 */
export function createMockValidationService(): Partial<ValidationService> {
  return {
    validateOrThrow: jest.fn(),
    validateOperandsOrThrow: jest.fn(),
    validateNumber: jest.fn().mockReturnValue({ isValid: true }),
    isFinite: jest.fn().mockReturnValue({ isValid: true }),
    isNotNaN: jest.fn().mockReturnValue({ isValid: true }),
  };
}

/**
 * Asserts that a CalculationResultDto has the expected structure
 * @param result - The result to validate
 */
export function assertValidCalculationResult(
  result: CalculationResultDto,
): void {
  expect(result).toHaveProperty('result');
  expect(result).toHaveProperty('operation');
  expect(result).toHaveProperty('timestamp');
  expect(result).toHaveProperty('calculationId');
  expect(typeof result.result).toBe('number');
  expect(typeof result.operation).toBe('string');
  expect(typeof result.timestamp).toBe('string');
  expect(typeof result.calculationId).toBe('string');
}

/**
 * Asserts that a timestamp is a valid ISO 8601 string
 * @param timestamp - The timestamp to validate
 */
export function assertValidTimestamp(timestamp: string): void {
  expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  const date = new Date(timestamp);
  expect(date.toString()).not.toBe('Invalid Date');
}

/**
 * Asserts that a calculation ID has the expected format
 * @param calculationId - The calculation ID to validate
 */
export function assertValidCalculationId(calculationId: string): void {
  expect(calculationId).toMatch(/^calc_\d+_[a-z0-9]+$/);
}

/**
 * Generates test cases for binary operations (two operands)
 * @param operation - The operation name
 * @returns Array of test cases
 */
export function generateBinaryOperationTestCases(operation: string): Array<{
  description: string;
  a: number;
  b: number;
  expected?: number;
  shouldThrow?: boolean;
}> {
  return [
    {
      description: `should perform ${operation} with positive numbers`,
      a: 10,
      b: 5,
    },
    {
      description: `should perform ${operation} with negative numbers`,
      a: -10,
      b: -5,
    },
    {
      description: `should perform ${operation} with mixed signs`,
      a: 10,
      b: -5,
    },
    {
      description: `should perform ${operation} with zero`,
      a: 10,
      b: 0,
    },
    {
      description: `should perform ${operation} with decimals`,
      a: 3.5,
      b: 2.1,
    },
  ];
}

/**
 * Generates test cases for unary operations (one operand)
 * @param operation - The operation name
 * @returns Array of test cases
 */
export function generateUnaryOperationTestCases(operation: string): Array<{
  description: string;
  a: number;
  expected?: number;
  shouldThrow?: boolean;
}> {
  return [
    {
      description: `should perform ${operation} with positive number`,
      a: 10,
    },
    {
      description: `should perform ${operation} with negative number`,
      a: -10,
    },
    {
      description: `should perform ${operation} with zero`,
      a: 0,
    },
    {
      description: `should perform ${operation} with decimal`,
      a: 3.14159,
    },
  ];
}

/**
 * Generates invalid input test cases
 * @returns Array of invalid input test cases
 */
export function generateInvalidInputTestCases(): Array<{
  description: string;
  value: any;
  paramName: string;
}> {
  return [
    { description: 'NaN', value: NaN, paramName: 'operand' },
    { description: 'Infinity', value: Infinity, paramName: 'operand' },
    { description: '-Infinity', value: -Infinity, paramName: 'operand' },
    { description: 'null', value: null, paramName: 'operand' },
    { description: 'undefined', value: undefined, paramName: 'operand' },
  ];
}

/**
 * Measures the execution time of a function
 * @param fn - The function to measure
 * @returns Execution time in milliseconds
 */
export async function measureExecutionTime(
  fn: () => void | Promise<void>,
): Promise<number> {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
}

/**
 * Runs a function multiple times and returns average execution time
 * @param fn - The function to benchmark
 * @param iterations - Number of iterations (default: 1000)
 * @returns Average execution time in milliseconds
 */
export async function benchmark(
  fn: () => void | Promise<void>,
  iterations = 1000,
): Promise<number> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const time = await measureExecutionTime(fn);
    times.push(time);
  }

  const sum = times.reduce((acc, time) => acc + time, 0);
  return sum / iterations;
}

/**
 * Generates large numbers for performance testing
 * @returns Object with various large number test cases
 */
export function generateLargeNumberTestCases(): {
  nearMaxSafe: number;
  nearMinSafe: number;
  maxSafe: number;
  minSafe: number;
  largePositive: number;
  largeNegative: number;
} {
  return {
    nearMaxSafe: Number.MAX_SAFE_INTEGER - 1000,
    nearMinSafe: Number.MIN_SAFE_INTEGER + 1000,
    maxSafe: Number.MAX_SAFE_INTEGER,
    minSafe: Number.MIN_SAFE_INTEGER,
    largePositive: 1e12,
    largeNegative: -1e12,
  };
}

/**
 * Generates edge case numbers for testing
 * @returns Object with various edge case numbers
 */
export function generateEdgeCaseNumbers(): {
  zero: number;
  negativeZero: number;
  minValue: number;
  maxValue: number;
  epsilon: number;
  smallDecimal: number;
  largeDecimal: number;
} {
  return {
    zero: 0,
    negativeZero: -0,
    minValue: Number.MIN_VALUE,
    maxValue: Number.MAX_VALUE,
    epsilon: Number.EPSILON,
    smallDecimal: 0.0000001,
    largeDecimal: 999999.999999,
  };
}

/**
 * Checks if two numbers are approximately equal (within tolerance)
 * @param a - First number
 * @param b - Second number
 * @param tolerance - Tolerance for comparison (default: 0.00001)
 * @returns True if numbers are approximately equal
 */
export function approximatelyEqual(
  a: number,
  b: number,
  tolerance = 0.00001,
): boolean {
  return Math.abs(a - b) < tolerance;
}

/**
 * Creates a spy on a service method
 * @param service - The service instance
 * @param methodName - The method to spy on
 * @returns Jest spy
 */
export function spyOnServiceMethod<T extends object>(
  service: T,
  methodName: keyof T,
): jest.SpyInstance {
  return jest.spyOn(service, methodName as any);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random float
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates an array of random numbers for batch testing
 * @param count - Number of random numbers to generate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Array of random numbers
 */
export function generateRandomNumbers(
  count: number,
  min: number,
  max: number,
): number[] {
  return Array.from({ length: count }, () => randomFloat(min, max));
}

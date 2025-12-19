/**
 * Calculator Test Fixtures
 * Provides reusable test data and fixtures for calculator tests
 * This module contains factory functions for generating consistent test data
 */

/**
 * Request payload fixtures for calculator operations
 */
export class CalculatorFixtures {
  /**
   * Returns a valid calculation request for two-operand operations
   */
  static getValidCalculationRequest(operation = 'add', a = 10, b = 5) {
    return {
      operation,
      a,
      b,
    };
  }

  /**
   * Returns an invalid calculation request with wrong operation
   */
  static getInvalidOperationRequest() {
    return {
      operation: 'invalid',
      a: 10,
      b: 5,
    };
  }

  /**
   * Returns an invalid calculation request with non-numeric operands
   */
  static getInvalidOperandsRequest() {
    return {
      operation: 'add',
      a: 'not',
      b: 'numbers',
    };
  }

  /**
   * Returns a request missing the 'a' parameter
   */
  static getMissingFirstOperandRequest() {
    return {
      operation: 'add',
      b: 5,
    };
  }

  /**
   * Returns a request missing the 'b' parameter
   */
  static getMissingSecondOperandRequest() {
    return {
      operation: 'add',
      a: 10,
    };
  }

  /**
   * Returns an empty request object
   */
  static getEmptyRequest() {
    return {};
  }

  /**
   * Returns a valid addition request
   */
  static getValidAddRequest(a = 10, b = 5) {
    return { a, b };
  }

  /**
   * Returns a valid subtraction request
   */
  static getValidSubtractRequest(a = 10, b = 5) {
    return { a, b };
  }

  /**
   * Returns a valid multiplication request
   */
  static getValidMultiplyRequest(a = 10, b = 5) {
    return { a, b };
  }

  /**
   * Returns a valid division request
   */
  static getValidDivideRequest(a = 10, b = 5) {
    return { a, b };
  }

  /**
   * Returns a division by zero request
   */
  static getDivisionByZeroRequest(a = 10) {
    return { a, b: 0 };
  }

  /**
   * Returns a valid power operation request
   */
  static getValidPowerRequest(a = 2, b = 3) {
    return { a, b };
  }

  /**
   * Returns a valid modulo operation request
   */
  static getValidModuloRequest(a = 10, b = 3) {
    return { a, b };
  }

  /**
   * Returns a modulo by zero request
   */
  static getModuloByZeroRequest(a = 10) {
    return { a, b: 0 };
  }

  /**
   * Returns a valid sqrt operation request
   */
  static getValidSqrtRequest(a = 16) {
    return { a };
  }

  /**
   * Returns a negative sqrt request (should fail)
   */
  static getNegativeSqrtRequest(a = -16) {
    return { a };
  }

  /**
   * Returns a valid factorial request
   */
  static getValidFactorialRequest(a = 5) {
    return { a };
  }

  /**
   * Returns a negative factorial request (should fail)
   */
  static getNegativeFactorialRequest(a = -5) {
    return { a };
  }

  /**
   * Returns a valid absolute value request
   */
  static getValidAbsoluteRequest(a = -10) {
    return { a };
  }

  /**
   * Returns a valid ceiling request
   */
  static getValidCeilingRequest(a = 3.2) {
    return { a };
  }

  /**
   * Returns a valid floor request
   */
  static getValidFloorRequest(a = 3.9) {
    return { a };
  }

  /**
   * Returns a valid round request
   */
  static getValidRoundRequest(a = 3.5) {
    return { a };
  }

  /**
   * Generates a batch of random number pairs for testing
   */
  static generateRandomNumbers(count: number): number[] {
    return Array.from({ length: count }, () => Math.random() * 1000);
  }

  /**
   * Generates random integer pairs for testing
   */
  static generateRandomIntegerPairs(
    count: number,
    min = -100,
    max = 100,
  ): Array<{ a: number; b: number }> {
    const pairs: Array<{ a: number; b: number }> = [];
    for (let i = 0; i < count; i++) {
      pairs.push({
        a: Math.floor(Math.random() * (max - min + 1)) + min,
        b: Math.floor(Math.random() * (max - min + 1)) + min,
      });
    }
    return pairs;
  }

  /**
   * Generates random decimal pairs for testing
   */
  static generateRandomDecimalPairs(
    count: number,
    min = -100,
    max = 100,
    decimals = 2,
  ): Array<{ a: number; b: number }> {
    const pairs: Array<{ a: number; b: number }> = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * (max - min) + min;
      const b = Math.random() * (max - min) + min;
      pairs.push({
        a: Number(a.toFixed(decimals)),
        b: Number(b.toFixed(decimals)),
      });
    }
    return pairs;
  }

  /**
   * Returns a set of boundary value numbers for edge case testing
   */
  static getBoundaryValues(): number[] {
    return [
      0,
      1,
      -1,
      0.1,
      -0.1,
      Number.MIN_VALUE,
      Number.MAX_VALUE,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      1e10,
      -1e10,
      Math.PI,
      Math.E,
    ];
  }

  /**
   * Returns invalid values that should be rejected
   */
  static getInvalidValues(): any[] {
    return [NaN, Infinity, -Infinity, undefined, null, '', 'string', {}, []];
  }

  /**
   * Returns expected response structure for successful operations
   */
  static getExpectedSuccessResponse(
    operation: string,
    a: number,
    b: number,
    result: number,
  ) {
    return {
      operation,
      a,
      b,
      result,
    };
  }

  /**
   * Returns expected response structure for single-operand operations
   */
  static getExpectedSingleOperandResponse(
    operation: string,
    a: number,
    result: number,
  ) {
    return {
      operation,
      a,
      result,
    };
  }

  /**
   * Returns expected error response structure
   */
  static getExpectedErrorResponse(statusCode: number, message: string) {
    return {
      statusCode,
      message,
      error: 'Bad Request',
    };
  }

  /**
   * Creates a collection of test scenarios for parametrized testing
   */
  static getParametrizedTestScenarios() {
    return {
      addition: [
        { a: 5, b: 3, expected: 8, description: 'positive numbers' },
        { a: -5, b: -3, expected: -8, description: 'negative numbers' },
        { a: 0, b: 5, expected: 5, description: 'with zero' },
        { a: 1.5, b: 2.5, expected: 4, description: 'decimal numbers' },
      ],
      subtraction: [
        { a: 5, b: 3, expected: 2, description: 'positive numbers' },
        { a: -5, b: -3, expected: -2, description: 'negative numbers' },
        { a: 5, b: 0, expected: 5, description: 'with zero' },
        { a: 5.5, b: 2.5, expected: 3, description: 'decimal numbers' },
      ],
      multiplication: [
        { a: 5, b: 3, expected: 15, description: 'positive numbers' },
        { a: -5, b: -3, expected: 15, description: 'negative numbers' },
        { a: 5, b: 0, expected: 0, description: 'with zero' },
        { a: 2.5, b: 4, expected: 10, description: 'decimal numbers' },
      ],
      division: [
        { a: 6, b: 3, expected: 2, description: 'positive numbers' },
        { a: -6, b: -3, expected: 2, description: 'negative numbers' },
        { a: 0, b: 5, expected: 0, description: 'zero dividend' },
        { a: 7.5, b: 2.5, expected: 3, description: 'decimal numbers' },
      ],
    };
  }

  /**
   * Creates test data for error scenarios
   */
  static getErrorScenarios() {
    return {
      divisionByZero: [
        { a: 5, b: 0, error: 'Division by zero' },
        { a: -5, b: 0, error: 'Division by zero' },
      ],
      invalidInputs: [
        { a: NaN, b: 5, error: 'Invalid input' },
        { a: 5, b: NaN, error: 'Invalid input' },
        { a: Infinity, b: 5, error: 'Invalid input' },
      ],
      missingParameters: [
        { b: 5, error: 'Missing parameter' },
        { a: 5, error: 'Missing parameter' },
        { error: 'Missing parameters' },
      ],
    };
  }
}

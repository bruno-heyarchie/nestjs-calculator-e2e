/**
 * Test Data Factory
 * Provides reusable test data and mock generators for testing
 */

export interface CalculatorOperationTestCase {
  a: number;
  b: number;
  expectedResult: number;
  description: string;
}

export interface CalculatorErrorTestCase {
  a: number;
  b: number;
  expectedError: string;
  description: string;
}

/**
 * Factory for generating calculator test data
 */
export class CalculatorTestDataFactory {
  /**
   * Valid addition test cases
   */
  static getAdditionTestCases(): CalculatorOperationTestCase[] {
    return [
      { a: 5, b: 3, expectedResult: 8, description: 'positive numbers' },
      { a: -5, b: -3, expectedResult: -8, description: 'negative numbers' },
      { a: 5, b: -3, expectedResult: 2, description: 'mixed signs' },
      { a: 0, b: 5, expectedResult: 5, description: 'zero as first operand' },
      { a: 5, b: 0, expectedResult: 5, description: 'zero as second operand' },
      {
        a: 1.5,
        b: 2.3,
        expectedResult: 3.8,
        description: 'decimal numbers',
      },
      {
        a: 1000000,
        b: 2000000,
        expectedResult: 3000000,
        description: 'large numbers',
      },
    ];
  }

  /**
   * Valid subtraction test cases
   */
  static getSubtractionTestCases(): CalculatorOperationTestCase[] {
    return [
      { a: 5, b: 3, expectedResult: 2, description: 'positive numbers' },
      { a: -5, b: -3, expectedResult: -2, description: 'negative numbers' },
      { a: 5, b: -3, expectedResult: 8, description: 'mixed signs' },
      { a: 0, b: 5, expectedResult: -5, description: 'zero as first operand' },
      { a: 5, b: 0, expectedResult: 5, description: 'zero as second operand' },
      {
        a: 5.5,
        b: 2.3,
        expectedResult: 3.2,
        description: 'decimal numbers',
      },
      {
        a: 1000000,
        b: 500000,
        expectedResult: 500000,
        description: 'large numbers',
      },
    ];
  }

  /**
   * Valid multiplication test cases
   */
  static getMultiplicationTestCases(): CalculatorOperationTestCase[] {
    return [
      { a: 5, b: 3, expectedResult: 15, description: 'positive numbers' },
      { a: -5, b: -3, expectedResult: 15, description: 'negative numbers' },
      { a: 5, b: -3, expectedResult: -15, description: 'mixed signs' },
      { a: 0, b: 5, expectedResult: 0, description: 'zero as first operand' },
      { a: 5, b: 0, expectedResult: 0, description: 'zero as second operand' },
      { a: 2.5, b: 4, expectedResult: 10, description: 'decimal numbers' },
      {
        a: 1000,
        b: 2000,
        expectedResult: 2000000,
        description: 'large numbers',
      },
    ];
  }

  /**
   * Valid division test cases
   */
  static getDivisionTestCases(): CalculatorOperationTestCase[] {
    return [
      { a: 6, b: 3, expectedResult: 2, description: 'positive numbers' },
      { a: -6, b: -3, expectedResult: 2, description: 'negative numbers' },
      { a: 6, b: -3, expectedResult: -2, description: 'mixed signs' },
      { a: 0, b: 5, expectedResult: 0, description: 'zero as first operand' },
      { a: 7.5, b: 2.5, expectedResult: 3, description: 'decimal numbers' },
      {
        a: 1000000,
        b: 2000,
        expectedResult: 500,
        description: 'large numbers',
      },
    ];
  }

  /**
   * Invalid input test cases (NaN, Infinity)
   */
  static getInvalidInputTestCases(): CalculatorErrorTestCase[] {
    return [
      {
        a: NaN,
        b: 5,
        expectedError: 'Invalid input',
        description: 'NaN as first operand',
      },
      {
        a: 5,
        b: NaN,
        expectedError: 'Invalid input',
        description: 'NaN as second operand',
      },
      {
        a: Infinity,
        b: 5,
        expectedError: 'Invalid input',
        description: 'Infinity as first operand',
      },
      {
        a: 5,
        b: Infinity,
        expectedError: 'Invalid input',
        description: 'Infinity as second operand',
      },
      {
        a: -Infinity,
        b: 5,
        expectedError: 'Invalid input',
        description: '-Infinity as first operand',
      },
    ];
  }

  /**
   * Division by zero test cases
   */
  static getDivisionByZeroTestCases(): CalculatorErrorTestCase[] {
    return [
      {
        a: 5,
        b: 0,
        expectedError: 'Division by zero is not allowed',
        description: 'positive number divided by zero',
      },
      {
        a: -5,
        b: 0,
        expectedError: 'Division by zero is not allowed',
        description: 'negative number divided by zero',
      },
    ];
  }

  /**
   * Generate random valid number pairs for testing
   */
  static generateRandomNumberPairs(count: number): Array<{ a: number; b: number }> {
    const pairs: Array<{ a: number; b: number }> = [];
    for (let i = 0; i < count; i++) {
      pairs.push({
        a: Math.floor(Math.random() * 200) - 100, // -100 to 100
        b: Math.floor(Math.random() * 200) - 100, // -100 to 100
      });
    }
    return pairs;
  }

  /**
   * Generate edge case numbers for thorough testing
   */
  static getEdgeCaseNumbers(): number[] {
    return [
      0,
      1,
      -1,
      Number.MIN_VALUE,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      0.1,
      -0.1,
      1e10,
      -1e10,
    ];
  }
}

/**
 * Mock response builders for API testing
 */
export class MockResponseFactory {
  /**
   * Creates a successful calculator operation response
   */
  static createSuccessResponse(
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
   * Creates an error response
   */
  static createErrorResponse(statusCode: number, message: string) {
    return {
      statusCode,
      message,
      error: 'Bad Request',
    };
  }
}

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

export interface SingleOperandTestCase {
  a: number;
  expectedResult: number;
  description: string;
}

export interface SingleOperandErrorTestCase {
  a: number;
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
  static generateRandomNumberPairs(
    count: number,
  ): Array<{ a: number; b: number }> {
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

  /**
   * Valid power operation test cases
   */
  static getPowerTestCases(): CalculatorOperationTestCase[] {
    return [
      {
        a: 2,
        b: 3,
        expectedResult: 8,
        description: 'positive base and exponent',
      },
      { a: 5, b: 0, expectedResult: 1, description: 'power of zero' },
      { a: 0, b: 5, expectedResult: 0, description: 'zero to positive power' },
      {
        a: -2,
        b: 2,
        expectedResult: 4,
        description: 'negative base to even power',
      },
      {
        a: -2,
        b: 3,
        expectedResult: -8,
        description: 'negative base to odd power',
      },
      { a: 2, b: -2, expectedResult: 0.25, description: 'negative exponent' },
      { a: 1.5, b: 2, expectedResult: 2.25, description: 'decimal base' },
      { a: 10, b: 6, expectedResult: 1000000, description: 'large power' },
    ];
  }

  /**
   * Valid square root test cases
   */
  static getSqrtTestCases(): SingleOperandTestCase[] {
    return [
      { a: 4, expectedResult: 2, description: 'perfect square' },
      { a: 0, expectedResult: 0, description: 'square root of zero' },
      { a: 1, expectedResult: 1, description: 'square root of one' },
      { a: 100, expectedResult: 10, description: 'large perfect square' },
      { a: 2.25, expectedResult: 1.5, description: 'decimal perfect square' },
      { a: 1000000, expectedResult: 1000, description: 'very large square' },
    ];
  }

  /**
   * Valid factorial test cases
   */
  static getFactorialTestCases(): SingleOperandTestCase[] {
    return [
      { a: 0, expectedResult: 1, description: 'factorial of zero' },
      { a: 1, expectedResult: 1, description: 'factorial of one' },
      { a: 5, expectedResult: 120, description: 'factorial of 5' },
      { a: 10, expectedResult: 3628800, description: 'factorial of 10' },
      { a: 3, expectedResult: 6, description: 'factorial of 3' },
      { a: 4, expectedResult: 24, description: 'factorial of 4' },
    ];
  }

  /**
   * Valid modulo test cases
   */
  static getModuloTestCases(): CalculatorOperationTestCase[] {
    return [
      {
        a: 7,
        b: 3,
        expectedResult: 1,
        description: 'positive numbers with remainder',
      },
      { a: 6, b: 3, expectedResult: 0, description: 'zero remainder' },
      {
        a: 3,
        b: 7,
        expectedResult: 3,
        description: 'dividend smaller than divisor',
      },
      { a: -7, b: 3, expectedResult: -1, description: 'negative dividend' },
      { a: 7, b: -3, expectedResult: 1, description: 'negative divisor' },
      { a: 0, b: 5, expectedResult: 0, description: 'zero dividend' },
      { a: 1000000, b: 7, expectedResult: 1, description: 'large numbers' },
    ];
  }

  /**
   * Valid absolute value test cases
   */
  static getAbsoluteTestCases(): SingleOperandTestCase[] {
    return [
      { a: 5, expectedResult: 5, description: 'positive number' },
      { a: -5, expectedResult: 5, description: 'negative number' },
      { a: 0, expectedResult: 0, description: 'zero' },
      { a: -3.14, expectedResult: 3.14, description: 'negative decimal' },
      { a: -1000000, expectedResult: 1000000, description: 'large negative' },
    ];
  }

  /**
   * Valid ceiling test cases
   */
  static getCeilingTestCases(): SingleOperandTestCase[] {
    return [
      { a: 3.2, expectedResult: 4, description: 'positive decimal' },
      { a: 3.9, expectedResult: 4, description: 'decimal close to integer' },
      { a: 5, expectedResult: 5, description: 'integer' },
      { a: -3.2, expectedResult: -3, description: 'negative decimal' },
      { a: 0, expectedResult: 0, description: 'zero' },
      { a: 0.1, expectedResult: 1, description: 'small positive' },
    ];
  }

  /**
   * Valid floor test cases
   */
  static getFloorTestCases(): SingleOperandTestCase[] {
    return [
      { a: 3.9, expectedResult: 3, description: 'positive decimal' },
      { a: 3.1, expectedResult: 3, description: 'decimal close to integer' },
      { a: 5, expectedResult: 5, description: 'integer' },
      { a: -3.1, expectedResult: -4, description: 'negative decimal' },
      { a: 0, expectedResult: 0, description: 'zero' },
      { a: 0.9, expectedResult: 0, description: 'small positive' },
    ];
  }

  /**
   * Valid round test cases
   */
  static getRoundTestCases(): SingleOperandTestCase[] {
    return [
      { a: 3.5, expectedResult: 4, description: 'round up at 0.5' },
      { a: 3.4, expectedResult: 3, description: 'round down below 0.5' },
      { a: 3.6, expectedResult: 4, description: 'round up above 0.5' },
      { a: 5, expectedResult: 5, description: 'integer' },
      { a: -3.5, expectedResult: -3, description: 'negative at 0.5' },
      { a: 0, expectedResult: 0, description: 'zero' },
    ];
  }

  /**
   * Sqrt error test cases
   */
  static getSqrtErrorTestCases(): SingleOperandErrorTestCase[] {
    return [
      {
        a: -4,
        expectedError: 'Cannot calculate square root of negative number',
        description: 'negative number',
      },
      {
        a: NaN,
        expectedError: 'Operand must be a valid finite number',
        description: 'NaN',
      },
      {
        a: Infinity,
        expectedError: 'Operand must be a valid finite number',
        description: 'Infinity',
      },
    ];
  }

  /**
   * Factorial error test cases
   */
  static getFactorialErrorTestCases(): SingleOperandErrorTestCase[] {
    return [
      {
        a: -5,
        expectedError: 'Cannot calculate factorial of negative number',
        description: 'negative number',
      },
      {
        a: 5.5,
        expectedError: 'Factorial requires an integer input',
        description: 'decimal number',
      },
      {
        a: 171,
        expectedError: 'Factorial input too large (maximum is 170)',
        description: 'number greater than 170',
      },
    ];
  }

  /**
   * Modulo by zero test cases
   */
  static getModuloByZeroTestCases(): CalculatorErrorTestCase[] {
    return [
      {
        a: 5,
        b: 0,
        expectedError: 'Modulo by zero is not allowed',
        description: 'positive number modulo zero',
      },
      {
        a: -5,
        b: 0,
        expectedError: 'Modulo by zero is not allowed',
        description: 'negative number modulo zero',
      },
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
      result,
      operation,
      operands: [a, b],
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

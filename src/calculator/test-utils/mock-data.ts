/**
 * Mock data and test fixtures for calculator service tests
 * Provides predefined test data, expected results, and edge cases
 */

/**
 * Valid operation test data
 */
export const VALID_OPERATIONS = {
  addition: [
    { a: 5, b: 3, expected: 8, description: 'positive numbers' },
    { a: -5, b: -3, expected: -8, description: 'negative numbers' },
    { a: 5, b: -3, expected: 2, description: 'mixed signs' },
    { a: 0, b: 5, expected: 5, description: 'with zero' },
    { a: 1.5, b: 2.3, expected: 3.8, description: 'decimals' },
    { a: 1000000, b: 2000000, expected: 3000000, description: 'large numbers' },
  ],
  subtraction: [
    { a: 5, b: 3, expected: 2, description: 'positive numbers' },
    { a: -5, b: -3, expected: -2, description: 'negative numbers' },
    { a: 5, b: -3, expected: 8, description: 'mixed signs' },
    { a: 5, b: 0, expected: 5, description: 'subtract zero' },
    { a: 5.5, b: 2.3, expected: 3.2, description: 'decimals' },
  ],
  multiplication: [
    { a: 5, b: 3, expected: 15, description: 'positive numbers' },
    { a: -5, b: -3, expected: 15, description: 'negative numbers' },
    { a: 5, b: -3, expected: -15, description: 'mixed signs' },
    { a: 5, b: 0, expected: 0, description: 'with zero' },
    { a: 2.5, b: 4, expected: 10, description: 'decimals' },
  ],
  division: [
    { a: 6, b: 3, expected: 2, description: 'positive numbers' },
    { a: -6, b: -3, expected: 2, description: 'negative numbers' },
    { a: 6, b: -3, expected: -2, description: 'mixed signs' },
    { a: 0, b: 5, expected: 0, description: 'zero dividend' },
    { a: 7.5, b: 2.5, expected: 3, description: 'decimals' },
  ],
  power: [
    { a: 2, b: 3, expected: 8, description: 'basic power' },
    { a: 5, b: 0, expected: 1, description: 'power of zero' },
    { a: -2, b: 2, expected: 4, description: 'negative base, even exponent' },
    { a: -2, b: 3, expected: -8, description: 'negative base, odd exponent' },
    { a: 4, b: 0.5, expected: 2, description: 'fractional exponent' },
  ],
  sqrt: [
    { a: 4, expected: 2, description: 'perfect square' },
    { a: 9, expected: 3, description: 'another perfect square' },
    { a: 0, expected: 0, description: 'square root of zero' },
    { a: 1, expected: 1, description: 'square root of one' },
    { a: 2.25, expected: 1.5, description: 'decimal square root' },
  ],
  factorial: [
    { a: 0, expected: 1, description: 'factorial of zero' },
    { a: 1, expected: 1, description: 'factorial of one' },
    { a: 5, expected: 120, description: 'small factorial' },
    { a: 10, expected: 3628800, description: 'larger factorial' },
    { a: 20, expected: 2432902008176640000, description: 'large factorial' },
  ],
  modulo: [
    { a: 7, b: 3, expected: 1, description: 'basic modulo' },
    { a: 10, b: 5, expected: 0, description: 'zero remainder' },
    { a: 3, b: 7, expected: 3, description: 'dividend smaller than divisor' },
    { a: -7, b: 3, expected: -1, description: 'negative dividend' },
    { a: 7, b: -3, expected: 1, description: 'negative divisor' },
  ],
  absolute: [
    { a: 5, expected: 5, description: 'positive number' },
    { a: -5, expected: 5, description: 'negative number' },
    { a: 0, expected: 0, description: 'zero' },
    { a: -3.14, expected: 3.14, description: 'negative decimal' },
  ],
  ceiling: [
    { a: 3.2, expected: 4, description: 'positive decimal' },
    { a: 3.9, expected: 4, description: 'close to integer' },
    { a: -3.2, expected: -3, description: 'negative decimal' },
    { a: 5, expected: 5, description: 'already integer' },
  ],
  floor: [
    { a: 3.9, expected: 3, description: 'positive decimal' },
    { a: 3.1, expected: 3, description: 'close to integer' },
    { a: -3.1, expected: -4, description: 'negative decimal' },
    { a: 5, expected: 5, description: 'already integer' },
  ],
  round: [
    { a: 3.5, expected: 4, description: 'round up from .5' },
    { a: 3.4, expected: 3, description: 'round down' },
    { a: 3.6, expected: 4, description: 'round up' },
    { a: -3.5, expected: -3, description: 'negative .5' },
  ],
};

/**
 * Invalid inputs that should throw errors
 */
export const INVALID_INPUTS = {
  nan: NaN,
  infinity: Infinity,
  negativeInfinity: -Infinity,
  null: null as any,
  undefined: undefined as any,
  string: 'not a number' as any,
  object: {} as any,
  array: [] as any,
};

/**
 * Edge case numbers for testing boundaries
 */
export const EDGE_CASE_NUMBERS = {
  zero: 0,
  negativeZero: -0,
  one: 1,
  negativeOne: -1,
  maxSafeInteger: Number.MAX_SAFE_INTEGER,
  minSafeInteger: Number.MIN_SAFE_INTEGER,
  maxValue: Number.MAX_VALUE,
  minValue: Number.MIN_VALUE,
  epsilon: Number.EPSILON,
  smallDecimal: 0.0000001,
  largeDecimal: 999999.999999,
  nearMaxSafe: Number.MAX_SAFE_INTEGER - 1000,
  nearMinSafe: Number.MIN_SAFE_INTEGER + 1000,
};

/**
 * Error scenarios that should be tested
 */
export const ERROR_SCENARIOS = {
  divisionByZero: [
    { a: 5, b: 0, errorMessage: 'Division by zero' },
    { a: 0, b: 0, errorMessage: 'Division by zero' },
    { a: -5, b: 0, errorMessage: 'Division by zero' },
  ],
  moduloByZero: [
    { a: 5, b: 0, errorMessage: 'Modulo by zero' },
    { a: 0, b: 0, errorMessage: 'Modulo by zero' },
  ],
  negativeSquareRoot: [
    { a: -4, errorMessage: 'Cannot calculate square root of negative number' },
    { a: -1, errorMessage: 'Cannot calculate square root of negative number' },
  ],
  negativeFactorial: [
    { a: -5, errorMessage: 'Cannot calculate factorial of negative number' },
    { a: -1, errorMessage: 'Cannot calculate factorial of negative number' },
  ],
  nonIntegerFactorial: [
    { a: 5.5, errorMessage: 'Factorial requires an integer input' },
    { a: 3.14, errorMessage: 'Factorial requires an integer input' },
  ],
  tooLargeFactorial: [
    { a: 171, errorMessage: 'Factorial input too large' },
    { a: 500, errorMessage: 'Factorial input too large' },
  ],
  overflow: [
    {
      operation: 'add',
      a: Number.MAX_SAFE_INTEGER,
      b: 1000,
      errorMessage: 'overflow',
    },
    {
      operation: 'multiply',
      a: Number.MAX_SAFE_INTEGER,
      b: 2,
      errorMessage: 'overflow',
    },
  ],
  underflow: [
    {
      operation: 'subtract',
      a: Number.MIN_SAFE_INTEGER,
      b: 1000,
      errorMessage: 'underflow',
    },
  ],
};

/**
 * Performance test data - large numbers and batch operations
 */
export const PERFORMANCE_TEST_DATA = {
  largeNumbers: {
    veryLarge: 1e12,
    nearMaxSafe: Number.MAX_SAFE_INTEGER - 1000,
    nearMinSafe: Number.MIN_SAFE_INTEGER + 1000,
  },
  batchOperations: {
    smallBatch: Array.from({ length: 100 }, (_, i) => i + 1),
    mediumBatch: Array.from({ length: 1000 }, (_, i) => i + 1),
    largeBatch: Array.from({ length: 10000 }, (_, i) => i + 1),
  },
  complexCalculations: [
    { a: 999999, b: 888888, description: 'six-digit numbers' },
    { a: 123456.789, b: 987654.321, description: 'high-precision decimals' },
    { a: 1e10, b: 1e9, description: 'scientific notation' },
  ],
};

/**
 * Expected calculation result structure
 */
export const EXPECTED_RESULT_STRUCTURE = {
  properties: ['result', 'operation', 'timestamp', 'calculationId'],
  types: {
    result: 'number',
    operation: 'string',
    timestamp: 'string',
    calculationId: 'string',
  },
  patterns: {
    timestamp: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    calculationId: /^calc_\d+_[a-z0-9]+$/,
  },
};

/**
 * Mock logger for testing
 */
export const createMockLogger = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

/**
 * Mock validation service responses
 */
export const MOCK_VALIDATION_RESPONSES = {
  valid: {
    isValid: true,
    value: 42,
  },
  invalidNull: {
    isValid: false,
    error: 'Value must not be null',
  },
  invalidNaN: {
    isValid: false,
    error: 'Value must not be NaN',
  },
  invalidInfinity: {
    isValid: false,
    error: 'Value must be a finite number',
  },
  invalidRange: {
    isValid: false,
    error: 'Value must be between 0 and 100',
  },
};

/**
 * Common test scenarios for all operations
 */
export const COMMON_TEST_SCENARIOS = {
  validInputs: [
    { description: 'integers', values: [5, 10] },
    { description: 'decimals', values: [3.14, 2.71] },
    { description: 'negative numbers', values: [-5, -10] },
    { description: 'zero', values: [0, 0] },
    { description: 'mixed signs', values: [5, -3] },
  ],
  invalidInputs: [
    { description: 'NaN', value: NaN },
    { description: 'Infinity', value: Infinity },
    { description: '-Infinity', value: -Infinity },
  ],
};

/**
 * Stress test configurations
 */
export const STRESS_TEST_CONFIG = {
  iterations: {
    quick: 100,
    standard: 1000,
    intensive: 10000,
  },
  timeouts: {
    quick: 1000, // 1 second
    standard: 5000, // 5 seconds
    intensive: 30000, // 30 seconds
  },
  thresholds: {
    maxExecutionTime: 10, // milliseconds per operation
    maxMemoryIncrease: 10 * 1024 * 1024, // 10 MB
  },
};

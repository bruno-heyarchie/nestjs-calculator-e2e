/**
 * Test Constants
 * Centralized constants for use across all test suites
 * Eliminates magic numbers and provides consistent test values
 */

/**
 * Common numeric values used in tests
 */
export const TEST_NUMBERS = {
  ZERO: 0,
  ONE: 1,
  NEGATIVE_ONE: -1,
  TWO: 2,
  THREE: 3,
  FIVE: 5,
  TEN: 10,
  FIFTY: 50,
  HUNDRED: 100,
  THOUSAND: 1000,
  MILLION: 1000000,
} as const;

/**
 * Common decimal values used in tests
 */
export const TEST_DECIMALS = {
  ONE_POINT_FIVE: 1.5,
  TWO_POINT_FIVE: 2.5,
  THREE_POINT_TWO: 3.2,
  THREE_POINT_FIVE: 3.5,
  THREE_POINT_NINE: 3.9,
  PI: Math.PI,
  E: Math.E,
  SMALL_DECIMAL: 0.000001,
  NEGATIVE_DECIMAL: -3.14,
} as const;

/**
 * Boundary and edge case values
 */
export const BOUNDARY_VALUES = {
  MIN_VALUE: Number.MIN_VALUE,
  MAX_VALUE: Number.MAX_VALUE,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
  EPSILON: Number.EPSILON,
  POSITIVE_INFINITY: Infinity,
  NEGATIVE_INFINITY: -Infinity,
  NAN: NaN,
} as const;

/**
 * Special test values that should cause errors
 */
export const INVALID_VALUES = {
  NAN: NaN,
  INFINITY: Infinity,
  NEGATIVE_INFINITY: -Infinity,
  UNDEFINED: undefined,
  NULL: null,
  EMPTY_STRING: '',
  STRING: 'string',
  EMPTY_OBJECT: {},
  EMPTY_ARRAY: [],
} as const;

/**
 * Operation names used in calculator
 */
export const OPERATIONS = {
  ADD: 'addition',
  SUBTRACT: 'subtraction',
  MULTIPLY: 'multiplication',
  DIVIDE: 'division',
  POWER: 'power',
  SQRT: 'sqrt',
  FACTORIAL: 'factorial',
  MODULO: 'modulo',
  ABSOLUTE: 'absolute',
  CEILING: 'ceiling',
  FLOOR: 'floor',
  ROUND: 'round',
} as const;

/**
 * API endpoints for calculator operations
 */
export const API_ENDPOINTS = {
  BASE: '/calculator',
  ADD: '/calculator/add',
  SUBTRACT: '/calculator/subtract',
  MULTIPLY: '/calculator/multiply',
  DIVIDE: '/calculator/divide',
  POWER: '/calculator/power',
  SQRT: '/calculator/sqrt',
  FACTORIAL: '/calculator/factorial',
  MODULO: '/calculator/modulo',
  ABSOLUTE: '/calculator/absolute',
  CEILING: '/calculator/ceiling',
  FLOOR: '/calculator/floor',
  ROUND: '/calculator/round',
} as const;

/**
 * HTTP status codes used in tests
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Division by zero is not allowed',
  MODULO_BY_ZERO: 'Modulo by zero is not allowed',
  INVALID_INPUT: 'Invalid input',
  MISSING_PARAMETER: 'Missing parameter',
  NON_FINITE_NUMBER: 'must be a valid finite number',
  NEGATIVE_SQRT: 'Cannot calculate square root of negative number',
  NEGATIVE_FACTORIAL: 'Cannot calculate factorial of negative number',
  FACTORIAL_INTEGER: 'Factorial requires an integer input',
  FACTORIAL_TOO_LARGE: 'Factorial input too large (maximum is 170)',
  POWER_NON_FINITE: 'Power operation resulted in non-finite number',
} as const;

/**
 * Test timeout values (in milliseconds)
 */
export const TEST_TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 5000,
  LONG: 10000,
  EXTRA_LONG: 30000,
} as const;

/**
 * Precision values for floating point comparisons
 */
export const PRECISION = {
  EXACT: 0,
  ONE_DECIMAL: 1,
  TWO_DECIMALS: 2,
  FIVE_DECIMALS: 5,
  TEN_DECIMALS: 10,
} as const;

/**
 * Test data generation limits
 */
export const GENERATION_LIMITS = {
  SMALL_BATCH: 5,
  MEDIUM_BATCH: 10,
  LARGE_BATCH: 100,
  MAX_BATCH: 1000,
} as const;

/**
 * Range values for random number generation
 */
export const RANDOM_RANGES = {
  SMALL: { MIN: -10, MAX: 10 },
  MEDIUM: { MIN: -100, MAX: 100 },
  LARGE: { MIN: -1000, MAX: 1000 },
  POSITIVE_ONLY: { MIN: 0, MAX: 1000 },
  NEGATIVE_ONLY: { MIN: -1000, MAX: 0 },
} as const;

/**
 * Common test pairs for two-operand operations
 */
export const COMMON_TEST_PAIRS = {
  POSITIVE_POSITIVE: { a: 10, b: 5 },
  NEGATIVE_NEGATIVE: { a: -10, b: -5 },
  POSITIVE_NEGATIVE: { a: 10, b: -5 },
  NEGATIVE_POSITIVE: { a: -10, b: 5 },
  WITH_ZERO_FIRST: { a: 0, b: 5 },
  WITH_ZERO_SECOND: { a: 5, b: 0 },
  BOTH_ZERO: { a: 0, b: 0 },
  DECIMAL_PAIR: { a: 3.5, b: 2.5 },
  LARGE_NUMBERS: { a: 1000000, b: 500000 },
  SMALL_DECIMALS: { a: 0.1, b: 0.2 },
} as const;

/**
 * Common single operands for single-operand operations
 */
export const COMMON_SINGLE_OPERANDS = {
  POSITIVE: 5,
  NEGATIVE: -5,
  ZERO: 0,
  ONE: 1,
  DECIMAL: 3.5,
  LARGE_NUMBER: 1000000,
  SMALL_DECIMAL: 0.000001,
  PI: Math.PI,
} as const;

/**
 * Expected results for common calculations
 */
export const EXPECTED_RESULTS = {
  // Addition
  ADD_5_3: 8,
  ADD_NEG_5_NEG_3: -8,
  ADD_5_NEG_3: 2,

  // Subtraction
  SUB_5_3: 2,
  SUB_NEG_5_NEG_3: -2,
  SUB_5_NEG_3: 8,

  // Multiplication
  MUL_5_3: 15,
  MUL_NEG_5_NEG_3: 15,
  MUL_5_NEG_3: -15,

  // Division
  DIV_6_3: 2,
  DIV_NEG_6_NEG_3: 2,
  DIV_6_NEG_3: -2,

  // Power
  POW_2_3: 8,
  POW_5_0: 1,
  POW_10_2: 100,

  // Square root
  SQRT_4: 2,
  SQRT_9: 3,
  SQRT_16: 4,
  SQRT_100: 10,

  // Factorial
  FACT_0: 1,
  FACT_1: 1,
  FACT_5: 120,
  FACT_10: 3628800,

  // Modulo
  MOD_7_3: 1,
  MOD_10_5: 0,
  MOD_8_3: 2,

  // Absolute
  ABS_5: 5,
  ABS_NEG_5: 5,
  ABS_0: 0,

  // Ceiling
  CEIL_3_2: 4,
  CEIL_NEG_3_2: -3,
  CEIL_5: 5,

  // Floor
  FLOOR_3_9: 3,
  FLOOR_NEG_3_1: -4,
  FLOOR_5: 5,

  // Round
  ROUND_3_5: 4,
  ROUND_3_4: 3,
  ROUND_NEG_3_5: -3,
} as const;

/**
 * Request headers for API tests
 */
export const REQUEST_HEADERS = {
  CONTENT_TYPE_JSON: { 'Content-Type': 'application/json' },
  ACCEPT_JSON: { Accept: 'application/json' },
  DEFAULT: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/**
 * Test environment configuration
 */
export const TEST_CONFIG = {
  DEFAULT_PORT: 3000,
  TEST_PORT: 3001,
  API_VERSION: 'v1',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Factorial limits and special cases
 */
export const FACTORIAL_CONSTANTS = {
  MAX_INPUT: 170,
  MIN_INPUT: 0,
  OVERFLOW_INPUT: 171,
} as const;

/**
 * Test suite identifiers
 */
export const TEST_SUITES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  EDGE_CASES: 'edge-cases',
} as const;

/**
 * Mock data identifiers
 */
export const MOCK_IDS = {
  SERVICE: 'mock-service',
  CONTROLLER: 'mock-controller',
  MODULE: 'mock-module',
} as const;

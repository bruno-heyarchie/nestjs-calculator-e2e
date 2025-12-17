/**
 * Global test setup for E2E tests
 * This file runs before all E2E tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test timeout for E2E tests (longer than unit tests)
jest.setTimeout(30000);

// Suppress console output during E2E tests for cleaner test output
// Uncomment if you want to suppress console logs
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
// };

// Global beforeAll hook for E2E tests
beforeAll(async () => {
  // Setup code that runs once before all E2E tests
  // Example: Database initialization, test data seeding, etc.
});

// Global afterAll hook for E2E tests
afterAll(async () => {
  // Cleanup code that runs once after all E2E tests
  // Example: Database cleanup, closing connections, etc.
});

// Global beforeEach hook for E2E tests
beforeEach(() => {
  // Setup code that runs before each E2E test
});

// Global afterEach hook for E2E tests
afterEach(() => {
  // Cleanup code that runs after each E2E test
  jest.clearAllMocks();
});

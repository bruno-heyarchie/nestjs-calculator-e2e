/**
 * Global test setup for unit tests
 * This file runs before all unit tests
 */

import * as fs from 'fs';
import * as path from 'path';

// Load test environment variables from .env.test
const envTestPath = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(envTestPath)) {
  const envConfig = fs.readFileSync(envTestPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    // Skip comments and empty lines
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

// Ensure test environment
process.env.NODE_ENV = 'test';

// Global test timeout (can be overridden per test)
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output (optional)
// Uncomment the lines below if you want to suppress console output during tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Add custom matchers if needed
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Extend Jest matchers type definition
declare module '@jest/expect' {
  interface Matchers<R> {
    toBeWithinRange(floor: number, ceiling: number): R;
  }
}

// Global beforeAll hook
beforeAll(() => {
  // Setup code that runs once before all tests
});

// Global afterAll hook
afterAll(() => {
  // Cleanup code that runs once after all tests
});

// Global beforeEach hook
beforeEach(() => {
  // Setup code that runs before each test
});

// Global afterEach hook
afterEach(() => {
  // Cleanup code that runs after each test
  jest.clearAllMocks();
});

import { Config } from 'jest';

const config: Config = {
  // Use ts-jest for TypeScript transformation
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory for E2E tests
  rootDir: '..',

  // Test directory
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Transform files with ts-jest
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Coverage collection for E2E tests
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.spec.ts',
  ],

  // Coverage directory for E2E tests
  coverageDirectory: './coverage/e2e',

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Setup files for E2E tests
  setupFilesAfterEnv: ['<rootDir>/test/setup-e2e.ts'],

  // Test timeout (E2E tests may take longer)
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Detect open handles
  detectOpenHandles: true,

  // Force exit after tests complete
  forceExit: true,

  // Maximum number of workers (E2E tests run serially)
  maxWorkers: 1,

  // Run tests serially
  maxConcurrency: 1,
};

export default config;

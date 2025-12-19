import { Config } from 'jest';

const config: Config = {
  // Use ts-jest for TypeScript transformation
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  rootDir: '.',

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Test match patterns
  testRegex: '.*\\.spec\\.ts$',

  // Transform files with ts-jest
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Enable coverage collection
  collectCoverage: false, // Set to true in CI or use --coverage flag

  // Coverage collection patterns
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts', // Exclude test files
    '!src/**/*.e2e-spec.ts', // Exclude e2e test files
    '!src/**/*.interface.ts', // Exclude interface files
    '!src/**/*.dto.ts', // Exclude DTO files
    '!src/**/*.module.ts', // Exclude module files
    '!src/main.ts', // Exclude main entry point
    '!src/**/*.constants.ts', // Exclude constant files
    '!src/**/*.enum.ts', // Exclude enum files
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage reporters - multiple formats for different use cases
  coverageReporters: [
    'html',        // Human-readable HTML report for local development
    'text',        // Console output for quick feedback
    'json',        // Machine-readable format for tools
    'lcov',        // Standard format for CI/CD integration
    'text-summary', // Brief summary in console
  ],

  // Coverage thresholds - build fails if below these values
  coverageThreshold: {
    global: {
      branches: 80,    // 80% branch coverage required
      functions: 80,   // 80% function coverage required
      lines: 80,       // 80% line coverage required
      statements: 80,  // 80% statement coverage required
    },
  },

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // Test timeout
  testTimeout: 10000,

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
  forceExit: false,

  // Maximum number of workers
  maxWorkers: '50%',

  // Bail after first test failure (useful for CI)
  bail: false,
};

export default config;

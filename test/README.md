# Testing Infrastructure and Best Practices

This document provides comprehensive information about the testing infrastructure, guidelines, and best practices for the Calculator API project.

## Table of Contents

1. [Test Infrastructure Overview](#test-infrastructure-overview)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Test Utilities and Helpers](#test-utilities-and-helpers)
6. [Code Coverage](#code-coverage)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Test Infrastructure Overview

The project uses **Jest** as the primary testing framework with the following setup:

- **Unit Tests**: Test individual components (services, controllers) in isolation
- **E2E Tests**: Test the entire application flow through HTTP endpoints
- **Coverage Reports**: Track code coverage metrics
- **Test Helpers**: Reusable utilities for test setup and data generation

### Key Files

- `jest.config.ts` - Main Jest configuration for unit tests
- `test/jest-e2e.config.ts` - Jest configuration for E2E tests
- `test/setup.ts` - Global setup for unit tests (loads .env.test)
- `test/setup-e2e.ts` - Global setup for E2E tests (loads .env.test)
- `.env.test` - Test environment variables
- `test/helpers/test-utils.ts` - Reusable test utilities
- `test/helpers/test-data-factory.ts` - Test data generators

### Test Environment Variables

Test-specific environment variables are configured in `.env.test` at the project root:

```bash
# Application Configuration
NODE_ENV=test
PORT=3001

# API Configuration
API_PREFIX=api
API_VERSION=v1

# Logging
LOG_LEVEL=error

# Test Database Configuration
TEST_DATABASE_URL=memory
TEST_DATABASE_NAME=calculator_test

# Test-specific settings
ENABLE_TEST_LOGGING=false
TEST_TIMEOUT=10000
```

These variables are automatically loaded by both `setup.ts` and `setup-e2e.ts` before any tests run, ensuring a consistent test environment.

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests in debug mode
npm run test:debug
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with coverage
npm run test:e2e -- --coverage
```

### Running Specific Tests

```bash
# Run tests in a specific file
npm test -- calculator.service.spec.ts

# Run tests matching a pattern
npm test -- --testNamePattern="add"

# Run a single test file with verbose output
npm test -- calculator.service.spec.ts --verbose
```

## Test Structure

### Unit Test Structure

Unit tests are located alongside the source files they test:

```
src/
├── calculator/
│   ├── calculator.service.ts
│   ├── calculator.service.spec.ts       # Unit tests for service
│   ├── calculator.controller.ts
│   └── calculator.controller.spec.ts    # Unit tests for controller
```

### E2E Test Structure

E2E tests are located in the `test/` directory:

```
test/
├── app.e2e-spec.ts              # Main app E2E tests
├── calculator.e2e-spec.ts       # Calculator endpoints E2E tests
├── jest-e2e.config.ts           # E2E test configuration
├── setup-e2e.ts                 # E2E setup file
└── helpers/
    ├── test-utils.ts            # Reusable test utilities
    └── test-data-factory.ts     # Test data generators
```

## Writing Tests

### Basic Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add two numbers', () => {
    expect(service.add(5, 3)).toBe(8);
  });
});
```

### Basic E2E Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Calculator API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/calculator/add (GET)', () => {
    return request(app.getHttpServer())
      .get('/calculator/add?a=5&b=3')
      .expect(200)
      .expect({ operation: 'addition', a: 5, b: 3, result: 8 });
  });
});
```

## Test Utilities and Helpers

### Using Test Data Factory

The `CalculatorTestDataFactory` provides pre-defined test cases:

```typescript
import { CalculatorTestDataFactory } from './helpers/test-data-factory';

describe('Addition tests', () => {
  const testCases = CalculatorTestDataFactory.getAdditionTestCases();

  testCases.forEach(({ a, b, expectedResult, description }) => {
    it(`should correctly add ${description}`, () => {
      expect(service.add(a, b)).toBe(expectedResult);
    });
  });
});
```

### Using Test Utilities

```typescript
import { createTestingModule, createTestApp } from './helpers/test-utils';

// Create a test module
const module = await createTestingModule({
  imports: [AppModule],
});

// Create and initialize a test app
const app = await createTestApp(module);
```

### Custom Matchers

A custom matcher `toBeWithinRange` is available:

```typescript
it('should return a number within range', () => {
  const result = service.add(5, 3);
  expect(result).toBeWithinRange(7, 9);
});
```

## Code Coverage

### Coverage Thresholds

The project maintains the following coverage thresholds:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Viewing Coverage Reports

After running tests with coverage:

```bash
npm run test:cov
```

Coverage reports are generated in multiple formats:

- **Terminal**: Summary displayed in the console
- **HTML**: Open `coverage/index.html` in a browser for detailed view
- **LCOV**: `coverage/lcov.info` for CI/CD integration

### Coverage Exclusions

The following files are excluded from coverage:

- `src/main.ts` - Application entry point
- `src/**/*.module.ts` - Module definition files
- `src/**/*.interface.ts` - Interface definition files
- `src/**/*.dto.ts` - Data transfer object files

## Best Practices

### 1. Test Organization

- **Group related tests** using `describe` blocks
- **Use descriptive test names** that explain what is being tested
- **Follow AAA pattern**: Arrange, Act, Assert

```typescript
describe('CalculatorService', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      // Arrange
      const a = 5;
      const b = 3;

      // Act
      const result = service.add(a, b);

      // Assert
      expect(result).toBe(8);
    });
  });
});
```

### 2. Test Independence

- Each test should be independent and not rely on other tests
- Use `beforeEach` to set up fresh test data
- Clean up resources in `afterEach` hooks

### 3. Mock External Dependencies

```typescript
const mockService = {
  add: jest.fn().mockReturnValue(8),
};

const module: TestingModule = await Test.createTestingModule({
  controllers: [CalculatorController],
  providers: [
    {
      provide: CalculatorService,
      useValue: mockService,
    },
  ],
}).compile();
```

### 4. Test Edge Cases

Always test:
- Boundary values (0, negative numbers, very large numbers)
- Invalid inputs (NaN, Infinity, undefined)
- Error conditions (division by zero)
- Empty or missing parameters

### 5. Use Parametrized Tests

For testing multiple similar cases:

```typescript
describe.each([
  [5, 3, 8],
  [-5, -3, -8],
  [0, 5, 5],
])('add(%i, %i)', (a, b, expected) => {
  it(`should return ${expected}`, () => {
    expect(service.add(a, b)).toBe(expected);
  });
});
```

### 6. Async Testing

For async operations:

```typescript
it('should handle async operations', async () => {
  const result = await service.asyncOperation();
  expect(result).toBe(expected);
});
```

### 7. Error Testing

Test error cases thoroughly:

```typescript
it('should throw error for division by zero', () => {
  expect(() => service.divide(5, 0)).toThrow(BadRequestException);
  expect(() => service.divide(5, 0)).toThrow('Division by zero');
});
```

## Troubleshooting

### Common Issues

#### 1. Tests Timing Out

If tests are timing out, increase the timeout:

```typescript
jest.setTimeout(10000); // 10 seconds
```

Or for a specific test:

```typescript
it('long running test', async () => {
  // test code
}, 15000); // 15 seconds
```

#### 2. Module Import Errors

Ensure all required modules are imported in your test module:

```typescript
const module: TestingModule = await Test.createTestingModule({
  imports: [RequiredModule],
  controllers: [TestController],
  providers: [TestService],
}).compile();
```

#### 3. Mock Not Working

Verify mocks are properly defined and injected:

```typescript
const mockFn = jest.fn().mockReturnValue(expectedValue);
jest.spyOn(service, 'method').mockImplementation(mockFn);
```

#### 4. Coverage Not Updating

Clear Jest cache and rerun:

```bash
npm test -- --clearCache
npm run test:cov
```

### Debugging Tests

1. **Use console.log** to inspect values during test execution
2. **Run tests in debug mode**: `npm run test:debug`
3. **Use Jest's verbose flag**: `npm test -- --verbose`
4. **Run a single test**: `npm test -- --testNamePattern="specific test name"`

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass before committing
3. Maintain or improve code coverage
4. Follow the established test patterns and conventions
5. Update this documentation if you add new testing utilities

# Test Utilities Guide

This guide provides comprehensive documentation for using the test fixtures, mocks, and helper utilities in the NestJS Calculator API project.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Available Utilities](#available-utilities)

## Overview

All test utilities are centralized and can be imported from a single entry point:

```typescript
import {
  CalculatorFixtures,
  MockCalculatorService,
  CalculatorTestDataFactory,
  TEST_NUMBERS,
  createTestApp,
} from '../test';
```

## Quick Start

### Using Test Fixtures

```typescript
import { CalculatorFixtures, TEST_NUMBERS } from '../test';

// Get valid request data
const addRequest = CalculatorFixtures.getValidAddRequest(10, 5);

// Generate random test data
const randomPairs = CalculatorFixtures.generateRandomIntegerPairs(5);

// Get boundary values for edge cases
const boundaries = CalculatorFixtures.getBoundaryValues();
```

### Using Mock Services

```typescript
import { MockCalculatorService, ServiceMockFactory } from '../test';

// Create a standard mock
const mockService = new MockCalculatorService();
mockService.add(5, 3);
expect(mockService.add).toHaveBeenCalledWith(5, 3);

// Create an error-throwing mock
const errorService = ServiceMockFactory.createErrorService('Test error');
```

### Using Test Constants

```typescript
import { TEST_NUMBERS, OPERATIONS, ERROR_MESSAGES } from '../test';

expect(service.add(TEST_NUMBERS.FIVE, TEST_NUMBERS.THREE)).toBe(8);
expect(operation).toBe(OPERATIONS.ADD);
expect(error.message).toBe(ERROR_MESSAGES.DIVISION_BY_ZERO);
```

## Available Utilities

### Test Fixtures (`test/fixtures`)
- **CalculatorFixtures**: Request builders for all calculator operations
- Parametrized test scenarios
- Random data generators
- Boundary value collections
- Expected response builders

### Mock Objects (`test/mocks`)
- **MockCalculatorService**: Complete mock implementation with Jest spies
- **ServiceMockFactory**: Factory for creating pre-configured mocks
- **SpyHelpers**: Utilities for creating and managing spies
- **MockDataGenerators**: Generate mock calculation results and errors

### Test Data Factory (`test/helpers/test-data-factory.ts`)
- **CalculatorTestDataFactory**: Comprehensive test case collections
- **CompositeTestDataBuilder**: Complex scenario builders
- **SeededRandomGenerator**: Reproducible random data generation
- **TestDataValidator**: Validate test data integrity

### Test Helpers (`test/helpers/test-utils.ts`)
- **TestLifecycleManager**: Setup and teardown management
- **TestIsolationHelper**: Ensure test independence
- **TestPerformanceTracker**: Benchmark test execution
- **SnapshotHelper**: Snapshot testing utilities
- **FluentTestDataBuilder**: Fluent interface for building test data
- **AssertionHelpers**: Common assertion patterns

### Test Constants (`test/data`)
- **TEST_NUMBERS**: Common numeric values
- **TEST_DECIMALS**: Decimal test values
- **BOUNDARY_VALUES**: Edge case values
- **OPERATIONS**: Operation name constants
- **API_ENDPOINTS**: API endpoint paths
- **ERROR_MESSAGES**: Standard error messages
- **HTTP_STATUS**: HTTP status codes

## Examples

See `test/fixtures/fixtures-usage-example.spec.ts` for comprehensive usage examples (17 passing tests).

## Best Practices

1. Always use fixtures instead of hardcoding test data
2. Use constants from TEST_CONSTANTS to eliminate magic numbers
3. Leverage parametrized tests with CalculatorTestDataFactory
4. Mock appropriately using ServiceMockFactory
5. Track performance in critical tests
6. Isolate tests to prevent side effects
7. Generate reproducible random data with SeededRandomGenerator

---

For detailed API documentation, see the JSDoc comments in each utility file.

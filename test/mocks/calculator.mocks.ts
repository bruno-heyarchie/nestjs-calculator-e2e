/**
 * Calculator Mock Objects
 * Provides mock implementations and spy objects for testing
 */

import { CalculatorService } from '../../src/calculator/calculator.service';

/**
 * Mock implementation of CalculatorService for unit testing
 */
export class MockCalculatorService {
  add = jest.fn((a: number, b: number) => a + b);
  subtract = jest.fn((a: number, b: number) => a - b);
  multiply = jest.fn((a: number, b: number) => a * b);
  divide = jest.fn((a: number, b: number) => {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  });
  power = jest.fn((a: number, b: number) => Math.pow(a, b));
  sqrt = jest.fn((a: number) => {
    if (a < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(a);
  });
  factorial = jest.fn((n: number) => {
    if (n < 0) {
      throw new Error('Cannot calculate factorial of negative number');
    }
    if (!Number.isInteger(n)) {
      throw new Error('Factorial requires an integer input');
    }
    if (n > 170) {
      throw new Error('Factorial input too large (maximum is 170)');
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  });
  modulo = jest.fn((a: number, b: number) => {
    if (b === 0) {
      throw new Error('Modulo by zero is not allowed');
    }
    return a % b;
  });
  absolute = jest.fn((a: number) => Math.abs(a));
  ceiling = jest.fn((a: number) => Math.ceil(a));
  floor = jest.fn((a: number) => Math.floor(a));
  round = jest.fn((a: number) => Math.round(a));
}

/**
 * Creates a spy on the CalculatorService for testing
 */
export function createCalculatorServiceSpy(): jest.Mocked<CalculatorService> {
  return {
    add: jest.fn(),
    subtract: jest.fn(),
    multiply: jest.fn(),
    divide: jest.fn(),
    power: jest.fn(),
    sqrt: jest.fn(),
    factorial: jest.fn(),
    modulo: jest.fn(),
    absolute: jest.fn(),
    ceiling: jest.fn(),
    floor: jest.fn(),
    round: jest.fn(),
  } as any;
}

/**
 * Mock HTTP responses for API testing
 */
export class MockHttpResponses {
  /**
   * Creates a mock successful response
   */
  static success(operation: string, a: number, b: number, result: number) {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({
        operation,
        a,
        b,
        result,
      }),
    };
  }

  /**
   * Creates a mock single operand success response
   */
  static successSingleOperand(operation: string, a: number, result: number) {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({
        operation,
        a,
        result,
      }),
    };
  }

  /**
   * Creates a mock error response
   */
  static error(statusCode: number, message: string) {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({
        statusCode,
        message,
        error: 'Bad Request',
      }),
    };
  }
}

/**
 * Mock request objects for controller testing
 */
export class MockHttpRequests {
  /**
   * Creates a mock request with body
   */
  static withBody(body: any) {
    return {
      body,
    };
  }

  /**
   * Creates a mock request with query parameters
   */
  static withQuery(query: any) {
    return {
      query,
    };
  }

  /**
   * Creates a mock request with params
   */
  static withParams(params: any) {
    return {
      params,
    };
  }

  /**
   * Creates a mock request with headers
   */
  static withHeaders(headers: any) {
    return {
      headers,
    };
  }
}

/**
 * Mock NestJS module metadata for testing
 */
export class MockTestingModules {
  /**
   * Creates mock metadata for calculator module testing
   */
  static getCalculatorModuleMetadata() {
    return {
      imports: [],
      controllers: [],
      providers: [CalculatorService],
    };
  }

  /**
   * Creates mock metadata with custom providers
   */
  static withProviders(providers: any[]) {
    return {
      imports: [],
      controllers: [],
      providers,
    };
  }

  /**
   * Creates mock metadata with mock calculator service
   */
  static withMockService() {
    return {
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CalculatorService,
          useClass: MockCalculatorService,
        },
      ],
    };
  }
}

/**
 * Factory for creating pre-configured service mocks
 */
export class ServiceMockFactory {
  /**
   * Creates a calculator service mock that always succeeds
   */
  static createSuccessfulService(): MockCalculatorService {
    return new MockCalculatorService();
  }

  /**
   * Creates a calculator service mock that throws errors
   */
  static createErrorService(errorMessage = 'Mock error'): MockCalculatorService {
    const mockService = new MockCalculatorService();
    mockService.add.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    mockService.subtract.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    mockService.multiply.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    mockService.divide.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    return mockService;
  }

  /**
   * Creates a calculator service mock with custom implementations
   */
  static createCustomService(implementations: {
    [key: string]: (...args: any[]) => any;
  }): MockCalculatorService {
    const mockService = new MockCalculatorService();
    Object.keys(implementations).forEach((method) => {
      if (mockService[method]) {
        mockService[method].mockImplementation(implementations[method]);
      }
    });
    return mockService;
  }
}

/**
 * Spy helpers for common testing scenarios
 */
export class SpyHelpers {
  /**
   * Creates a spy that tracks method calls
   */
  static createMethodSpy(
    object: any,
    method: string,
    mockReturnValue?: any,
  ): jest.SpyInstance {
    const spy = jest.spyOn(object, method);
    if (mockReturnValue !== undefined) {
      spy.mockReturnValue(mockReturnValue);
    }
    return spy;
  }

  /**
   * Creates a spy that tracks async method calls
   */
  static createAsyncMethodSpy(
    object: any,
    method: string,
    mockResolvedValue?: any,
  ): jest.SpyInstance {
    const spy = jest.spyOn(object, method);
    if (mockResolvedValue !== undefined) {
      spy.mockResolvedValue(mockResolvedValue);
    }
    return spy;
  }

  /**
   * Creates a spy that tracks method calls and throws errors
   */
  static createErrorSpy(
    object: any,
    method: string,
    error: Error,
  ): jest.SpyInstance {
    const spy = jest.spyOn(object, method);
    spy.mockImplementation(() => {
      throw error;
    });
    return spy;
  }

  /**
   * Creates multiple spies on an object
   */
  static createMultipleSpies(
    object: any,
    methods: string[],
  ): Map<string, jest.SpyInstance> {
    const spies = new Map<string, jest.SpyInstance>();
    methods.forEach((method) => {
      spies.set(method, jest.spyOn(object, method));
    });
    return spies;
  }
}

/**
 * Mock data generators for different testing scenarios
 */
export class MockDataGenerators {
  /**
   * Generates mock calculation results
   */
  static generateMockResults(count: number) {
    const results: Array<{
      operation: string;
      a: number;
      b: number;
      result: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      const a = Math.random() * 100;
      const b = Math.random() * 100;
      results.push({
        operation: 'addition',
        a,
        b,
        result: a + b,
      });
    }

    return results;
  }

  /**
   * Generates mock error responses
   */
  static generateMockErrors(count: number) {
    const errors: Array<{ statusCode: number; message: string }> = [];
    const errorMessages = [
      'Invalid input',
      'Division by zero',
      'Missing parameter',
      'Operand must be a valid finite number',
    ];

    for (let i = 0; i < count; i++) {
      errors.push({
        statusCode: 400,
        message: errorMessages[i % errorMessages.length],
      });
    }

    return errors;
  }
}

/**
 * Preset mock configurations for common test scenarios
 */
export const MockPresets = {
  /**
   * Standard calculator service mock
   */
  standardService: new MockCalculatorService(),

  /**
   * Service that throws validation errors
   */
  validationErrorService: ServiceMockFactory.createErrorService(
    'Validation error',
  ),

  /**
   * Service that handles division by zero
   */
  divisionByZeroService: ServiceMockFactory.createCustomService({
    divide: () => {
      throw new Error('Division by zero is not allowed');
    },
  }),

  /**
   * Service that handles negative sqrt
   */
  negativeSqrtService: ServiceMockFactory.createCustomService({
    sqrt: () => {
      throw new Error('Cannot calculate square root of negative number');
    },
  }),
};

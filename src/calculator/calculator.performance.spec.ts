import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';
import { ValidationService } from './validation/validation.service';
import {
  measureExecutionTime,
  benchmark,
  generateLargeNumberTestCases,
  generateRandomNumbers,
} from './test-utils/calculator-test.utils';
import {
  PERFORMANCE_TEST_DATA,
  STRESS_TEST_CONFIG,
} from './test-utils/mock-data';

describe('Calculator Performance Tests', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService, ValidationService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  describe('Large Number Operations', () => {
    const largeNumbers = generateLargeNumberTestCases();

    it('should handle addition of very large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.add(largeNumbers.largePositive, largeNumbers.largePositive);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle subtraction of very large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.subtract(
          largeNumbers.largePositive,
          largeNumbers.largeNegative,
        );
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle multiplication of large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.multiply(1000000, 1000000);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle division of large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.divide(largeNumbers.largePositive, 123456);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle power operations with large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.power(10, 12);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle square root of large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.sqrt(largeNumbers.largePositive);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle modulo with large numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.modulo(largeNumbers.largePositive, 1000000);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle operations near MAX_SAFE_INTEGER boundary', () => {
      const result = service.add(largeNumbers.nearMaxSafe, 100);
      expect(result).toBeDefined();
      expect(Number.isFinite(result)).toBe(true);
    });

    it('should handle operations near MIN_SAFE_INTEGER boundary', () => {
      const result = service.subtract(largeNumbers.nearMinSafe, 100);
      expect(result).toBeDefined();
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe('Batch Operations Performance', () => {
    it('should handle 100 sequential additions efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.add(i, i + 1);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle 1000 sequential multiplications efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 1; i <= 1000; i++) {
          service.multiply(i, 2);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.standard);
    });

    it('should handle 100 mixed operations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 1; i <= 100; i++) {
          service.add(i, i);
          service.subtract(i * 2, i);
          service.multiply(i, 3);
          service.divide(i * 3, 3);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.standard);
    });

    it('should handle batch factorial calculations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i <= 20; i++) {
          service.factorial(i);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle batch square root calculations efficiently', async () => {
      const numbers = generateRandomNumbers(100, 1, 1000000);
      const time = await measureExecutionTime(() => {
        numbers.forEach((num) => service.sqrt(num));
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle batch power calculations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 1; i <= 50; i++) {
          service.power(2, i % 10);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });
  });

  describe('High-Precision Decimal Performance', () => {
    it('should handle high-precision decimal additions efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.add(123456.789123, 987654.321987);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle very small decimal operations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.multiply(0.0000001, 0.0000002);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle mixed precision operations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.add(999999.999999, 0.000001);
        service.subtract(0.000001, 999999.999999);
        service.multiply(123.456, 0.001);
        service.divide(0.001, 123.456);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });
  });

  describe('Formatted Response Performance', () => {
    it('should handle formatted responses efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.add(i, i + 1, true);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should format large batch of results efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.add(10, 20, true);
        service.subtract(100, 50, true);
        service.multiply(5, 8, true);
        service.divide(100, 4, true);
        service.power(2, 10, true);
        service.sqrt(144, true);
        service.factorial(10, true);
        service.modulo(17, 5, true);
        service.absolute(-42, true);
        service.ceiling(3.14, true);
        service.floor(3.14, true);
        service.round(3.14, true);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });
  });

  describe('Average Performance Benchmarks', () => {
    it('should have consistent add operation performance', async () => {
      const avgTime = await benchmark(
        () => service.add(12345, 67890),
        STRESS_TEST_CONFIG.iterations.standard,
      );

      expect(avgTime).toBeLessThan(1); // Less than 1ms average
    });

    it('should have consistent multiply operation performance', async () => {
      const avgTime = await benchmark(
        () => service.multiply(123, 456),
        STRESS_TEST_CONFIG.iterations.standard,
      );

      expect(avgTime).toBeLessThan(1);
    });

    it('should have consistent divide operation performance', async () => {
      const avgTime = await benchmark(
        () => service.divide(100000, 7),
        STRESS_TEST_CONFIG.iterations.standard,
      );

      expect(avgTime).toBeLessThan(1);
    });

    it('should have consistent factorial performance for small inputs', async () => {
      const avgTime = await benchmark(
        () => service.factorial(10),
        STRESS_TEST_CONFIG.iterations.standard,
      );

      expect(avgTime).toBeLessThan(1);
    });

    it('should have consistent sqrt performance', async () => {
      const avgTime = await benchmark(
        () => service.sqrt(123456),
        STRESS_TEST_CONFIG.iterations.standard,
      );

      expect(avgTime).toBeLessThan(1);
    });
  });

  describe('Factorial Performance with Large Inputs', () => {
    it('should handle factorial(50) efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.factorial(50);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle factorial(100) efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.factorial(100);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle factorial(170) efficiently', async () => {
      const time = await measureExecutionTime(() => {
        service.factorial(170);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle multiple large factorial calculations', async () => {
      const time = await measureExecutionTime(() => {
        service.factorial(50);
        service.factorial(75);
        service.factorial(100);
        service.factorial(150);
      });

      expect(time).toBeLessThan(100); // 100ms for 4 large factorials
    });
  });

  describe('Stress Testing - Error Handling Performance', () => {
    it('should handle validation errors efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          try {
            service.add(NaN, 5);
          } catch (error) {
            // Expected error
          }
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle division by zero errors efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          try {
            service.divide(i, 0);
          } catch (error) {
            // Expected error
          }
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle overflow errors efficiently', async () => {
      const time = await measureExecutionTime(() => {
        try {
          service.add(Number.MAX_SAFE_INTEGER, 10000);
        } catch (error) {
          // Expected error
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        service.add(i, i + 1);
        service.multiply(i, 2);
        service.divide(i + 1, 2);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(
        STRESS_TEST_CONFIG.thresholds.maxMemoryIncrease,
      );
    });

    it('should handle rapid consecutive calls efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          service.add(1, 1);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });
  });

  describe('Complex Calculation Chains', () => {
    it('should handle complex calculation chains efficiently', async () => {
      const time = await measureExecutionTime(() => {
        let result = service.add(10, 20);
        result = service.multiply(result, 2);
        result = service.divide(result, 3);
        result = service.subtract(result, 5);
        result = service.absolute(result);
        result = service.round(result);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });

    it('should handle nested calculation patterns efficiently', async () => {
      const time = await measureExecutionTime(() => {
        const a = service.add(10, 20);
        const b = service.multiply(5, 6);
        const c = service.subtract(a, b);
        const d = service.power(2, 3);
        const result = service.add(c, d);
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.thresholds.maxExecutionTime);
    });
  });

  describe('Random Input Performance', () => {
    it('should handle random additions efficiently', async () => {
      const numbers = generateRandomNumbers(100, -1000, 1000);
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < numbers.length - 1; i++) {
          service.add(numbers[i], numbers[i + 1]);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle random multiplications efficiently', async () => {
      const numbers = generateRandomNumbers(100, -100, 100);
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < numbers.length - 1; i++) {
          service.multiply(numbers[i], numbers[i + 1]);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle random divisions efficiently', async () => {
      const numbers = generateRandomNumbers(100, 1, 1000);
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < numbers.length - 1; i++) {
          service.divide(numbers[i], numbers[i + 1]);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle zero operations efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          service.add(0, 0);
          service.multiply(0, i);
          service.absolute(0);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle negative zero efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.add(-0, 0);
          service.multiply(-0, i);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });

    it('should handle very small numbers efficiently', async () => {
      const time = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          service.add(Number.MIN_VALUE, Number.MIN_VALUE);
          service.multiply(Number.EPSILON, Number.EPSILON);
        }
      });

      expect(time).toBeLessThan(STRESS_TEST_CONFIG.timeouts.quick);
    });
  });
});

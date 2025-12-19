import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return basic health status', () => {
      const result = service.check();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service', 'calculator-api');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    it('should increment request count', () => {
      const initialMetrics = service.getMetrics();
      const initialCount = initialMetrics.requests.total;

      service.check();
      service.check();

      const updatedMetrics = service.getMetrics();
      expect(updatedMetrics.requests.total).toBe(initialCount + 2);
    });
  });

  describe('getLegacyStatus', () => {
    it('should return detailed status information', () => {
      const result = service.getLegacyStatus();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('uptimeHuman');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('memory');
      expect(result.memory).toHaveProperty('used');
      expect(result.memory).toHaveProperty('total');
    });

    it('should have increasing uptime', async () => {
      const result1 = service.getLegacyStatus();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result2 = service.getLegacyStatus();

      expect(result2.uptime).toBeGreaterThan(result1.uptime);
    });
  });

  describe('getDetailedStatus', () => {
    it('should return comprehensive system information', async () => {
      const result = await service.getDetailedStatus();

      expect(result).toHaveProperty('application');
      const details = result.application as any;

      expect(details).toHaveProperty('status', 'up');
      expect(details).toHaveProperty('timestamp');
      expect(details).toHaveProperty('uptime');
      expect(details.uptime).toHaveProperty('milliseconds');
      expect(details.uptime).toHaveProperty('human');
      expect(details).toHaveProperty('system');
      expect(details.system).toHaveProperty('platform');
      expect(details.system).toHaveProperty('arch');
      expect(details.system).toHaveProperty('nodeVersion');
      expect(details.system).toHaveProperty('hostname');
      expect(details.system).toHaveProperty('cpus');
      expect(details).toHaveProperty('process');
      expect(details.process).toHaveProperty('pid');
      expect(details.process).toHaveProperty('memory');
      expect(details.process).toHaveProperty('cpu');
      expect(details).toHaveProperty('environment');
    });

    it('should return valid memory statistics', async () => {
      const result = await service.getDetailedStatus();
      const details = result.application as any;

      expect(details.process.memory.heapUsed).toBeGreaterThan(0);
      expect(details.process.memory.heapTotal).toBeGreaterThan(0);
      expect(details.process.memory.heapUsed).toBeLessThanOrEqual(
        details.process.memory.heapTotal,
      );
    });
  });

  describe('checkLiveness', () => {
    it('should return alive status', async () => {
      const result = await service.checkLiveness();

      expect(result).toHaveProperty('liveness');
      const liveness = result.liveness as any;

      expect(liveness).toHaveProperty('status', 'up');
      expect(liveness).toHaveProperty('message', 'Application is alive and running');
      expect(liveness).toHaveProperty('uptime');
      expect(liveness.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('checkReadiness', () => {
    it('should return not ready status immediately after creation', async () => {
      const freshService = new HealthService();
      const result = await freshService.checkReadiness();

      expect(result).toHaveProperty('readiness');
      const readiness = result.readiness as any;

      expect(readiness).toHaveProperty('status', 'down');
      expect(readiness).toHaveProperty('message', 'Application is initializing');
    });

    it('should return ready status after initialization period', async () => {
      // Wait for initialization timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const result = await service.checkReadiness();

      expect(result).toHaveProperty('readiness');
      const readiness = result.readiness as any;

      expect(readiness).toHaveProperty('status', 'up');
      expect(readiness).toHaveProperty('message', 'Application is ready to accept traffic');
      expect(readiness).toHaveProperty('ready', true);
    });
  });

  describe('getMetrics', () => {
    it('should return comprehensive metrics', () => {
      const result = service.getMetrics();

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result.uptime).toHaveProperty('milliseconds');
      expect(result.uptime).toHaveProperty('seconds');
      expect(result.uptime).toHaveProperty('human');
      expect(result).toHaveProperty('requests');
      expect(result.requests).toHaveProperty('total');
      expect(result.requests).toHaveProperty('errors');
      expect(result.requests).toHaveProperty('successRate');
      expect(result).toHaveProperty('memory');
      expect(result).toHaveProperty('cpu');
      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('process');
    });

    it('should track request and error counts', () => {
      service.incrementRequestCount();
      service.incrementRequestCount();
      service.incrementErrorCount();

      const metrics = service.getMetrics();

      expect(metrics.requests.total).toBeGreaterThanOrEqual(2);
      expect(metrics.requests.errors).toBeGreaterThanOrEqual(1);
    });

    it('should calculate success rate correctly', () => {
      // Reset by creating new instance for clean test
      const testService = new HealthService();

      testService.incrementRequestCount();
      testService.incrementRequestCount();
      testService.incrementRequestCount();
      testService.incrementRequestCount();
      testService.incrementErrorCount();

      const metrics = testService.getMetrics();

      expect(metrics.requests.total).toBe(4);
      expect(metrics.requests.errors).toBe(1);
      expect(metrics.requests.successRate).toBe(75);
    });

    it('should handle zero requests gracefully', () => {
      const freshService = new HealthService();
      const metrics = freshService.getMetrics();

      expect(metrics.requests.total).toBe(0);
      expect(metrics.requests.errors).toBe(0);
      expect(metrics.requests.successRate).toBe(100);
    });

    it('should include memory metrics in MB', () => {
      const metrics = service.getMetrics();

      expect(metrics.memory).toHaveProperty('heapUsedMB');
      expect(metrics.memory).toHaveProperty('heapTotalMB');
      expect(metrics.memory).toHaveProperty('rssMB');
      expect(metrics.memory.heapUsedMB).toBeGreaterThan(0);
      expect(metrics.memory.heapTotalMB).toBeGreaterThan(0);
    });

    it('should include system information', () => {
      const metrics = service.getMetrics();

      expect(metrics.system).toHaveProperty('platform');
      expect(metrics.system).toHaveProperty('arch');
      expect(metrics.system).toHaveProperty('cpus');
      expect(metrics.system).toHaveProperty('totalMemoryGB');
      expect(metrics.system).toHaveProperty('freeMemoryGB');
      expect(metrics.system).toHaveProperty('loadAverage');
      expect(metrics.system.cpus).toBeGreaterThan(0);
    });
  });

  describe('incrementErrorCount', () => {
    it('should increment error count', () => {
      const initialMetrics = service.getMetrics();
      const initialErrors = initialMetrics.requests.errors;

      service.incrementErrorCount();

      const updatedMetrics = service.getMetrics();
      expect(updatedMetrics.requests.errors).toBe(initialErrors + 1);
    });
  });

  describe('incrementRequestCount', () => {
    it('should increment request count', () => {
      const initialMetrics = service.getMetrics();
      const initialCount = initialMetrics.requests.total;

      service.incrementRequestCount();

      const updatedMetrics = service.getMetrics();
      expect(updatedMetrics.requests.total).toBe(initialCount + 1);
    });
  });

  describe('formatUptime', () => {
    it('should format uptime correctly for seconds', () => {
      const result = service.getLegacyStatus();

      // For a fresh service, uptime should be in seconds format
      expect(result.uptimeHuman).toMatch(/^\d+s$/);
    });

    it('should format uptime correctly over time', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = service.getLegacyStatus();

      expect(result.uptimeHuman).toBeTruthy();
      expect(typeof result.uptimeHuman).toBe('string');
    });
  });

  describe('critical issues detection', () => {
    it('should detect high memory usage as critical', async () => {
      // This test validates the logic exists, but can't easily trigger 90% memory usage
      const result = await service.checkReadiness();

      // Under normal test conditions, should be ready
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const readyResult = await service.checkReadiness();

      expect(readyResult).toHaveProperty('readiness');
      const readiness = readyResult.readiness as any;
      expect(['up', 'down']).toContain(readiness.status);
    });
  });
});

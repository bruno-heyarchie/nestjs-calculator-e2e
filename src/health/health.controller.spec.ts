import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;
  let healthCheckService: HealthCheckService;
  let memoryHealthIndicator: MemoryHealthIndicator;
  let diskHealthIndicator: DiskHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn(),
            getLegacyStatus: jest.fn(),
            getDetailedStatus: jest.fn(),
            checkLiveness: jest.fn(),
            checkReadiness: jest.fn(),
            getMetrics: jest.fn(),
          },
        },
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    memoryHealthIndicator =
      module.get<MemoryHealthIndicator>(MemoryHealthIndicator);
    diskHealthIndicator = module.get<DiskHealthIndicator>(DiskHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return basic health status', () => {
      const mockResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'calculator-api',
      };

      jest.spyOn(healthService, 'check').mockReturnValue(mockResponse);

      const result = controller.check();

      expect(result).toEqual(mockResponse);
      expect(healthService.check).toHaveBeenCalled();
    });
  });

  describe('detailed', () => {
    it('should return detailed health status with all indicators', async () => {
      const mockDetailedStatus = {
        application: {
          status: 'up',
          timestamp: expect.any(String),
        },
      };

      const mockMemoryHeap = { 'memory_heap': { status: 'up' } };
      const mockMemoryRss = { 'memory_rss': { status: 'up' } };
      const mockDisk = { disk: { status: 'up' } };

      jest
        .spyOn(healthService, 'getDetailedStatus')
        .mockResolvedValue(mockDetailedStatus as any);
      jest
        .spyOn(memoryHealthIndicator, 'checkHeap')
        .mockResolvedValue(mockMemoryHeap as any);
      jest
        .spyOn(memoryHealthIndicator, 'checkRSS')
        .mockResolvedValue(mockMemoryRss as any);
      jest
        .spyOn(diskHealthIndicator, 'checkStorage')
        .mockResolvedValue(mockDisk as any);

      const mockHealthCheckResult = {
        status: 'ok',
        info: { ...mockDetailedStatus, ...mockMemoryHeap, ...mockMemoryRss, ...mockDisk },
        error: {},
        details: { ...mockDetailedStatus, ...mockMemoryHeap, ...mockMemoryRss, ...mockDisk },
      };

      jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(mockHealthCheckResult as any);

      const result = await controller.detailed();

      expect(result).toEqual(mockHealthCheckResult);
      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ]);
    });
  });

  describe('liveness', () => {
    it('should return liveness status', async () => {
      const mockLivenessStatus = {
        liveness: {
          status: 'up',
          message: 'Application is alive and running',
        },
      };

      jest
        .spyOn(healthService, 'checkLiveness')
        .mockResolvedValue(mockLivenessStatus as any);

      const mockHealthCheckResult = {
        status: 'ok',
        info: mockLivenessStatus,
        error: {},
        details: mockLivenessStatus,
      };

      jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(mockHealthCheckResult as any);

      const result = await controller.liveness();

      expect(result).toEqual(mockHealthCheckResult);
      expect(healthCheckService.check).toHaveBeenCalled();
    });
  });

  describe('readiness', () => {
    it('should return ready status when application is ready', async () => {
      const mockReadinessStatus = {
        readiness: {
          status: 'up',
          message: 'Application is ready to accept traffic',
        },
      };

      jest
        .spyOn(healthService, 'checkReadiness')
        .mockResolvedValue(mockReadinessStatus as any);

      const mockHealthCheckResult = {
        status: 'ok',
        info: mockReadinessStatus,
        error: {},
        details: mockReadinessStatus,
      };

      jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(mockHealthCheckResult as any);

      const result = await controller.readiness();

      expect(result).toEqual(mockHealthCheckResult);
      expect(healthCheckService.check).toHaveBeenCalled();
    });
  });

  describe('metrics', () => {
    it('should return application metrics', () => {
      const mockMetrics = {
        timestamp: new Date().toISOString(),
        uptime: { milliseconds: 1000, seconds: 1, human: '1s' },
        requests: { total: 10, errors: 0, successRate: 100 },
        memory: {
          heapUsed: 1000000,
          heapTotal: 2000000,
        },
        cpu: { user: 100000, system: 50000 },
      };

      jest.spyOn(healthService, 'getMetrics').mockReturnValue(mockMetrics);

      const result = controller.metrics();

      expect(result).toEqual(mockMetrics);
      expect(healthService.getMetrics).toHaveBeenCalled();
    });
  });

  describe('status', () => {
    it('should return legacy status endpoint', () => {
      const mockStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 1000,
        uptimeHuman: '1s',
      };

      jest.spyOn(healthService, 'getLegacyStatus').mockReturnValue(mockStatus);

      const result = controller.status();

      expect(result).toEqual(mockStatus);
      expect(healthService.getLegacyStatus).toHaveBeenCalled();
    });
  });
});

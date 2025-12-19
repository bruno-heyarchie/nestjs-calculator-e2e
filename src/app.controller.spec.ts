import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getAppInfo', () => {
    it('should return application information', () => {
      const result = {
        name: 'Calculator API',
        version: '0.0.1',
        description:
          'A NestJS-based REST API calculator application providing basic arithmetic operations',
        environment: 'development',
      };

      jest.spyOn(appService, 'getAppInfo').mockReturnValue(result);

      expect(appController.getAppInfo()).toEqual(result);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = {
        status: 'ok',
        timestamp: '2025-12-19T09:00:00.000Z',
        uptime: 123.456,
        environment: 'development',
        version: '0.0.1',
      };

      jest.spyOn(appService, 'getHealthStatus').mockReturnValue(result);

      expect(appController.healthCheck()).toEqual(result);
    });
  });
});

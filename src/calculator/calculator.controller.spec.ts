import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';

describe('CalculatorController', () => {
  let controller: CalculatorController;
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers: [CalculatorService],
    }).compile();

    controller = module.get<CalculatorController>(CalculatorController);
    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should return addition result', () => {
      const result = controller.add(5, 3);
      expect(result).toEqual({
        operation: 'addition',
        a: 5,
        b: 3,
        result: 8,
      });
    });

    it('should call service.add with correct parameters', () => {
      const spy = jest.spyOn(service, 'add');
      controller.add(10, 20);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });
  });

  describe('subtract', () => {
    it('should return subtraction result', () => {
      const result = controller.subtract(5, 3);
      expect(result).toEqual({
        operation: 'subtraction',
        a: 5,
        b: 3,
        result: 2,
      });
    });

    it('should call service.subtract with correct parameters', () => {
      const spy = jest.spyOn(service, 'subtract');
      controller.subtract(10, 20);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });
  });

  describe('multiply', () => {
    it('should return multiplication result', () => {
      const result = controller.multiply(5, 3);
      expect(result).toEqual({
        operation: 'multiplication',
        a: 5,
        b: 3,
        result: 15,
      });
    });

    it('should call service.multiply with correct parameters', () => {
      const spy = jest.spyOn(service, 'multiply');
      controller.multiply(10, 20);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });
  });

  describe('divide', () => {
    it('should return division result', () => {
      const result = controller.divide(6, 3);
      expect(result).toEqual({
        operation: 'division',
        a: 6,
        b: 3,
        result: 2,
      });
    });

    it('should call service.divide with correct parameters', () => {
      const spy = jest.spyOn(service, 'divide');
      controller.divide(10, 2);
      expect(spy).toHaveBeenCalledWith(10, 2);
    });
  });
});

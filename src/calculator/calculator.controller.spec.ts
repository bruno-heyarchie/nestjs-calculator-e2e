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

  describe('addPost', () => {
    it('should return addition result with CalculatorResponseDto format', () => {
      const request = { a: 5, b: 3 };
      const result = controller.addPost(request);
      expect(result).toEqual({
        result: 8,
        operation: 'addition',
      });
    });

    it('should call service.add with correct parameters', () => {
      const spy = jest.spyOn(service, 'add');
      const request = { a: 10, b: 20 };
      controller.addPost(request);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });

    it('should handle negative numbers', () => {
      const request = { a: -5, b: 3 };
      const result = controller.addPost(request);
      expect(result).toEqual({
        result: -2,
        operation: 'addition',
      });
    });

    it('should handle decimal numbers', () => {
      const request = { a: 5.5, b: 3.2 };
      const result = controller.addPost(request);
      expect(result).toEqual({
        result: 8.7,
        operation: 'addition',
      });
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

  describe('subtractPost', () => {
    it('should return subtraction result with CalculatorResponseDto format', () => {
      const request = { a: 5, b: 3 };
      const result = controller.subtractPost(request);
      expect(result).toEqual({
        result: 2,
        operation: 'subtraction',
      });
    });

    it('should call service.subtract with correct parameters', () => {
      const spy = jest.spyOn(service, 'subtract');
      const request = { a: 10, b: 20 };
      controller.subtractPost(request);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });

    it('should handle negative results when b > a', () => {
      const request = { a: 3, b: 5 };
      const result = controller.subtractPost(request);
      expect(result).toEqual({
        result: -2,
        operation: 'subtraction',
      });
    });

    it('should handle decimal numbers', () => {
      const request = { a: 5.5, b: 3.2 };
      const result = controller.subtractPost(request);
      expect(result).toEqual({
        result: 2.3,
        operation: 'subtraction',
      });
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

  describe('multiplyPost', () => {
    it('should return multiplication result with CalculatorResponseDto format', () => {
      const request = { a: 5, b: 3 };
      const result = controller.multiplyPost(request);
      expect(result).toEqual({
        result: 15,
        operation: 'multiplication',
      });
    });

    it('should call service.multiply with correct parameters', () => {
      const spy = jest.spyOn(service, 'multiply');
      const request = { a: 10, b: 20 };
      controller.multiplyPost(request);
      expect(spy).toHaveBeenCalledWith(10, 20);
    });

    it('should handle multiplication by zero', () => {
      const request = { a: 5, b: 0 };
      const result = controller.multiplyPost(request);
      expect(result).toEqual({
        result: 0,
        operation: 'multiplication',
      });
    });

    it('should handle negative numbers', () => {
      const request = { a: -5, b: 3 };
      const result = controller.multiplyPost(request);
      expect(result).toEqual({
        result: -15,
        operation: 'multiplication',
      });
    });

    it('should handle two negative numbers', () => {
      const request = { a: -5, b: -3 };
      const result = controller.multiplyPost(request);
      expect(result).toEqual({
        result: 15,
        operation: 'multiplication',
      });
    });

    it('should handle decimal numbers', () => {
      const request = { a: 5.5, b: 2 };
      const result = controller.multiplyPost(request);
      expect(result).toEqual({
        result: 11,
        operation: 'multiplication',
      });
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

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { CalculatorModule } from './calculator.module';
import { ValidationService } from './validation/validation.service';

describe('CalculatorController', () => {
  let controller: CalculatorController;
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers: [CalculatorService, ValidationService],
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
        result: 8,
        operation: 'addition',
        operands: [5, 3],
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
        result: 15,
        operation: 'multiplication',
        operands: [5, 3],
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

describe('CalculatorController (integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CalculatorModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /calculator/add', () => {
    it('should return 201 and correct result for valid request', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 2, b: 3 })
        .expect(201)
        .expect({ result: 5, operation: 'addition' });
    });

    it('should handle negative numbers', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: -5, b: 3 })
        .expect(201)
        .expect({ result: -2, operation: 'addition' });
    });

    it('should handle decimal numbers', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 1.5, b: 2.5 })
        .expect(201)
        .expect({ result: 4, operation: 'addition' });
    });

    it('should return 400 for missing parameter a', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ b: 3 })
        .expect(400)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const message = Array.isArray(response.body.message)
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              response.body.message.join(' ')
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              response.body.message;
          expect(message).toContain('a');
        });
    });

    it('should return 400 for missing parameter b', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 2 })
        .expect(400)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const message = Array.isArray(response.body.message)
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              response.body.message.join(' ')
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              response.body.message;
          expect(message).toContain('b');
        });
    });

    it('should return 400 for non-numeric value', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 'invalid', b: 3 })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBeDefined();
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({})
        .expect(400);
    });

    it('should have correct response schema', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 10, b: 5 })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('result');
          expect(response.body).toHaveProperty('operation');
          expect(typeof response.body.result).toBe('number');
          expect(typeof response.body.operation).toBe('string');
        });
    });
  });

  describe('POST /calculator/subtract', () => {
    it('should return 201 and correct result for valid request', () => {
      return request(app.getHttpServer())
        .post('/calculator/subtract')
        .send({ a: 5, b: 3 })
        .expect(201)
        .expect({ result: 2, operation: 'subtraction' });
    });

    it('should handle negative results', () => {
      return request(app.getHttpServer())
        .post('/calculator/subtract')
        .send({ a: 3, b: 5 })
        .expect(201)
        .expect({ result: -2, operation: 'subtraction' });
    });

    it('should handle decimal numbers', () => {
      return request(app.getHttpServer())
        .post('/calculator/subtract')
        .send({ a: 5.5, b: 2.5 })
        .expect(201)
        .expect({ result: 3, operation: 'subtraction' });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/calculator/subtract')
        .send({ a: 'test', b: 3 })
        .expect(400);
    });

    it('should have correct response schema', () => {
      return request(app.getHttpServer())
        .post('/calculator/subtract')
        .send({ a: 10, b: 5 })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('result');
          expect(response.body).toHaveProperty('operation');
          expect(response.body.operation).toBe('subtraction');
        });
    });
  });

  describe('POST /calculator/multiply', () => {
    it('should return 201 and correct result for valid request', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: 4, b: 3 })
        .expect(201)
        .expect({ result: 12, operation: 'multiplication' });
    });

    it('should handle multiplication by zero', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: 5, b: 0 })
        .expect(201)
        .expect({ result: 0, operation: 'multiplication' });
    });

    it('should handle negative numbers', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: -4, b: 3 })
        .expect(201)
        .expect({ result: -12, operation: 'multiplication' });
    });

    it('should handle two negative numbers', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: -4, b: -3 })
        .expect(201)
        .expect({ result: 12, operation: 'multiplication' });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: null, b: 3 })
        .expect(400);
    });

    it('should have correct response schema', () => {
      return request(app.getHttpServer())
        .post('/calculator/multiply')
        .send({ a: 10, b: 5 })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('result');
          expect(response.body).toHaveProperty('operation');
          expect(response.body.operation).toBe('multiplication');
        });
    });
  });

  describe('GET /calculator/add', () => {
    it('should return 200 and correct result for valid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=2&b=3')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            result: 5,
            operation: 'addition',
            operands: [2, 3],
          });
        });
    });

    it('should return 400 for missing query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=2')
        .expect(400);
    });

    it('should return 400 for non-numeric query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=test&b=3')
        .expect(400);
    });

    it('should have correct response schema', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=10&b=5')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('result');
          expect(response.body).toHaveProperty('operation');
          expect(response.body).toHaveProperty('operands');
          expect(Array.isArray(response.body.operands)).toBe(true);
          expect(response.body.operands).toHaveLength(2);
        });
    });
  });

  describe('GET /calculator/subtract', () => {
    it('should return 200 and correct result for valid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=5&b=3')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            operation: 'subtraction',
            a: 5,
            b: 3,
            result: 2,
          });
        });
    });

    it('should return 400 for invalid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=abc&b=3')
        .expect(400);
    });
  });

  describe('GET /calculator/multiply', () => {
    it('should return 200 and correct result for valid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=4&b=3')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            result: 12,
            operation: 'multiplication',
            operands: [4, 3],
          });
        });
    });

    it('should return 400 for missing query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?b=3')
        .expect(400);
    });

    it('should handle multiplication with zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=5&b=0')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            result: 0,
            operation: 'multiplication',
            operands: [5, 0],
          });
        });
    });

    it('should handle decimal numbers with appropriate precision', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=4.5&b=2.5')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            result: 11.25,
            operation: 'multiplication',
            operands: [4.5, 2.5],
          });
        });
    });
  });

  describe('GET /calculator/divide', () => {
    it('should return 200 and correct result for valid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=6&b=3')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            result: 2,
            operation: 'division',
            operands: [6, 3],
          });
        });
    });

    it('should return 400 when dividing by zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=5&b=0')
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const errorMessage =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            typeof response.body.message === 'string'
              ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                response.body.message
              : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                JSON.stringify(response.body.message);
          expect(errorMessage).toMatch(/division|zero/i);
        });
    });

    it('should return 400 for invalid query parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=10&b=invalid')
        .expect(400);
    });

    it('should have correct response schema', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=10&b=5')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('result');
          expect(response.body).toHaveProperty('operation');
          expect(response.body).toHaveProperty('operands');
          expect(Array.isArray(response.body.operands)).toBe(true);
          expect(response.body.operands).toHaveLength(2);
        });
    });
  });

  describe('Response format validation', () => {
    it('should return consistent response format for POST endpoints', async () => {
      const operations = [
        {
          endpoint: '/calculator/add',
          payload: { a: 2, b: 3 },
          expectedOp: 'addition',
        },
        {
          endpoint: '/calculator/subtract',
          payload: { a: 5, b: 3 },
          expectedOp: 'subtraction',
        },
        {
          endpoint: '/calculator/multiply',
          payload: { a: 4, b: 3 },
          expectedOp: 'multiplication',
        },
      ];

      for (const op of operations) {
        const response = await request(app.getHttpServer())
          .post(op.endpoint)
          .send(op.payload)
          .expect(201);

        expect(response.body).toHaveProperty('result');
        expect(response.body).toHaveProperty('operation');
        expect(response.body.operation).toBe(op.expectedOp);
        expect(typeof response.body.result).toBe('number');
      }
    });

    it('should return consistent response format for GET endpoints', async () => {
      const operations = [
        { endpoint: '/calculator/add?a=2&b=3', expectedOp: 'addition' },
        { endpoint: '/calculator/subtract?a=5&b=3', expectedOp: 'subtraction' },
        {
          endpoint: '/calculator/multiply?a=4&b=3',
          expectedOp: 'multiplication',
        },
        { endpoint: '/calculator/divide?a=6&b=3', expectedOp: 'division' },
      ];

      for (const op of operations) {
        const response = await request(app.getHttpServer())
          .get(op.endpoint)
          .expect(200);

        expect(response.body).toHaveProperty('result');
        expect(response.body).toHaveProperty('operation');
        if (
          op.expectedOp === 'addition' ||
          op.expectedOp === 'multiplication' ||
          op.expectedOp === 'division'
        ) {
          expect(response.body).toHaveProperty('operands');
          expect(Array.isArray(response.body.operands)).toBe(true);
        } else {
          expect(response.body).toHaveProperty('a');
          expect(response.body).toHaveProperty('b');
        }
        expect(response.body.operation).toBe(op.expectedOp);
      }
    });
  });

  describe('Error handling', () => {
    it('should return proper error format for validation errors', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({ a: 'invalid' })
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('statusCode');
          expect(response.body.statusCode).toBe(400);
        });
    });

    it('should handle multiple validation errors', () => {
      return request(app.getHttpServer())
        .post('/calculator/add')
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          expect(
            Array.isArray(response.body.message) ||
              typeof response.body.message === 'string',
          ).toBe(true);
        });
    });

    it('should return proper error for division by zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=5&b=0')
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const errorMessage =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            typeof response.body.message === 'string'
              ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                response.body.message
              : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                JSON.stringify(response.body.message);
          expect(errorMessage).toMatch(/division|zero/i);
        });
    });
  });
});

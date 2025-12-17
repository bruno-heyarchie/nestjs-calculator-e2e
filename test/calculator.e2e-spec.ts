import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  CalculatorTestDataFactory,
  MockResponseFactory,
} from './helpers/test-data-factory';

describe('Calculator API (e2e)', () => {
  let app: INestApplication<App>;

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

  describe('/calculator/add (GET)', () => {
    it('should add two positive numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=5&b=3')
        .expect(200)
        .expect(MockResponseFactory.createSuccessResponse('addition', 5, 3, 8));
    });

    it('should add negative numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=-5&b=-3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('addition', -5, -3, -8),
        );
    });

    it('should add decimal numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=1.5&b=2.3')
        .expect(200)
        .then((response) => {
          expect(response.body.operation).toBe('addition');
          expect(response.body.a).toBe(1.5);
          expect(response.body.b).toBe(2.3);
          expect(response.body.result).toBeCloseTo(3.8, 1);
        });
    });

    it('should handle zero values', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=0&b=5')
        .expect(200)
        .expect(MockResponseFactory.createSuccessResponse('addition', 0, 5, 5));
    });

    it('should return 400 for missing parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=5')
        .expect(400);
    });

    it('should return 400 for non-numeric values', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=abc&b=5')
        .expect(400);
    });

    it('should return 400 for NaN values', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=NaN&b=5')
        .expect(400);
    });

    it('should return 400 for Infinity values', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=Infinity&b=5')
        .expect(400);
    });
  });

  describe('/calculator/subtract (GET)', () => {
    it('should subtract two positive numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=5&b=3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('subtraction', 5, 3, 2),
        );
    });

    it('should subtract negative numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=-5&b=-3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('subtraction', -5, -3, -2),
        );
    });

    it('should subtract decimal numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=5.5&b=2.3')
        .expect(200)
        .then((response) => {
          expect(response.body.operation).toBe('subtraction');
          expect(response.body.a).toBe(5.5);
          expect(response.body.b).toBe(2.3);
          expect(response.body.result).toBeCloseTo(3.2, 1);
        });
    });

    it('should handle zero values', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=5&b=0')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('subtraction', 5, 0, 5),
        );
    });

    it('should return 400 for missing parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?b=5')
        .expect(400);
    });

    it('should return 400 for non-numeric values', () => {
      return request(app.getHttpServer())
        .get('/calculator/subtract?a=5&b=xyz')
        .expect(400);
    });
  });

  describe('/calculator/multiply (GET)', () => {
    it('should multiply two positive numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=5&b=3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('multiplication', 5, 3, 15),
        );
    });

    it('should multiply negative numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=-5&b=-3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('multiplication', -5, -3, 15),
        );
    });

    it('should multiply by zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=5&b=0')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('multiplication', 5, 0, 0),
        );
    });

    it('should multiply decimal numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=2.5&b=4')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('multiplication', 2.5, 4, 10),
        );
    });

    it('should return 400 for missing parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=5')
        .expect(400);
    });

    it('should return 400 for non-numeric values', () => {
      return request(app.getHttpServer())
        .get('/calculator/multiply?a=5&b=test')
        .expect(400);
    });
  });

  describe('/calculator/divide (GET)', () => {
    it('should divide two positive numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=6&b=3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('division', 6, 3, 2),
        );
    });

    it('should divide negative numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=-6&b=-3')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('division', -6, -3, 2),
        );
    });

    it('should divide decimal numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=7.5&b=2.5')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('division', 7.5, 2.5, 3),
        );
    });

    it('should divide zero by a number', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=0&b=5')
        .expect(200)
        .expect(
          MockResponseFactory.createSuccessResponse('division', 0, 5, 0),
        );
    });

    it('should return 400 when dividing by zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=5&b=0')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('Division by zero');
        });
    });

    it('should return 400 for missing parameters', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=10')
        .expect(400);
    });

    it('should return 400 for non-numeric values', () => {
      return request(app.getHttpServer())
        .get('/calculator/divide?a=test&b=5')
        .expect(400);
    });
  });

  describe('Parametrized tests using test data factory', () => {
    describe('Addition test cases', () => {
      const testCases = CalculatorTestDataFactory.getAdditionTestCases();

      testCases.forEach(({ a, b, expectedResult, description }) => {
        it(`should correctly add ${description}`, () => {
          return request(app.getHttpServer())
            .get(`/calculator/add?a=${a}&b=${b}`)
            .expect(200)
            .then((response) => {
              expect(response.body.a).toBe(a);
              expect(response.body.b).toBe(b);
              if (Number.isInteger(expectedResult)) {
                expect(response.body.result).toBe(expectedResult);
              } else {
                expect(response.body.result).toBeCloseTo(expectedResult, 1);
              }
            });
        });
      });
    });

    describe('Subtraction test cases', () => {
      const testCases = CalculatorTestDataFactory.getSubtractionTestCases();

      testCases.forEach(({ a, b, expectedResult, description }) => {
        it(`should correctly subtract ${description}`, () => {
          return request(app.getHttpServer())
            .get(`/calculator/subtract?a=${a}&b=${b}`)
            .expect(200)
            .then((response) => {
              expect(response.body.a).toBe(a);
              expect(response.body.b).toBe(b);
              if (Number.isInteger(expectedResult)) {
                expect(response.body.result).toBe(expectedResult);
              } else {
                expect(response.body.result).toBeCloseTo(expectedResult, 1);
              }
            });
        });
      });
    });

    describe('Multiplication test cases', () => {
      const testCases = CalculatorTestDataFactory.getMultiplicationTestCases();

      testCases.forEach(({ a, b, expectedResult, description }) => {
        it(`should correctly multiply ${description}`, () => {
          return request(app.getHttpServer())
            .get(`/calculator/multiply?a=${a}&b=${b}`)
            .expect(200)
            .then((response) => {
              expect(response.body.a).toBe(a);
              expect(response.body.b).toBe(b);
              if (Number.isInteger(expectedResult)) {
                expect(response.body.result).toBe(expectedResult);
              } else {
                expect(response.body.result).toBeCloseTo(expectedResult, 1);
              }
            });
        });
      });
    });

    describe('Division test cases', () => {
      const testCases = CalculatorTestDataFactory.getDivisionTestCases();

      testCases.forEach(({ a, b, expectedResult, description }) => {
        it(`should correctly divide ${description}`, () => {
          return request(app.getHttpServer())
            .get(`/calculator/divide?a=${a}&b=${b}`)
            .expect(200)
            .then((response) => {
              expect(response.body.a).toBe(a);
              expect(response.body.b).toBe(b);
              if (Number.isInteger(expectedResult)) {
                expect(response.body.result).toBe(expectedResult);
              } else {
                expect(response.body.result).toBeCloseTo(expectedResult, 1);
              }
            });
        });
      });
    });

    describe('Division by zero test cases', () => {
      const testCases = CalculatorTestDataFactory.getDivisionByZeroTestCases();

      testCases.forEach(({ a, b, expectedError, description }) => {
        it(`should return error for ${description}`, () => {
          return request(app.getHttpServer())
            .get(`/calculator/divide?a=${a}&b=${b}`)
            .expect(400)
            .then((response) => {
              expect(response.body.message).toContain(expectedError);
            });
        });
      });
    });
  });

  describe('Edge cases and stress tests', () => {
    it('should handle very large numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=999999999&b=1')
        .expect(200)
        .then((response) => {
          expect(response.body.result).toBe(1000000000);
        });
    });

    it('should handle very small decimal numbers', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=0.000001&b=0.000002')
        .expect(200)
        .then((response) => {
          expect(response.body.result).toBeCloseTo(0.000003, 6);
        });
    });

    it('should handle negative zero', () => {
      return request(app.getHttpServer())
        .get('/calculator/add?a=-0&b=0')
        .expect(200)
        .then((response) => {
          expect(response.body.result).toBe(0);
        });
    });
  });
});

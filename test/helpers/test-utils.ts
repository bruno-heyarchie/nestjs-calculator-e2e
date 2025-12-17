import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

/**
 * Creates a testing module with the provided imports, controllers, and providers
 */
export async function createTestingModule(metadata: {
  imports?: any[];
  controllers?: any[];
  providers?: any[];
}): Promise<TestingModule> {
  const moduleFixture = await Test.createTestingModule({
    imports: metadata.imports || [],
    controllers: metadata.controllers || [],
    providers: metadata.providers || [],
  }).compile();

  return moduleFixture;
}

/**
 * Creates and initializes a NestJS application for E2E testing
 */
export async function createTestApp(
  module: TestingModule,
): Promise<INestApplication<App>> {
  const app = module.createNestApplication();
  await app.init();
  return app;
}

/**
 * Closes the NestJS application after tests
 */
export async function closeTestApp(
  app: INestApplication<App>,
): Promise<void> {
  if (app) {
    await app.close();
  }
}

/**
 * Generates a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max
 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

/**
 * Generates an array of test cases for parametrized testing
 */
export function generateTestCases<T>(cases: T[]): T[] {
  return cases;
}

/**
 * Waits for a specified amount of time (useful for async operations)
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Asserts that a value is close to an expected value (for floating point comparisons)
 */
export function expectToBeCloseTo(
  actual: number,
  expected: number,
  precision = 2,
): void {
  expect(actual).toBeCloseTo(expected, precision);
}

/**
 * Creates a spy on a method and returns it
 */
export function createSpy<T>(
  object: T,
  method: keyof T,
): jest.SpyInstance {
  return jest.spyOn(object as any, method as string);
}

/**
 * Asserts that a function throws an error with a specific message
 */
export function expectToThrowWithMessage(
  fn: () => void,
  errorClass: any,
  message?: string,
): void {
  expect(fn).toThrow(errorClass);
  if (message) {
    expect(fn).toThrow(message);
  }
}

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
export async function closeTestApp(app: INestApplication<App>): Promise<void> {
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
export function createSpy<T>(object: T, method: keyof T): jest.SpyInstance {
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

/**
 * Asserts that an async function throws an error
 */
export async function expectAsyncToThrow(
  fn: () => Promise<any>,
  errorClass?: any,
): Promise<void> {
  await expect(fn()).rejects.toThrow(errorClass);
}

/**
 * Asserts that an async function throws an error with a specific message
 */
export async function expectAsyncToThrowWithMessage(
  fn: () => Promise<any>,
  errorClass: any,
  message?: string,
): Promise<void> {
  await expect(fn()).rejects.toThrow(errorClass);
  if (message) {
    await expect(fn()).rejects.toThrow(message);
  }
}

/**
 * Generates an array of random numbers
 */
export function generateRandomNumbers(
  count: number,
  min = 0,
  max = 100,
): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(Math.random() * (max - min) + min);
  }
  return numbers;
}

/**
 * Generates an array of random integers
 */
export function generateRandomIntegers(
  count: number,
  min = 0,
  max = 100,
): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return numbers;
}

/**
 * Rounds a number to a specific number of decimal places
 */
export function roundToDecimals(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

/**
 * Checks if two numbers are approximately equal within a tolerance
 */
export function approximatelyEqual(
  actual: number,
  expected: number,
  tolerance = 0.01,
): boolean {
  return Math.abs(actual - expected) < tolerance;
}

/**
 * Creates a deep clone of an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Waits for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 100,
): Promise<void> {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await sleep(interval);
  }
}

/**
 * Executes a function multiple times and returns results
 */
export function repeatExecution<T>(fn: () => T, times: number): T[] {
  const results: T[] = [];
  for (let i = 0; i < times; i++) {
    results.push(fn());
  }
  return results;
}

/**
 * Executes an async function multiple times and returns results
 */
export async function repeatAsyncExecution<T>(
  fn: () => Promise<T>,
  times: number,
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < times; i++) {
    results.push(await fn());
  }
  return results;
}

/**
 * Measures execution time of a function
 */
export function measureExecutionTime(fn: () => void): number {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  return endTime - startTime;
}

/**
 * Measures execution time of an async function
 */
export async function measureAsyncExecutionTime(
  fn: () => Promise<void>,
): Promise<number> {
  const startTime = performance.now();
  await fn();
  const endTime = performance.now();
  return endTime - startTime;
}

/**
 * Creates a mock function that returns different values on successive calls
 */
export function createSequentialMock<T>(values: T[]): jest.Mock {
  const mock = jest.fn();
  values.forEach((value) => {
    mock.mockReturnValueOnce(value);
  });
  return mock;
}

/**
 * Resets all mocks in an object
 */
export function resetAllMocks(mocks: { [key: string]: jest.Mock }): void {
  Object.values(mocks).forEach((mock) => {
    if (mock && typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
}

/**
 * Asserts that a mock was called with specific arguments
 */
export function expectCalledWithArgs(mock: jest.Mock, ...args: any[]): void {
  expect(mock).toHaveBeenCalledWith(...args);
}

/**
 * Asserts that a mock was called exactly n times
 */
export function expectCalledTimes(mock: jest.Mock, times: number): void {
  expect(mock).toHaveBeenCalledTimes(times);
}

/**
 * Creates a promise that resolves after a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Batches test cases for parametrized testing
 */
export function batchTestCases<T>(cases: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < cases.length; i += batchSize) {
    batches.push(cases.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Checks if a value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Formats a number for consistent test output
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

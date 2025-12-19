/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import {
  IValidationResult,
  IValidationOptions,
  IValidationService,
} from './validation.interface';
import { InvalidOperandError } from '../exceptions';

/**
 * Service for validating calculator inputs
 * Provides comprehensive validation for numbers, ranges, and edge cases
 * Note: This service intentionally uses 'any' types to validate unknown values
 */
@Injectable()
export class ValidationService implements IValidationService {
  private readonly logger = new Logger(ValidationService.name);

  // Mathematical limits
  private readonly MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  private readonly MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

  /**
   * Validates that a value is not null or undefined
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isNotNullOrUndefined(value: any, paramName: string): IValidationResult {
    if (value === null) {
      this.logger.warn(`Validation failed: ${paramName} is null`);
      return {
        isValid: false,
        error: `${paramName} must not be null`,
      };
    }

    if (value === undefined) {
      this.logger.warn(`Validation failed: ${paramName} is undefined`);
      return {
        isValid: false,
        error: `${paramName} must not be undefined`,
      };
    }

    return { isValid: true, value };
  }

  /**
   * Validates that a value is not NaN
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isNotNaN(value: any, paramName: string): IValidationResult {
    // First check if it's null or undefined
    const nullCheck = this.isNotNullOrUndefined(value, paramName);
    if (!nullCheck.isValid) {
      return nullCheck;
    }

    if (Number.isNaN(value)) {
      this.logger.warn(`Validation failed: ${paramName} is NaN`);
      return {
        isValid: false,
        error: `${paramName} must not be NaN`,
        value,
      };
    }

    return { isValid: true, value };
  }

  /**
   * Validates that a value is finite (not Infinity or -Infinity)
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isFinite(value: number, paramName: string): IValidationResult {
    if (!Number.isFinite(value)) {
      this.logger.warn(
        `Validation failed: ${paramName} is not finite (value: ${value})`,
      );
      return {
        isValid: false,
        error: `${paramName} must be a finite number`,
        value,
      };
    }

    return { isValid: true, value };
  }

  /**
   * Validates that a value is an integer
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isInteger(value: number, paramName: string): IValidationResult {
    if (!Number.isInteger(value)) {
      this.logger.warn(
        `Validation failed: ${paramName} is not an integer (value: ${value})`,
      );
      return {
        isValid: false,
        error: `${paramName} must be an integer`,
        value,
      };
    }

    return { isValid: true, value };
  }

  /**
   * Validates that a value is within a specified range
   * @param value - The value to validate
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isInRange(
    value: number,
    min: number,
    max: number,
    paramName: string,
  ): IValidationResult {
    if (value < min || value > max) {
      this.logger.warn(
        `Validation failed: ${paramName} is out of range (value: ${value}, range: [${min}, ${max}])`,
      );
      return {
        isValid: false,
        error: `${paramName} must be between ${min} and ${max}`,
        value,
      };
    }

    return { isValid: true, value };
  }

  /**
   * Validates that a value is a valid number
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  validateNumber(value: any, paramName: string): IValidationResult {
    // Check if null or undefined
    const nullCheck = this.isNotNullOrUndefined(value, paramName);
    if (!nullCheck.isValid) {
      return nullCheck;
    }

    // Check if it's actually a number type
    if (typeof value !== 'number') {
      this.logger.warn(
        `Validation failed: ${paramName} is not a number (type: ${typeof value})`,
      );
      return {
        isValid: false,
        error: `${paramName} must be a number`,
        value,
      };
    }

    // Check if it's NaN
    const nanCheck = this.isNotNaN(value, paramName);
    if (!nanCheck.isValid) {
      return nanCheck;
    }

    // Check if it's finite
    const finiteCheck = this.isFinite(value, paramName);
    if (!finiteCheck.isValid) {
      return finiteCheck;
    }

    return { isValid: true, value };
  }

  /**
   * Validates a number with custom options
   * @param value - The value to validate
   * @param options - Validation options
   * @returns Validation result
   */
  validateWithOptions(
    value: any,
    options: IValidationOptions = {},
  ): IValidationResult {
    const paramName = options.parameterName || 'Value';

    // Basic number validation
    const basicValidation = this.validateNumber(value, paramName);

    // If basic validation fails and we're not allowing infinity, return the error
    if (!basicValidation.isValid) {
      // Special case: if the value is Infinity and we allow it
      if (
        options.allowInfinity &&
        (value === Infinity || value === -Infinity)
      ) {
        this.logger.debug(
          `Allowing infinity value for ${paramName} (value: ${value})`,
        );
        return { isValid: true, value };
      }
      return basicValidation;
    }

    // Check for negative values if not allowed
    if (options.allowNegative === false && value < 0) {
      this.logger.warn(
        `Validation failed: ${paramName} is negative (value: ${value})`,
      );
      return {
        isValid: false,
        error: `${paramName} must not be negative`,
        value,
      };
    }

    // Check if integer is required
    if (options.requireInteger) {
      const intCheck = this.isInteger(value, paramName);
      if (!intCheck.isValid) {
        return intCheck;
      }
    }

    // Check range if specified
    if (options.min !== undefined || options.max !== undefined) {
      const min = options.min ?? this.MIN_SAFE_INTEGER;
      const max = options.max ?? this.MAX_SAFE_INTEGER;
      const rangeCheck = this.isInRange(value, min, max, paramName);
      if (!rangeCheck.isValid) {
        return rangeCheck;
      }
    }

    return { isValid: true, value };
  }

  /**
   * Validates multiple values at once
   * @param values - Array of values to validate
   * @param paramNames - Array of parameter names
   * @returns Array of validation results
   */
  validateMultiple(values: any[], paramNames: string[]): IValidationResult[] {
    if (values.length !== paramNames.length) {
      this.logger.error(
        'validateMultiple: values and paramNames arrays must have the same length',
      );
      throw new Error(
        'Values and parameter names arrays must have the same length',
      );
    }

    return values.map((value, index) =>
      this.validateNumber(value, paramNames[index]),
    );
  }

  /**
   * Validates and throws an error if validation fails
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @throws InvalidOperandError if validation fails
   */
  validateOrThrow(value: any, paramName: string): void {
    const result = this.validateNumber(value, paramName);
    if (!result.isValid) {
      throw new InvalidOperandError(paramName, result.error || 'Invalid value');
    }
  }

  /**
   * Validates operands (two values) and throws if either is invalid
   * @param a - First operand
   * @param b - Second operand
   * @throws InvalidOperandError if validation fails
   */
  validateOperandsOrThrow(a: any, b: any): void {
    this.validateOrThrow(a, 'First operand');
    this.validateOrThrow(b, 'Second operand');
  }

  /**
   * Validates a single operand and throws if invalid
   * @param value - The value to validate
   * @throws InvalidOperandError if validation fails
   */
  validateSingleOperandOrThrow(value: any): void {
    this.validateOrThrow(value, 'Operand');
  }

  /**
   * Converts a string representation to a number with validation
   * Handles various number formats and edge cases
   * @param value - The value to convert
   * @param paramName - The parameter name for error messages
   * @returns Validation result with converted number
   */
  parseNumber(value: any, paramName: string): IValidationResult {
    // If already a number, validate it
    if (typeof value === 'number') {
      return this.validateNumber(value, paramName);
    }

    // If it's a string, try to parse it
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // Handle empty strings
      if (trimmed === '') {
        this.logger.warn(`Validation failed: ${paramName} is an empty string`);
        return {
          isValid: false,
          error: `${paramName} cannot be an empty string`,
          value,
        };
      }

      // Try to parse the string
      const parsed = Number(trimmed);

      // Validate the parsed number
      return this.validateNumber(parsed, paramName);
    }

    // For other types, try to coerce to number
    this.logger.warn(
      `Attempting to parse ${paramName} from type ${typeof value}`,
    );
    const coerced = Number(value);
    return this.validateNumber(coerced, paramName);
  }

  /**
   * Validates that a result is within safe integer range
   * @param result - The result to validate
   * @param operation - The operation name for logging
   * @returns Validation result
   */
  validateResultRange(result: number, operation: string): IValidationResult {
    if (!Number.isFinite(result)) {
      this.logger.error(
        `${operation} operation resulted in non-finite value: ${result}`,
      );
      return {
        isValid: false,
        error:
          result === Infinity
            ? 'Result is positive infinity'
            : result === -Infinity
              ? 'Result is negative infinity'
              : 'Result is not a number',
        value: result,
      };
    }

    if (result > this.MAX_SAFE_INTEGER) {
      this.logger.error(
        `${operation} operation resulted in overflow: ${result} > ${this.MAX_SAFE_INTEGER}`,
      );
      return {
        isValid: false,
        error: `Result ${result} exceeds maximum safe integer ${this.MAX_SAFE_INTEGER}`,
        value: result,
      };
    }

    if (result < this.MIN_SAFE_INTEGER) {
      this.logger.error(
        `${operation} operation resulted in underflow: ${result} < ${this.MIN_SAFE_INTEGER}`,
      );
      return {
        isValid: false,
        error: `Result ${result} is below minimum safe integer ${this.MIN_SAFE_INTEGER}`,
        value: result,
      };
    }

    return { isValid: true, value: result };
  }
}

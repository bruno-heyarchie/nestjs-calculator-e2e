/**
 * Validation result interface for comprehensive validation feedback
 */
export interface IValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;

  /**
   * Error message if validation failed
   */
  error?: string;

  /**
   * The value that was validated
   */
  value?: number;
}

/**
 * Validation error details
 */
export interface IValidationError {
  /**
   * The parameter name that failed validation
   */
  parameterName: string;

  /**
   * The value that failed validation
   */
  value: any;

  /**
   * Description of the validation failure
   */
  reason: string;

  /**
   * Type of validation error
   */
  type: ValidationErrorType;
}

/**
 * Types of validation errors
 */
export enum ValidationErrorType {
  NOT_A_NUMBER = 'NOT_A_NUMBER',
  NAN_VALUE = 'NAN_VALUE',
  INFINITE_VALUE = 'INFINITE_VALUE',
  NULL_VALUE = 'NULL_VALUE',
  UNDEFINED_VALUE = 'UNDEFINED_VALUE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  NEGATIVE_VALUE = 'NEGATIVE_VALUE',
  NOT_INTEGER = 'NOT_INTEGER',
}

/**
 * Validation options for customizing validation behavior
 */
export interface IValidationOptions {
  /**
   * Allow infinity values (default: false)
   */
  allowInfinity?: boolean;

  /**
   * Allow negative values (default: true)
   */
  allowNegative?: boolean;

  /**
   * Require integer values (default: false)
   */
  requireInteger?: boolean;

  /**
   * Minimum allowed value
   */
  min?: number;

  /**
   * Maximum allowed value
   */
  max?: number;

  /**
   * Custom parameter name for error messages
   */
  parameterName?: string;
}

/**
 * Interface for validation service methods
 */
export interface IValidationService {
  /**
   * Validates that a value is a valid number
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  validateNumber(value: any, paramName: string): IValidationResult;

  /**
   * Validates that a value is finite (not Infinity or -Infinity)
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isFinite(value: number, paramName: string): IValidationResult;

  /**
   * Validates that a value is not NaN
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isNotNaN(value: any, paramName: string): IValidationResult;

  /**
   * Validates that a value is not null or undefined
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isNotNullOrUndefined(value: any, paramName: string): IValidationResult;

  /**
   * Validates a number with custom options
   * @param value - The value to validate
   * @param options - Validation options
   * @returns Validation result
   */
  validateWithOptions(
    value: any,
    options: IValidationOptions,
  ): IValidationResult;

  /**
   * Validates multiple values at once
   * @param values - Array of values to validate
   * @param paramNames - Array of parameter names
   * @returns Array of validation results
   */
  validateMultiple(values: any[], paramNames: string[]): IValidationResult[];

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
  ): IValidationResult;

  /**
   * Validates that a value is an integer
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @returns Validation result
   */
  isInteger(value: number, paramName: string): IValidationResult;

  /**
   * Validates and throws an error if validation fails
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @throws InvalidOperandError if validation fails
   */
  validateOrThrow(value: any, paramName: string): void;

  /**
   * Validates operands (two values) and throws if either is invalid
   * @param a - First operand
   * @param b - Second operand
   * @throws InvalidOperandError if validation fails
   */
  validateOperandsOrThrow(a: any, b: any): void;
}

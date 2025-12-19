import { HttpException, HttpStatus } from '@nestjs/common';
import { CalculatorErrorCode, ErrorCodeDescriptions } from './error-codes.enum';

/**
 * Structured error response interface
 */
export interface ErrorResponse {
  statusCode: number;
  errorCode: CalculatorErrorCode;
  message: string;
  description: string;
  operation?: string;
  details?: string;
  timestamp: string;
  error: string;
}

/**
 * Base class for all calculator exceptions
 * Provides structured error information with error codes and descriptions
 */
export class CalculatorException extends HttpException {
  constructor(
    errorCode: CalculatorErrorCode,
    message: string,
    operation?: string,
    details?: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const errorResponse: ErrorResponse = {
      statusCode,
      errorCode,
      message,
      description: ErrorCodeDescriptions[errorCode],
      operation,
      details,
      timestamp: new Date().toISOString(),
      error: 'Calculator Error',
    };

    super(errorResponse, statusCode);
  }
}

/**
 * Exception thrown when attempting to divide by zero
 */
export class DivisionByZeroException extends CalculatorException {
  constructor(numerator?: number) {
    const details = numerator !== undefined ? `${numerator} / 0` : undefined;
    super(
      CalculatorErrorCode.DIVISION_BY_ZERO,
      'Division by zero is not allowed',
      'division',
      details,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when attempting to take modulo by zero
 */
export class ModuloByZeroException extends CalculatorException {
  constructor(dividend?: number) {
    const details = dividend !== undefined ? `${dividend} % 0` : undefined;
    super(
      CalculatorErrorCode.MODULO_BY_ZERO,
      'Modulo by zero is not allowed',
      'modulo',
      details,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when a mathematical operation results in overflow
 */
export class OverflowException extends CalculatorException {
  constructor(operation: string, details?: string) {
    super(
      CalculatorErrorCode.OVERFLOW_ERROR,
      `Operation resulted in overflow`,
      operation,
      details,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when a mathematical operation results in underflow
 */
export class UnderflowException extends CalculatorException {
  constructor(operation: string, details?: string) {
    super(
      CalculatorErrorCode.UNDERFLOW_ERROR,
      `Operation resulted in underflow`,
      operation,
      details,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when an operation produces an invalid result
 */
export class InvalidResultException extends CalculatorException {
  constructor(operation: string, reason: string) {
    super(
      CalculatorErrorCode.INVALID_RESULT,
      `Invalid result: ${reason}`,
      operation,
      reason,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when attempting an invalid mathematical operation
 */
export class InvalidOperationException extends CalculatorException {
  constructor(
    operation: string,
    reason: string,
    errorCode?: CalculatorErrorCode,
  ) {
    super(
      errorCode || CalculatorErrorCode.INVALID_OPERATION,
      reason,
      operation,
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when operand validation fails
 */
export class InvalidOperandException extends CalculatorException {
  constructor(
    operandName: string,
    reason: string,
    errorCode?: CalculatorErrorCode,
  ) {
    super(
      errorCode || CalculatorErrorCode.INVALID_OPERAND,
      `${operandName}: ${reason}`,
      'validation',
      `${operandName} - ${reason}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown for general validation errors
 */
export class ValidationException extends CalculatorException {
  constructor(message: string, details?: string) {
    super(
      CalculatorErrorCode.VALIDATION_ERROR,
      message,
      'validation',
      details,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown for unexpected system errors
 */
export class UnexpectedException extends CalculatorException {
  constructor(message: string, details?: string) {
    super(
      CalculatorErrorCode.UNEXPECTED_ERROR,
      message,
      'system',
      details,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

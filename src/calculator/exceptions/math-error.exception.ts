import { BadRequestException } from '@nestjs/common';
import { CalculatorErrorCode } from './error-codes.enum';

/**
 * Base class for all mathematical operation errors
 * Provides structured error information with operation context
 * @deprecated Use CalculatorException from calculator-exceptions.ts instead
 */
export class MathematicalError extends BadRequestException {
  constructor(
    operation: string,
    reason: string,
    errorCode?: CalculatorErrorCode,
  ) {
    super({
      message: `Mathematical error in ${operation}: ${reason}`,
      operation,
      reason,
      errorCode: errorCode || CalculatorErrorCode.UNEXPECTED_ERROR,
      timestamp: new Date().toISOString(),
      statusCode: 400,
      error: 'Mathematical Error',
    });
  }
}

/**
 * Error thrown when attempting to divide by zero
 * @deprecated Use DivisionByZeroException from calculator-exceptions.ts instead
 */
export class DivisionByZeroError extends MathematicalError {
  constructor() {
    super(
      'division',
      'Division by zero is not allowed',
      CalculatorErrorCode.DIVISION_BY_ZERO,
    );
  }
}

/**
 * Error thrown when attempting to take modulo by zero
 * @deprecated Use ModuloByZeroException from calculator-exceptions.ts instead
 */
export class ModuloByZeroError extends MathematicalError {
  constructor() {
    super(
      'modulo',
      'Modulo by zero is not allowed',
      CalculatorErrorCode.MODULO_BY_ZERO,
    );
  }
}

/**
 * Error thrown when a mathematical operation results in overflow
 * @deprecated Use OverflowException from calculator-exceptions.ts instead
 */
export class OverflowError extends MathematicalError {
  constructor(operation: string, details?: string) {
    const reason = details
      ? `Operation resulted in overflow: ${details}`
      : 'Operation resulted in overflow (exceeds maximum safe integer)';
    super(operation, reason, CalculatorErrorCode.OVERFLOW_ERROR);
  }
}

/**
 * Error thrown when a mathematical operation results in underflow
 * @deprecated Use UnderflowException from calculator-exceptions.ts instead
 */
export class UnderflowError extends MathematicalError {
  constructor(operation: string, details?: string) {
    const reason = details
      ? `Operation resulted in underflow: ${details}`
      : 'Operation resulted in underflow (below minimum safe integer)';
    super(operation, reason, CalculatorErrorCode.UNDERFLOW_ERROR);
  }
}

/**
 * Error thrown when an operation produces an invalid result (NaN or Infinity)
 * @deprecated Use InvalidResultException from calculator-exceptions.ts instead
 */
export class InvalidResultError extends MathematicalError {
  constructor(operation: string, reason: string) {
    super(
      operation,
      `Invalid result: ${reason}`,
      CalculatorErrorCode.INVALID_RESULT,
    );
  }
}

/**
 * Error thrown when attempting an invalid mathematical operation
 * @deprecated Use InvalidOperationException from calculator-exceptions.ts instead
 */
export class InvalidOperationError extends MathematicalError {
  constructor(operation: string, reason: string) {
    super(operation, reason, CalculatorErrorCode.INVALID_OPERATION);
  }
}

/**
 * Error thrown when operand validation fails
 * @deprecated Use InvalidOperandException from calculator-exceptions.ts instead
 */
export class InvalidOperandError extends MathematicalError {
  constructor(operandName: string, reason: string) {
    super(
      'validation',
      `${operandName}: ${reason}`,
      CalculatorErrorCode.INVALID_OPERAND,
    );
  }
}

import { BadRequestException } from '@nestjs/common';

/**
 * Base class for all mathematical operation errors
 * Provides structured error information with operation context
 */
export class MathematicalError extends BadRequestException {
  constructor(operation: string, reason: string) {
    super({
      message: `Mathematical error in ${operation}: ${reason}`,
      operation,
      reason,
      timestamp: new Date().toISOString(),
      statusCode: 400,
      error: 'Mathematical Error',
    });
  }
}

/**
 * Error thrown when attempting to divide by zero
 */
export class DivisionByZeroError extends MathematicalError {
  constructor() {
    super('division', 'Division by zero is not allowed');
  }
}

/**
 * Error thrown when attempting to take modulo by zero
 */
export class ModuloByZeroError extends MathematicalError {
  constructor() {
    super('modulo', 'Modulo by zero is not allowed');
  }
}

/**
 * Error thrown when a mathematical operation results in overflow
 */
export class OverflowError extends MathematicalError {
  constructor(operation: string, details?: string) {
    const reason = details
      ? `Operation resulted in overflow: ${details}`
      : 'Operation resulted in overflow (exceeds maximum safe integer)';
    super(operation, reason);
  }
}

/**
 * Error thrown when a mathematical operation results in underflow
 */
export class UnderflowError extends MathematicalError {
  constructor(operation: string, details?: string) {
    const reason = details
      ? `Operation resulted in underflow: ${details}`
      : 'Operation resulted in underflow (below minimum safe integer)';
    super(operation, reason);
  }
}

/**
 * Error thrown when an operation produces an invalid result (NaN or Infinity)
 */
export class InvalidResultError extends MathematicalError {
  constructor(operation: string, reason: string) {
    super(operation, `Invalid result: ${reason}`);
  }
}

/**
 * Error thrown when attempting an invalid mathematical operation
 */
export class InvalidOperationError extends MathematicalError {
  constructor(operation: string, reason: string) {
    super(operation, reason);
  }
}

/**
 * Error thrown when operand validation fails
 */
export class InvalidOperandError extends MathematicalError {
  constructor(operandName: string, reason: string) {
    super('validation', `${operandName}: ${reason}`);
  }
}

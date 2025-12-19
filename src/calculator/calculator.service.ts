import { Injectable, Logger } from '@nestjs/common';
import {
  DivisionByZeroError,
  ModuloByZeroError,
  OverflowError,
  UnderflowError,
  InvalidResultError,
  InvalidOperationError,
  InvalidOperandError,
} from './exceptions';

@Injectable()
export class CalculatorService {
  private readonly logger = new Logger(CalculatorService.name);

  // Mathematical operation limits
  private readonly MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  private readonly MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
  private readonly MAX_FACTORIAL_INPUT = 170;

  /**
   * Validates that a number is finite and not NaN
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @throws InvalidOperandError if the value is not valid
   */
  private validateNumber(value: number, paramName: string): void {
    if (typeof value !== 'number') {
      this.logger.warn(
        `Validation failed: ${paramName} is not a number (type: ${typeof value})`,
      );
      throw new InvalidOperandError(paramName, 'must be a number');
    }

    if (Number.isNaN(value)) {
      this.logger.warn(`Validation failed: ${paramName} is NaN`);
      throw new InvalidOperandError(paramName, 'must not be NaN');
    }

    if (!Number.isFinite(value)) {
      this.logger.warn(`Validation failed: ${paramName} is not finite`);
      throw new InvalidOperandError(paramName, 'must be a finite number');
    }
  }

  /**
   * Validates that the operands are valid numbers
   * @param a - First operand
   * @param b - Second operand
   */
  private validateOperands(a: number, b: number): void {
    this.validateNumber(a, 'First operand');
    this.validateNumber(b, 'Second operand');
  }

  /**
   * Checks if a number is outside the safe integer range
   * @param value - The value to check
   * @returns true if the value is outside safe range
   */
  private isOutsideSafeRange(value: number): boolean {
    return value > this.MAX_SAFE_INTEGER || value < this.MIN_SAFE_INTEGER;
  }

  /**
   * Validates that a result is within safe integer range
   * @param result - The result to validate
   * @param operation - The operation name for error messages
   * @throws OverflowError or UnderflowError if outside safe range
   */
  private validateResultRange(result: number, operation: string): void {
    if (!Number.isFinite(result)) {
      this.logger.error(
        `${operation} operation resulted in non-finite value: ${result}`,
      );
      throw new InvalidResultError(
        operation,
        result === Infinity
          ? 'Result is positive infinity'
          : result === -Infinity
            ? 'Result is negative infinity'
            : 'Result is not a number',
      );
    }

    if (result > this.MAX_SAFE_INTEGER) {
      this.logger.error(
        `${operation} operation resulted in overflow: ${result} > ${this.MAX_SAFE_INTEGER}`,
      );
      throw new OverflowError(
        operation,
        `Result ${result} exceeds maximum safe integer ${this.MAX_SAFE_INTEGER}`,
      );
    }

    if (result < this.MIN_SAFE_INTEGER) {
      this.logger.error(
        `${operation} operation resulted in underflow: ${result} < ${this.MIN_SAFE_INTEGER}`,
      );
      throw new UnderflowError(
        operation,
        `Result ${result} is below minimum safe integer ${this.MIN_SAFE_INTEGER}`,
      );
    }
  }

  /**
   * Adds two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The sum of a and b
   * @throws InvalidOperandError if operands are invalid
   * @throws OverflowError if result exceeds safe range
   */
  add(a: number, b: number): number {
    this.validateOperands(a, b);
    const result = a + b;
    this.validateResultRange(result, 'addition');
    this.logger.debug(`Addition: ${a} + ${b} = ${result}`);
    return result;
  }

  /**
   * Subtracts the second number from the first
   * @param a - First number
   * @param b - Second number
   * @returns The difference of a and b
   * @throws InvalidOperandError if operands are invalid
   * @throws UnderflowError if result is below safe range
   */
  subtract(a: number, b: number): number {
    this.validateOperands(a, b);
    const result = a - b;
    this.validateResultRange(result, 'subtraction');
    this.logger.debug(`Subtraction: ${a} - ${b} = ${result}`);
    return result;
  }

  /**
   * Multiplies two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The product of a and b
   * @throws InvalidOperandError if operands are invalid
   * @throws OverflowError or UnderflowError if result exceeds safe range
   */
  multiply(a: number, b: number): number {
    this.validateOperands(a, b);
    const result = a * b;
    this.validateResultRange(result, 'multiplication');
    this.logger.debug(`Multiplication: ${a} * ${b} = ${result}`);
    return result;
  }

  /**
   * Divides the first number by the second
   * @param a - First number (numerator)
   * @param b - Second number (denominator)
   * @returns The quotient of a and b
   * @throws InvalidOperandError if operands are invalid
   * @throws DivisionByZeroError if denominator is zero
   * @throws InvalidResultError if result is not finite
   */
  divide(a: number, b: number): number {
    this.validateOperands(a, b);

    if (b === 0) {
      this.logger.error(`Division by zero attempted: ${a} / 0`);
      throw new DivisionByZeroError();
    }

    const result = a / b;
    this.validateResultRange(result, 'division');
    this.logger.debug(`Division: ${a} / ${b} = ${result}`);
    return result;
  }

  /**
   * Calculates a raised to the power of b
   * @param a - Base number
   * @param b - Exponent
   * @returns The result of a^b
   * @throws InvalidOperandError if operands are invalid
   * @throws InvalidResultError if result is not finite
   * @throws OverflowError if result exceeds safe range
   */
  power(a: number, b: number): number {
    this.validateOperands(a, b);

    const result = Math.pow(a, b);
    this.validateResultRange(result, 'power');
    this.logger.debug(`Power: ${a} ^ ${b} = ${result}`);
    return result;
  }

  /**
   * Calculates the square root of a number
   * @param a - The number to calculate square root of
   * @returns The square root of a
   * @throws InvalidOperandError if operand is invalid
   * @throws InvalidOperationError if number is negative
   */
  sqrt(a: number): number {
    this.validateNumber(a, 'Operand');

    if (a < 0) {
      this.logger.error(`Square root of negative number attempted: sqrt(${a})`);
      throw new InvalidOperationError(
        'square root',
        'Cannot calculate square root of negative number',
      );
    }

    const result = Math.sqrt(a);
    this.logger.debug(`Square root: sqrt(${a}) = ${result}`);
    return result;
  }

  /**
   * Calculates the factorial of a non-negative integer
   * @param n - The number to calculate factorial of
   * @returns The factorial of n
   * @throws InvalidOperandError if n is invalid or not an integer
   * @throws InvalidOperationError if n is negative or too large
   * @throws OverflowError if result exceeds safe range
   */
  factorial(n: number): number {
    this.validateNumber(n, 'Operand');

    if (n < 0) {
      this.logger.error(
        `Factorial of negative number attempted: factorial(${n})`,
      );
      throw new InvalidOperationError(
        'factorial',
        'Cannot calculate factorial of negative number',
      );
    }

    if (!Number.isInteger(n)) {
      this.logger.error(`Factorial of non-integer attempted: factorial(${n})`);
      throw new InvalidOperandError('Operand', 'must be an integer');
    }

    if (n > this.MAX_FACTORIAL_INPUT) {
      this.logger.error(
        `Factorial input too large: ${n} > ${this.MAX_FACTORIAL_INPUT}`,
      );
      throw new InvalidOperationError(
        'factorial',
        `Input too large (maximum is ${this.MAX_FACTORIAL_INPUT})`,
      );
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
      // Check for overflow during calculation
      if (result === Infinity) {
        this.logger.error(`Factorial overflow at n=${n}, i=${i}`);
        throw new OverflowError('factorial', `Result overflow at step ${i}`);
      }
    }

    this.logger.debug(`Factorial: ${n}! = ${result}`);
    return result;
  }

  /**
   * Calculates the remainder of a divided by b
   * @param a - The dividend
   * @param b - The divisor
   * @returns The remainder of a / b
   * @throws InvalidOperandError if operands are invalid
   * @throws ModuloByZeroError if divisor is zero
   */
  modulo(a: number, b: number): number {
    this.validateOperands(a, b);

    if (b === 0) {
      this.logger.error(`Modulo by zero attempted: ${a} % 0`);
      throw new ModuloByZeroError();
    }

    const result = a % b;
    this.logger.debug(`Modulo: ${a} % ${b} = ${result}`);
    return result;
  }

  /**
   * Calculates the absolute value of a number
   * @param a - The number
   * @returns The absolute value of a
   * @throws InvalidOperandError if operand is invalid
   */
  absolute(a: number): number {
    this.validateNumber(a, 'Operand');
    const result = Math.abs(a);
    this.logger.debug(`Absolute: |${a}| = ${result}`);
    return result;
  }

  /**
   * Rounds a number up to the nearest integer
   * @param a - The number to round
   * @returns The smallest integer greater than or equal to a
   * @throws InvalidOperandError if operand is invalid
   */
  ceiling(a: number): number {
    this.validateNumber(a, 'Operand');
    const result = Math.ceil(a);
    this.logger.debug(`Ceiling: ceil(${a}) = ${result}`);
    return result;
  }

  /**
   * Rounds a number down to the nearest integer
   * @param a - The number to round
   * @returns The largest integer less than or equal to a
   * @throws InvalidOperandError if operand is invalid
   */
  floor(a: number): number {
    this.validateNumber(a, 'Operand');
    const result = Math.floor(a);
    this.logger.debug(`Floor: floor(${a}) = ${result}`);
    return result;
  }

  /**
   * Rounds a number to the nearest integer
   * @param a - The number to round
   * @returns The nearest integer to a
   * @throws InvalidOperandError if operand is invalid
   */
  round(a: number): number {
    this.validateNumber(a, 'Operand');
    const result = Math.round(a);
    this.logger.debug(`Round: round(${a}) = ${result}`);
    return result;
  }
}

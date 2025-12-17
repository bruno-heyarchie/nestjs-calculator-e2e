import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  /**
   * Validates that a number is finite and not NaN
   * @param value - The value to validate
   * @param paramName - The parameter name for error messages
   * @throws BadRequestException if the value is not valid
   */
  private validateNumber(value: number, paramName: string): void {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${paramName} must be a valid finite number`,
      );
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
   * Adds two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The sum of a and b
   * @throws BadRequestException if operands are invalid
   */
  add(a: number, b: number): number {
    this.validateOperands(a, b);
    return a + b;
  }

  /**
   * Subtracts the second number from the first
   * @param a - First number
   * @param b - Second number
   * @returns The difference of a and b
   * @throws BadRequestException if operands are invalid
   */
  subtract(a: number, b: number): number {
    this.validateOperands(a, b);
    return a - b;
  }

  /**
   * Multiplies two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The product of a and b
   * @throws BadRequestException if operands are invalid
   */
  multiply(a: number, b: number): number {
    this.validateOperands(a, b);
    return a * b;
  }

  /**
   * Divides the first number by the second
   * @param a - First number (numerator)
   * @param b - Second number (denominator)
   * @returns The quotient of a and b
   * @throws BadRequestException if operands are invalid or division by zero
   */
  divide(a: number, b: number): number {
    this.validateOperands(a, b);

    if (b === 0) {
      throw new BadRequestException('Division by zero is not allowed');
    }

    return a / b;
  }

  /**
   * Calculates a raised to the power of b
   * @param a - Base number
   * @param b - Exponent
   * @returns The result of a^b
   * @throws BadRequestException if operands are invalid or result is not finite
   */
  power(a: number, b: number): number {
    this.validateOperands(a, b);

    const result = Math.pow(a, b);

    if (!Number.isFinite(result)) {
      throw new BadRequestException(
        'Power operation resulted in non-finite number',
      );
    }

    return result;
  }

  /**
   * Calculates the square root of a number
   * @param a - The number to calculate square root of
   * @returns The square root of a
   * @throws BadRequestException if operand is invalid or negative
   */
  sqrt(a: number): number {
    this.validateNumber(a, 'Operand');

    if (a < 0) {
      throw new BadRequestException(
        'Cannot calculate square root of negative number',
      );
    }

    return Math.sqrt(a);
  }

  /**
   * Calculates the factorial of a non-negative integer
   * @param n - The number to calculate factorial of
   * @returns The factorial of n
   * @throws BadRequestException if n is invalid, negative, or not an integer
   */
  factorial(n: number): number {
    this.validateNumber(n, 'Operand');

    if (n < 0) {
      throw new BadRequestException(
        'Cannot calculate factorial of negative number',
      );
    }

    if (!Number.isInteger(n)) {
      throw new BadRequestException('Factorial requires an integer input');
    }

    if (n > 170) {
      throw new BadRequestException(
        'Factorial input too large (maximum is 170)',
      );
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }

    return result;
  }

  /**
   * Calculates the remainder of a divided by b
   * @param a - The dividend
   * @param b - The divisor
   * @returns The remainder of a / b
   * @throws BadRequestException if operands are invalid or b is zero
   */
  modulo(a: number, b: number): number {
    this.validateOperands(a, b);

    if (b === 0) {
      throw new BadRequestException('Modulo by zero is not allowed');
    }

    return a % b;
  }

  /**
   * Calculates the absolute value of a number
   * @param a - The number
   * @returns The absolute value of a
   * @throws BadRequestException if operand is invalid
   */
  absolute(a: number): number {
    this.validateNumber(a, 'Operand');
    return Math.abs(a);
  }

  /**
   * Rounds a number up to the nearest integer
   * @param a - The number to round
   * @returns The smallest integer greater than or equal to a
   * @throws BadRequestException if operand is invalid
   */
  ceiling(a: number): number {
    this.validateNumber(a, 'Operand');
    return Math.ceil(a);
  }

  /**
   * Rounds a number down to the nearest integer
   * @param a - The number to round
   * @returns The largest integer less than or equal to a
   * @throws BadRequestException if operand is invalid
   */
  floor(a: number): number {
    this.validateNumber(a, 'Operand');
    return Math.floor(a);
  }

  /**
   * Rounds a number to the nearest integer
   * @param a - The number to round
   * @returns The nearest integer to a
   * @throws BadRequestException if operand is invalid
   */
  round(a: number): number {
    this.validateNumber(a, 'Operand');
    return Math.round(a);
  }
}

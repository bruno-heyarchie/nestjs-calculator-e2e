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
}

import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for calculator operations
 * Ensures consistent API response structure
 */
export class CalculatorResponseDto {
  /**
   * The result of the calculation
   */
  @ApiProperty({
    description:
      'The computed result of the arithmetic operation. Returns a numeric value that may be an integer or floating-point number.',
    example: 15,
    type: Number,
    examples: {
      addition: {
        value: 15,
        summary: 'Addition result',
        description: 'Result of adding 10 + 5',
      },
      subtraction: {
        value: 5,
        summary: 'Subtraction result',
        description: 'Result of subtracting 10 - 5',
      },
      multiplication: {
        value: 50,
        summary: 'Multiplication result',
        description: 'Result of multiplying 10 × 5',
      },
      division: {
        value: 2,
        summary: 'Division result',
        description: 'Result of dividing 10 ÷ 5',
      },
      decimalResult: {
        value: 3.333333333333333,
        summary: 'Decimal result',
        description: 'Result of dividing 10 ÷ 3 (repeating decimal)',
      },
      negativeResult: {
        value: -5,
        summary: 'Negative result',
        description: 'Result when the calculation yields a negative number',
      },
    },
  })
  result!: number;

  /**
   * The operation performed
   */
  @ApiProperty({
    description:
      'The type of arithmetic operation that was performed on the operands. Indicates which mathematical operation was executed.',
    example: 'addition',
    enum: ['addition', 'subtraction', 'multiplication', 'division'],
    examples: {
      addition: {
        value: 'addition',
        summary: 'Addition operation',
        description: 'The operation was adding two numbers',
      },
      subtraction: {
        value: 'subtraction',
        summary: 'Subtraction operation',
        description: 'The operation was subtracting one number from another',
      },
      multiplication: {
        value: 'multiplication',
        summary: 'Multiplication operation',
        description: 'The operation was multiplying two numbers',
      },
      division: {
        value: 'division',
        summary: 'Division operation',
        description: 'The operation was dividing one number by another',
      },
    },
  })
  operation!: string;

  /**
   * Constructor to create a new response DTO
   * @param result The calculation result
   * @param operation The operation performed
   */
  constructor(result?: number, operation?: string) {
    if (result !== undefined) this.result = result;
    if (operation !== undefined) this.operation = operation;
  }
}

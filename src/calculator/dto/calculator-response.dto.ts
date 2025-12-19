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
    description: 'The result of the arithmetic operation',
    example: 15,
    type: Number,
  })
  result: number;

  /**
   * The operation performed
   */
  @ApiProperty({
    description: 'The type of operation that was performed',
    example: 'add',
    enum: ['add', 'subtract', 'multiply', 'divide'],
  })
  operation: string;

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

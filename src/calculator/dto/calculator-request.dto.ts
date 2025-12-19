import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Request DTO for calculator operations
 * Validates input data for arithmetic operations with comprehensive error messages
 */
export class CalculatorRequestDto {
  /**
   * First operand for the calculation
   */
  @ApiProperty({
    description: 'The first operand for the calculation',
    example: 10,
    type: Number,
    required: true,
  })
  @IsNotEmpty({ message: 'First operand (a) is required' })
  @IsNumber({}, { message: 'First operand (a) must be a valid number' })
  @Type(() => Number)
  a: number;

  /**
   * Second operand for the calculation
   */
  @ApiProperty({
    description: 'The second operand for the calculation',
    example: 5,
    type: Number,
    required: true,
  })
  @IsNotEmpty({ message: 'Second operand (b) is required' })
  @IsNumber({}, { message: 'Second operand (b) must be a valid number' })
  @Type(() => Number)
  b: number;
}

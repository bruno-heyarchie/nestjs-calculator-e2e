import {
  IsNumber,
  IsNotEmpty,
  IsDefined,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Request DTO for calculator operations
 * Validates input data for arithmetic operations with comprehensive error messages
 * and automatic type conversion
 */
export class CalculatorRequestDto {
  /**
   * First operand for the calculation
   * Must be a finite number within the safe JavaScript number range
   */
  @ApiProperty({
    description: 'The first operand for the calculation',
    example: 10,
    type: Number,
    required: true,
    minimum: Number.MIN_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
  })
  @IsDefined({ message: 'First operand (a) must be defined' })
  @IsNotEmpty({ message: 'First operand (a) is required and cannot be empty' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message:
        'First operand (a) must be a valid finite number (not NaN or Infinity)',
    },
  )
  @Min(Number.MIN_SAFE_INTEGER, {
    message: `First operand (a) must be greater than or equal to ${Number.MIN_SAFE_INTEGER}`,
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: `First operand (a) must be less than or equal to ${Number.MAX_SAFE_INTEGER}`,
  })
  @Type(() => Number)
  @Transform(({ value }) => {
    // Handle string to number conversion with validation
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return undefined;
      const parsed = Number(trimmed);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  a!: number;

  /**
   * Second operand for the calculation
   * Must be a finite number within the safe JavaScript number range
   */
  @ApiProperty({
    description: 'The second operand for the calculation',
    example: 5,
    type: Number,
    required: true,
    minimum: Number.MIN_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
  })
  @IsDefined({ message: 'Second operand (b) must be defined' })
  @IsNotEmpty({
    message: 'Second operand (b) is required and cannot be empty',
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message:
        'Second operand (b) must be a valid finite number (not NaN or Infinity)',
    },
  )
  @Min(Number.MIN_SAFE_INTEGER, {
    message: `Second operand (b) must be greater than or equal to ${Number.MIN_SAFE_INTEGER}`,
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: `Second operand (b) must be less than or equal to ${Number.MAX_SAFE_INTEGER}`,
  })
  @Type(() => Number)
  @Transform(({ value }) => {
    // Handle string to number conversion with validation
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return undefined;
      const parsed = Number(trimmed);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  b!: number;
}

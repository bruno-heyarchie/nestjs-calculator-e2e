import { IsNumber, IsNotEmpty, IsDefined, Min, Max } from 'class-validator';
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
    description:
      'The first operand for the calculation. Must be a valid finite number within JavaScript safe integer range.',
    example: 10,
    type: Number,
    required: true,
    minimum: Number.MIN_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
    examples: {
      positiveInteger: {
        value: 10,
        summary: 'Positive integer',
        description: 'A positive whole number',
      },
      negativeInteger: {
        value: -15,
        summary: 'Negative integer',
        description: 'A negative whole number',
      },
      decimal: {
        value: 3.14159,
        summary: 'Decimal number',
        description: 'A floating-point number with decimal places',
      },
      zero: {
        value: 0,
        summary: 'Zero',
        description: 'The number zero',
      },
      largeNumber: {
        value: 999999,
        summary: 'Large number',
        description: 'A large positive number',
      },
    },
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
    description:
      'The second operand for the calculation. Must be a valid finite number within JavaScript safe integer range. For division operations, cannot be zero.',
    example: 5,
    type: Number,
    required: true,
    minimum: Number.MIN_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
    examples: {
      positiveInteger: {
        value: 5,
        summary: 'Positive integer',
        description: 'A positive whole number',
      },
      negativeInteger: {
        value: -8,
        summary: 'Negative integer',
        description: 'A negative whole number',
      },
      decimal: {
        value: 2.5,
        summary: 'Decimal number',
        description: 'A floating-point number with decimal places',
      },
      one: {
        value: 1,
        summary: 'One',
        description: 'The number one (identity for multiplication)',
      },
      smallDecimal: {
        value: 0.001,
        summary: 'Small decimal',
        description: 'A very small positive number',
      },
    },
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

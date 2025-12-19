import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Base DTO for calculator operations with two operands
 */
export class CalculatorOperationDto {
  /**
   * First operand for the calculation
   */
  @ApiProperty({
    description: 'First operand for the calculation',
    example: 10,
    type: Number,
  })
  @IsNotEmpty({ message: 'First operand is required' })
  @IsNumber({}, { message: 'First operand must be a valid number' })
  @Type(() => Number)
  a: number;

  /**
   * Second operand for the calculation
   */
  @ApiProperty({
    description: 'Second operand for the calculation',
    example: 5,
    type: Number,
  })
  @IsNotEmpty({ message: 'Second operand is required' })
  @IsNumber({}, { message: 'Second operand must be a valid number' })
  @Type(() => Number)
  b: number;
}

/**
 * Response DTO for binary operations (operations with two operands)
 */
export class BinaryOperationResponseDto {
  /**
   * The operation performed
   */
  @ApiProperty({
    description: 'The mathematical operation performed',
    example: 'add',
    enum: ['add', 'subtract', 'multiply', 'divide'],
  })
  operation: string;

  /**
   * First operand
   */
  @ApiProperty({
    description: 'First operand used in the calculation',
    example: 10,
    type: Number,
  })
  a: number;

  /**
   * Second operand
   */
  @ApiProperty({
    description: 'Second operand used in the calculation',
    example: 5,
    type: Number,
  })
  b: number;

  /**
   * Result of the operation
   */
  @ApiProperty({
    description: 'The calculated result',
    example: 15,
    type: Number,
  })
  result: number;
}

/**
 * Response DTO for unary operations (operations with one operand)
 */
export class UnaryOperationResponseDto {
  /**
   * The operation performed
   */
  @ApiProperty({
    description: 'The mathematical operation performed',
    example: 'square',
    type: String,
  })
  operation: string;

  /**
   * The operand
   */
  @ApiProperty({
    description: 'The operand used in the calculation',
    example: 5,
    type: Number,
  })
  value: number;

  /**
   * Result of the operation
   */
  @ApiProperty({
    description: 'The calculated result',
    example: 25,
    type: Number,
  })
  result: number;
}

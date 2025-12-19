import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString, IsEnum } from 'class-validator';
import type { CalculatorOperation } from '../interfaces/calculator.interface';

/**
 * Data Transfer Object for calculation results
 * Provides standardized response format with metadata
 */
export class CalculationResultDto {
  /**
   * The calculated result value
   */
  @ApiProperty({
    description: 'The result of the calculation',
    example: 42,
    type: Number,
  })
  @IsNumber()
  result!: number;

  /**
   * The operation that was performed
   */
  @ApiProperty({
    description: 'The type of operation that was performed',
    example: 'add',
    enum: [
      'add',
      'subtract',
      'multiply',
      'divide',
      'power',
      'sqrt',
      'factorial',
      'modulo',
      'absolute',
      'ceiling',
      'floor',
      'round',
    ],
  })
  @IsEnum([
    'add',
    'subtract',
    'multiply',
    'divide',
    'power',
    'sqrt',
    'factorial',
    'modulo',
    'absolute',
    'ceiling',
    'floor',
    'round',
  ])
  operation!: CalculatorOperation;

  /**
   * ISO timestamp when the calculation was performed
   */
  @ApiProperty({
    description: 'ISO timestamp when the calculation was performed',
    example: '2025-12-19T10:30:00.000Z',
    type: String,
  })
  @IsDateString()
  timestamp!: string;

  /**
   * Unique identifier for tracking this calculation
   */
  @ApiProperty({
    description: 'Unique identifier for tracking this calculation',
    example: 'calc_1234567890',
    type: String,
  })
  @IsString()
  calculationId!: string;

  /**
   * Constructor to create a new calculation result DTO
   * @param result The calculation result
   * @param operation The operation performed
   * @param timestamp ISO timestamp of calculation
   * @param calculationId Unique identifier for this calculation
   */
  constructor(
    result?: number,
    operation?: CalculatorOperation,
    timestamp?: string,
    calculationId?: string,
  ) {
    if (result !== undefined) this.result = result;
    if (operation !== undefined) this.operation = operation;
    if (timestamp !== undefined) this.timestamp = timestamp;
    if (calculationId !== undefined) this.calculationId = calculationId;
  }
}

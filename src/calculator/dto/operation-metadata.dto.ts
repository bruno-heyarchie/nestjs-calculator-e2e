import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

/**
 * Data Transfer Object for operation metadata
 * Contains additional context about the calculation
 */
export class OperationMetadataDto {
  /**
   * ISO timestamp when the operation was performed
   */
  @ApiProperty({
    description: 'ISO timestamp when the operation was performed',
    example: '2025-12-19T10:30:00.000Z',
    type: String,
  })
  @IsDateString()
  timestamp!: string;

  /**
   * Unique identifier for this operation
   */
  @ApiProperty({
    description: 'Unique identifier for this operation',
    example: 'calc_1234567890',
    type: String,
  })
  @IsString()
  operationId!: string;

  /**
   * Optional execution time in milliseconds
   */
  @ApiProperty({
    description: 'Execution time in milliseconds',
    example: 0.5,
    type: Number,
    required: false,
  })
  @IsOptional()
  executionTimeMs?: number;

  /**
   * Optional tags for categorizing operations
   */
  @ApiProperty({
    description: 'Tags for categorizing this operation',
    example: ['arithmetic', 'basic'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /**
   * Optional notes about the operation
   */
  @ApiProperty({
    description: 'Additional notes about the operation',
    example: 'Standard addition operation',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  /**
   * Constructor to create operation metadata
   * @param timestamp ISO timestamp
   * @param operationId Unique operation identifier
   * @param executionTimeMs Execution time in milliseconds
   * @param tags Optional tags
   * @param notes Optional notes
   */
  constructor(
    timestamp?: string,
    operationId?: string,
    executionTimeMs?: number,
    tags?: string[],
    notes?: string,
  ) {
    if (timestamp !== undefined) this.timestamp = timestamp;
    if (operationId !== undefined) this.operationId = operationId;
    if (executionTimeMs !== undefined) this.executionTimeMs = executionTimeMs;
    if (tags !== undefined) this.tags = tags;
    if (notes !== undefined) this.notes = notes;
  }
}

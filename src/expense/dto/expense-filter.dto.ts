import {
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsString,
  IsBoolean,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

/**
 * DTO for filtering and querying expenses
 * Supports filtering, sorting, and pagination
 */
export class ExpenseFilterDto {
  /**
   * Filter by category ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId?: string;

  /**
   * Filter by budget ID
   * @example "660e8400-e29b-41d4-a716-446655440000"
   */
  @ApiPropertyOptional({
    description: 'Filter by budget ID',
    example: '660e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Budget ID must be a valid UUID' })
  budgetId?: string;

  /**
   * Filter by start date (inclusive)
   * @example "2024-01-01"
   */
  @ApiPropertyOptional({
    description: 'Filter by start date (inclusive)',
    example: '2024-01-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO 8601 date string' },
  )
  startDate?: string;

  /**
   * Filter by end date (inclusive)
   * @example "2024-12-31"
   */
  @ApiPropertyOptional({
    description: 'Filter by end date (inclusive)',
    example: '2024-12-31',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string' },
  )
  endDate?: string;

  /**
   * Minimum amount filter
   * @example 10.00
   */
  @ApiPropertyOptional({
    description: 'Minimum amount filter',
    example: 10.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum amount must be a valid number' })
  @Min(0, { message: 'Minimum amount must be greater than or equal to 0' })
  @Type(() => Number)
  minAmount?: number;

  /**
   * Maximum amount filter
   * @example 1000.00
   */
  @ApiPropertyOptional({
    description: 'Maximum amount filter',
    example: 1000.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum amount must be a valid number' })
  @Min(0, { message: 'Maximum amount must be greater than or equal to 0' })
  @Type(() => Number)
  maxAmount?: number;

  /**
   * Search term for description or notes
   * @example "grocery"
   */
  @ApiPropertyOptional({
    description: 'Search term for description or notes',
    example: 'grocery',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  /**
   * Include soft-deleted expenses
   * @example false
   */
  @ApiPropertyOptional({
    description: 'Include soft-deleted expenses',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Include deleted must be a boolean' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  includeDeleted?: boolean;

  /**
   * Field to sort by
   * @example "date"
   */
  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'date',
    enum: ['date', 'amount', 'createdAt', 'description'],
    default: 'date',
  })
  @IsOptional()
  @IsIn(['date', 'amount', 'createdAt', 'description'], {
    message: 'Sort by must be one of: date, amount, createdAt, description',
  })
  sortBy?: 'date' | 'amount' | 'createdAt' | 'description';

  /**
   * Sort order
   * @example "DESC"
   */
  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: 'Sort order must be one of: ASC, DESC',
  })
  sortOrder?: 'ASC' | 'DESC';

  /**
   * Page number (1-based)
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a valid number' })
  @Min(1, { message: 'Page must be greater than or equal to 1' })
  @Type(() => Number)
  page?: number;

  /**
   * Number of items per page
   * @example 20
   */
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be greater than or equal to 1' })
  @Max(100, { message: 'Limit must be less than or equal to 100' })
  @Type(() => Number)
  limit?: number;
}

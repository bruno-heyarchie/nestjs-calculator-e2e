import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for creating a new expense
 */
export class CreateExpenseDto {
  /**
   * Expense description
   * @example "Grocery shopping at Whole Foods"
   */
  @ApiProperty({
    description: 'Expense description',
    example: 'Grocery shopping at Whole Foods',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description!: string;

  /**
   * Expense amount
   * @example 125.50
   */
  @ApiProperty({
    description: 'Expense amount',
    example: 125.5,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount!: number;

  /**
   * Expense date
   * @example "2024-01-15"
   */
  @ApiProperty({
    description: 'Expense date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO 8601 date string' })
  date!: string;

  /**
   * Category ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId!: string;

  /**
   * Optional notes about the expense
   * @example "Bought organic vegetables and fruits"
   */
  @ApiPropertyOptional({
    description: 'Optional notes about the expense',
    example: 'Bought organic vegetables and fruits',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;

  /**
   * Optional budget ID to associate with this expense
   * @example "660e8400-e29b-41d4-a716-446655440000"
   */
  @ApiPropertyOptional({
    description: 'Optional budget ID to associate with this expense',
    example: '660e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Budget ID must be a valid UUID' })
  budgetId?: string;
}

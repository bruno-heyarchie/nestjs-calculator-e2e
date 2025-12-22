import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsHexColor,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new category
 */
export class CreateCategoryDto {
  /**
   * Category name (must be unique)
   */
  @ApiProperty({
    description: 'Category name (must be unique)',
    example: 'Groceries',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(100, { message: 'Category name must not exceed 100 characters' })
  name!: string;

  /**
   * Category color (hex code)
   */
  @ApiPropertyOptional({
    description: 'Category color in hex format',
    example: '#FF5733',
  })
  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color code' })
  color?: string;

  /**
   * Category icon identifier
   */
  @ApiPropertyOptional({
    description: 'Icon identifier for the category',
    example: 'shopping-cart',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Icon must be a string' })
  @MaxLength(50, { message: 'Icon must not exceed 50 characters' })
  icon?: string;

  /**
   * Category description
   */
  @ApiPropertyOptional({
    description: 'Brief description of the category',
    example: 'Expenses related to grocery shopping',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

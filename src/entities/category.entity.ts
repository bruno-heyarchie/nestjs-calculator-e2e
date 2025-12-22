import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Expense } from './expense.entity';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsHexColor,
  MaxLength,
} from 'class-validator';

/**
 * Category Entity
 * Represents an expense category in the spending tracker system
 *
 * @entity categories
 * @description
 * - Stores category information including name, color, icon, and description
 * - Supports both predefined and custom categories
 * - Includes soft delete functionality to preserve data integrity
 * - Indexed fields for optimized query performance
 */
@Entity('categories')
@Index(['name'], { unique: true })
export class Category {
  /**
   * Unique identifier for the category
   * Auto-generated UUID primary key
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Category name
   * Must be unique across all categories
   *
   * @validation
   * - Required field
   * - Must be a string
   * - Maximum length of 100 characters
   * - Unique constraint enforced
   */
  @Column('varchar', { length: 100, unique: true })
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(100, { message: 'Category name must not exceed 100 characters' })
  name!: string;

  /**
   * Category color code
   * Hex color code for UI representation (e.g., #FF5733)
   *
   * @validation
   * - Optional field
   * - Must be a valid hex color code if provided
   */
  @Column('varchar', { length: 7, nullable: true })
  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color code' })
  color?: string;

  /**
   * Category icon identifier
   * Icon name or identifier for UI representation
   *
   * @validation
   * - Optional field
   * - Must be a string if provided
   * - Maximum length of 50 characters
   */
  @Column('varchar', { length: 50, nullable: true })
  @IsOptional()
  @IsString({ message: 'Icon must be a string' })
  @MaxLength(50, { message: 'Icon must not exceed 50 characters' })
  icon?: string;

  /**
   * Category description
   * Brief explanation of what the category is for
   *
   * @validation
   * - Optional field
   * - Must be a string if provided
   * - Maximum length of 500 characters
   */
  @Column('varchar', { length: 500, nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters',
  })
  description?: string;

  /**
   * Flag to indicate if this is a system-defined category
   * System categories cannot be deleted by users
   */
  @Column('boolean', { default: false, name: 'is_system' })
  isSystem!: boolean;

  /**
   * Timestamp when the category record was created
   * Automatically set by TypeORM on insert
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp when the category record was last updated
   * Automatically updated by TypeORM on each update
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Soft delete timestamp
   * When set, the category is considered deleted
   * Prevents deletion of categories with existing expenses
   */
  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;

  // Relationships
  /**
   * Expenses relationship
   * One category can have many expenses
   */
  @OneToMany(() => Expense, (expense) => expense.category)
  expenses!: Expense[];

  /**
   * Virtual property to get expense count
   * This is typically populated by query builder when needed
   */
  expenseCount?: number;
}

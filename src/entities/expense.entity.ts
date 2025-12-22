import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.entity';
import { Budget } from './budget.entity';
import { Category } from './category.entity';

@Entity('expenses')
@Index(['userId', 'date'])
@Index(['userId', 'categoryId'])
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount!: number;

  @Column({ type: 'date' })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDate({ message: 'Date must be a valid date' })
  @Type(() => Date)
  date!: Date;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;

  @Column({ type: 'uuid', name: 'user_id' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true, name: 'budget_id' })
  @IsOptional()
  @IsUUID('4', { message: 'Budget ID must be a valid UUID' })
  budgetId!: string | null;

  @Column({ type: 'uuid', name: 'category_id' })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId!: string;

  @ManyToOne(() => User, (user: User) => user.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Budget, (budget: Budget) => budget.expenses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'budget_id' })
  budget!: Budget | null;

  @ManyToOne(() => Category, (category: Category) => category.expenses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}

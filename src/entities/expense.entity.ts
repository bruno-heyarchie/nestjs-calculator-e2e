import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
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
  description!: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  date!: Date;
  
  @Column({ type: 'text', nullable: true })
  notes?: string;
  
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
  
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
  
  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;
  
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  
  @Column({ type: 'uuid', nullable: true, name: 'budget_id' })
  budgetId!: string | null;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId!: string;

  @ManyToOne(() => User, (user: User) => user.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Budget, (budget: Budget) => budget.expenses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'budget_id' })
  budget!: Budget | null;

  @ManyToOne(() => Category, (category: Category) => category.expenses, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}

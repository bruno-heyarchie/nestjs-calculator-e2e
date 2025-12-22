import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { BudgetCategory } from './budget-category.entity';
import { Expense } from './expense.entity';

export enum BudgetPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('budgets')
@Index(['userId', 'startDate', 'endDate'])
@Index(['userId', 'categoryId'])
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'spent_amount',
  })
  spentAmount!: number;

  @Column({ type: 'enum', enum: BudgetPeriod, default: BudgetPeriod.MONTHLY })
  period!: BudgetPeriod;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate!: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ type: 'boolean', default: true, name: 'alert_enabled' })
  alertEnabled!: boolean;

  @Column({ type: 'integer', default: 80, name: 'alert_threshold' })
  alertThreshold!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true, name: 'category_id' })
  categoryId!: string | null;

  @ManyToOne(() => User, (user: User) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(
    () => BudgetCategory,
    (category: BudgetCategory) => category.budgets,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'category_id' })
  category!: BudgetCategory | null;

  @OneToMany(() => Expense, (expense: Expense) => expense.budget)
  expenses!: Expense[];
}

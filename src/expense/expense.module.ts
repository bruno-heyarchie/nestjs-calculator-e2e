import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseService } from './expense.service';
import { Expense } from '../entities/expense.entity';

/**
 * Expense module that handles expense management
 * Provides CRUD operations and expense analytics
 *
 * @module ExpenseModule
 * @description
 * - Registers Expense entity with TypeORM
 * - Provides ExpenseService for business logic
 * - Exports ExpenseService for use in other modules
 */
@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget } from '../entities/budget.entity';
import { BudgetCategory } from '../entities/budget-category.entity';
import { BudgetOwnershipGuard } from './guards/budget-ownership.guard';

/**
 * Budget module that handles budget management
 * Provides CRUD operations for user budgets
 *
 * @module BudgetModule
 * @description
 * - Registers Budget entity with TypeORM
 * - Provides BudgetService for business logic
 * - Exposes BudgetController for REST API endpoints
 * - Includes BudgetOwnershipGuard for authorization
 */
@Module({
  imports: [TypeOrmModule.forFeature([Budget, BudgetCategory])],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetOwnershipGuard],
  exports: [BudgetService],
})
export class BudgetModule {}

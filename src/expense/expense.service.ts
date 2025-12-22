import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseFilterDto } from './dto/expense-filter.dto';
import {
  PaginatedExpenseResult,
  ExpenseSummary,
} from './interfaces/expense.interface';

/**
 * Service handling all expense-related business logic
 * Provides CRUD operations, filtering, pagination, and aggregations
 */
@Injectable()
export class ExpenseService {
  private readonly logger = new Logger(ExpenseService.name);

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  /**
   * Create a new expense
   * @param userId - User ID creating the expense
   * @param createExpenseDto - Expense data
   * @returns Created expense
   */
  async create(
    userId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    this.logger.log(`Creating expense for user ${userId}`);

    try {
      // Create expense entity
      const expense = this.expenseRepository.create({
        ...createExpenseDto,
        userId,
        date: new Date(createExpenseDto.date),
      });

      // Save to database
      const savedExpense = await this.expenseRepository.save(expense);

      this.logger.log(`Expense created successfully: ${savedExpense.id}`);

      // Fetch with relations for complete data
      return this.findOne(savedExpense.id, userId);
    } catch (error) {
      this.logger.error(
        `Failed to create expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof Error &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new BadRequestException('Invalid category or budget ID provided');
      }

      throw new BadRequestException('Failed to create expense');
    }
  }

  /**
   * Find all expenses with filtering, sorting, and pagination
   * @param userId - User ID to filter expenses
   * @param filterDto - Filter and pagination options
   * @returns Paginated expense results
   */
  async findAll(
    userId: string,
    filterDto: ExpenseFilterDto,
  ): Promise<PaginatedExpenseResult<Expense>> {
    this.logger.log(`Fetching expenses for user ${userId} with filters`);

    // Build query
    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.budget', 'budget')
      .where('expense.userId = :userId', { userId });

    // Apply filters
    this.applyFilters(queryBuilder, filterDto);

    // Apply sorting
    const sortBy = filterDto.sortBy || 'date';
    const sortOrder = filterDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`expense.${sortBy}`, sortOrder);

    // Apply pagination
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 20;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [expenses, total] = await queryBuilder.getManyAndCount();

    this.logger.log(`Found ${total} expenses for user ${userId}`);

    // Build paginated result
    return {
      data: expenses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    };
  }

  /**
   * Find a single expense by ID
   * @param id - Expense ID
   * @param userId - User ID for authorization
   * @returns Expense entity
   * @throws NotFoundException if expense not found or doesn't belong to user
   */
  async findOne(id: string, userId: string): Promise<Expense> {
    this.logger.log(`Fetching expense ${id} for user ${userId}`);

    const expense = await this.expenseRepository.findOne({
      where: {
        id,
        userId,
        deletedAt: IsNull(),
      },
      relations: ['category', 'budget'],
    });

    if (!expense) {
      this.logger.warn(`Expense ${id} not found for user ${userId}`);
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  /**
   * Update an expense
   * @param id - Expense ID
   * @param userId - User ID for authorization
   * @param updateExpenseDto - Updated expense data
   * @returns Updated expense
   * @throws NotFoundException if expense not found or doesn't belong to user
   */
  async update(
    id: string,
    userId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    this.logger.log(`Updating expense ${id} for user ${userId}`);

    // Verify expense exists and belongs to user
    await this.findOne(id, userId);

    try {
      // Prepare update data - convert date string to Date if provided
      const updateData: any = updateExpenseDto.date
        ? {
            ...updateExpenseDto,
            date: new Date(updateExpenseDto.date),
          }
        : { ...updateExpenseDto };

      // Update expense
      await this.expenseRepository.update(id, updateData);

      this.logger.log(`Expense ${id} updated successfully`);

      // Return updated expense with relations
      return this.findOne(id, userId);
    } catch (error) {
      this.logger.error(
        `Failed to update expense ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof Error &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new BadRequestException('Invalid category or budget ID provided');
      }

      throw new BadRequestException('Failed to update expense');
    }
  }

  /**
   * Soft delete an expense
   * @param id - Expense ID
   * @param userId - User ID for authorization
   * @throws NotFoundException if expense not found or doesn't belong to user
   */
  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting expense ${id} for user ${userId}`);

    // Verify expense exists and belongs to user
    await this.findOne(id, userId);

    // Soft delete
    await this.expenseRepository.update(id, {
      deletedAt: new Date(),
    });

    this.logger.log(`Expense ${id} deleted successfully`);
  }

  /**
   * Hard delete an expense (permanent deletion)
   * @param id - Expense ID
   * @param userId - User ID for authorization
   * @throws NotFoundException if expense not found or doesn't belong to user
   */
  async hardDelete(id: string, userId: string): Promise<void> {
    this.logger.log(`Hard deleting expense ${id} for user ${userId}`);

    // Verify expense exists and belongs to user
    const expense = await this.expenseRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      this.logger.warn(`Expense ${id} not found for user ${userId}`);
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Hard delete
    await this.expenseRepository.delete(id);

    this.logger.log(`Expense ${id} permanently deleted`);
  }

  /**
   * Get expense summary with aggregated statistics
   * @param userId - User ID
   * @param filterDto - Optional filters
   * @returns Expense summary statistics
   */
  async getSummary(
    userId: string,
    filterDto?: ExpenseFilterDto,
  ): Promise<ExpenseSummary> {
    this.logger.log(`Generating expense summary for user ${userId}`);

    // Build base query
    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId });

    // Apply filters if provided
    if (filterDto) {
      this.applyFilters(queryBuilder, filterDto);
    }

    // Get aggregated data
    const result = await queryBuilder
      .select('COUNT(expense.id)', 'count')
      .addSelect('SUM(expense.amount)', 'totalAmount')
      .addSelect('AVG(expense.amount)', 'averageAmount')
      .addSelect('MIN(expense.amount)', 'minAmount')
      .addSelect('MAX(expense.amount)', 'maxAmount')
      .getRawOne();

    // Get category breakdown
    const categoryBreakdown = await queryBuilder
      .leftJoin('expense.category', 'category')
      .select('expense.categoryId', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(expense.id)', 'count')
      .addSelect('SUM(expense.amount)', 'totalAmount')
      .groupBy('expense.categoryId')
      .addGroupBy('category.name')
      .getRawMany();

    const summary: ExpenseSummary = {
      totalAmount: parseFloat(result.totalAmount) || 0,
      count: parseInt(result.count) || 0,
      averageAmount: parseFloat(result.averageAmount) || 0,
      minAmount: parseFloat(result.minAmount) || 0,
      maxAmount: parseFloat(result.maxAmount) || 0,
      byCategory: categoryBreakdown.map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        totalAmount: parseFloat(item.totalAmount) || 0,
        count: parseInt(item.count) || 0,
      })),
    };

    // Add date range if filters provided
    if (filterDto?.startDate || filterDto?.endDate) {
      summary.dateRange = {
        startDate: filterDto.startDate
          ? new Date(filterDto.startDate)
          : new Date(0),
        endDate: filterDto.endDate ? new Date(filterDto.endDate) : new Date(),
      };
    }

    this.logger.log(
      `Summary generated: ${summary.count} expenses, total: ${summary.totalAmount}`,
    );

    return summary;
  }

  /**
   * Apply filters to query builder
   * @param queryBuilder - TypeORM query builder
   * @param filterDto - Filter options
   */
  private applyFilters(queryBuilder: any, filterDto: ExpenseFilterDto): void {
    // Filter by soft delete
    if (!filterDto.includeDeleted) {
      queryBuilder.andWhere('expense.deletedAt IS NULL');
    }

    // Filter by category
    if (filterDto.categoryId) {
      queryBuilder.andWhere('expense.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    // Filter by budget
    if (filterDto.budgetId) {
      queryBuilder.andWhere('expense.budgetId = :budgetId', {
        budgetId: filterDto.budgetId,
      });
    }

    // Filter by date range
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('expense.date >= :startDate', {
        startDate: filterDto.startDate,
      });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('expense.date <= :endDate', {
        endDate: filterDto.endDate,
      });
    }

    // Filter by amount range
    if (
      filterDto.minAmount !== undefined &&
      filterDto.maxAmount !== undefined
    ) {
      queryBuilder.andWhere(
        'expense.amount BETWEEN :minAmount AND :maxAmount',
        {
          minAmount: filterDto.minAmount,
          maxAmount: filterDto.maxAmount,
        },
      );
    } else if (filterDto.minAmount !== undefined) {
      queryBuilder.andWhere('expense.amount >= :minAmount', {
        minAmount: filterDto.minAmount,
      });
    } else if (filterDto.maxAmount !== undefined) {
      queryBuilder.andWhere('expense.amount <= :maxAmount', {
        maxAmount: filterDto.maxAmount,
      });
    }

    // Search in description and notes
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(expense.description ILIKE :search OR expense.notes ILIKE :search)',
        {
          search: `%${filterDto.search}%`,
        },
      );
    }
  }
}

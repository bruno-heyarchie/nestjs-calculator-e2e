import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetQueryDto } from './dto/budget-query.dto';
import { PaginatedBudgetResponseDto } from './dto/budget-response.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(
    userId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    const startDate = new Date(createBudgetDto.startDate);
    const endDate = new Date(createBudgetDto.endDate);
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      userId,
      startDate,
      endDate,
      spentAmount: 0,
      isActive: createBudgetDto.isActive ?? true,
      alertEnabled: createBudgetDto.alertEnabled ?? true,
      alertThreshold: createBudgetDto.alertThreshold ?? 80,
    });
    return await this.budgetRepository.save(budget);
  }

  async findAll(
    userId: string,
    query: BudgetQueryDto,
  ): Promise<PaginatedBudgetResponseDto> {
    const {
      page = 1,
      limit = 10,
      period,
      isActive,
      categoryId,
      startDateFrom,
      startDateTo,
    } = query;
    const queryBuilder = this.budgetRepository
      .createQueryBuilder('budget')
      .where('budget.userId = :userId', { userId })
      .andWhere('budget.deletedAt IS NULL');
    if (period) {
      queryBuilder.andWhere('budget.period = :period', { period });
    }
    if (isActive !== undefined) {
      queryBuilder.andWhere('budget.isActive = :isActive', { isActive });
    }
    if (categoryId) {
      queryBuilder.andWhere('budget.categoryId = :categoryId', { categoryId });
    }
    if (startDateFrom) {
      queryBuilder.andWhere('budget.startDate >= :startDateFrom', {
        startDateFrom,
      });
    }
    if (startDateTo) {
      queryBuilder.andWhere('budget.startDate <= :startDateTo', {
        startDateTo,
      });
    }
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('budget.createdAt', 'DESC');
    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['category'],
    });
    if (!budget) {
      throw new NotFoundException('Budget with ID ' + id + ' not found');
    }
    if (budget.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this budget',
      );
    }
    return budget;
  }

  async update(
    id: string,
    userId: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<Budget> {
    const budget = await this.findOne(id, userId);
    if (updateBudgetDto.startDate || updateBudgetDto.endDate) {
      const startDate = updateBudgetDto.startDate
        ? new Date(updateBudgetDto.startDate)
        : budget.startDate;
      const endDate = updateBudgetDto.endDate
        ? new Date(updateBudgetDto.endDate)
        : budget.endDate;
      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }
    }
    Object.assign(budget, {
      ...updateBudgetDto,
      ...(updateBudgetDto.startDate && {
        startDate: new Date(updateBudgetDto.startDate),
      }),
      ...(updateBudgetDto.endDate && {
        endDate: new Date(updateBudgetDto.endDate),
      }),
    });
    return await this.budgetRepository.save(budget);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findOne(id, userId);
    budget.deletedAt = new Date();
    await this.budgetRepository.save(budget);
  }

  async belongsToUser(budgetId: string, userId: string): Promise<boolean> {
    const count = await this.budgetRepository.count({
      where: { id: budgetId, userId, deletedAt: IsNull() },
    });
    return count > 0;
  }

  async getActiveBudgets(userId: string): Promise<Budget[]> {
    return await this.budgetRepository.find({
      where: { userId, isActive: true, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async updateSpentAmount(budgetId: string, amount: number): Promise<void> {
    await this.budgetRepository.increment(
      { id: budgetId },
      'spentAmount',
      amount,
    );
  }
}

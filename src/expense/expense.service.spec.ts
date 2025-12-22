import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseFilterDto } from './dto/expense-filter.dto';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repository: Repository<Expense>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockCategoryId = '660e8400-e29b-41d4-a716-446655440000';
  const mockExpenseId = '770e8400-e29b-41d4-a716-446655440000';

  const mockExpense: Partial<Expense> = {
    id: mockExpenseId,
    description: 'Test expense',
    amount: 100,
    date: new Date('2024-01-15'),
    categoryId: mockCategoryId,
    userId: mockUserId,
    notes: 'Test notes',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense successfully', async () => {
      const createDto: CreateExpenseDto = {
        description: 'Test expense',
        amount: 100,
        date: '2024-01-15',
        categoryId: mockCategoryId,
        notes: 'Test notes',
      };

      mockRepository.create.mockReturnValue(mockExpense);
      mockRepository.save.mockResolvedValue(mockExpense);
      mockRepository.findOne.mockResolvedValue(mockExpense);

      const result = await service.create(mockUserId, createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUserId,
        date: new Date(createDto.date),
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockExpense);
    });

    it('should throw BadRequestException on invalid category', async () => {
      const createDto: CreateExpenseDto = {
        description: 'Test expense',
        amount: 100,
        date: '2024-01-15',
        categoryId: 'invalid-id',
      };

      const error = new Error('violates foreign key constraint');
      mockRepository.create.mockReturnValue(mockExpense);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const filterDto: ExpenseFilterDto = {
        page: 1,
        limit: 20,
        sortBy: 'date',
        sortOrder: 'DESC',
      };

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockExpense], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(mockUserId, filterDto);

      expect(result.data).toEqual([mockExpense]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
    });

    it('should apply filters correctly', async () => {
      const filterDto: ExpenseFilterDto = {
        categoryId: mockCategoryId,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minAmount: 50,
        maxAmount: 200,
        search: 'test',
      };

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll(mockUserId, filterDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpense);

      const result = await service.findOne(mockExpenseId, mockUserId);

      expect(result).toEqual(mockExpense);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockExpenseId,
          userId: mockUserId,
          deletedAt: expect.anything(),
        },
        relations: ['category', 'budget'],
      });
    });

    it('should throw NotFoundException when expense not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockExpenseId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for wrong user', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(mockExpenseId, 'different-user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense successfully', async () => {
      const updateDto: UpdateExpenseDto = {
        description: 'Updated expense',
        amount: 150,
      };

      const updatedExpense = { ...mockExpense, ...updateDto };

      mockRepository.findOne.mockResolvedValueOnce(mockExpense);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValueOnce(updatedExpense);

      const result = await service.update(mockExpenseId, mockUserId, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        mockExpenseId,
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedExpense);
    });

    it('should throw NotFoundException when updating non-existent expense', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const updateDto: UpdateExpenseDto = {
        description: 'Updated expense',
      };

      await expect(
        service.update(mockExpenseId, mockUserId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle date conversion in update', async () => {
      const updateDto: UpdateExpenseDto = {
        date: '2024-02-20',
      };

      mockRepository.findOne.mockResolvedValueOnce(mockExpense);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValueOnce(mockExpense);

      await service.update(mockExpenseId, mockUserId, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        mockExpenseId,
        expect.objectContaining({
          date: new Date('2024-02-20'),
        }),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete an expense', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.remove(mockExpenseId, mockUserId);

      expect(mockRepository.update).toHaveBeenCalledWith(mockExpenseId, {
        deletedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when deleting non-existent expense', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(mockExpenseId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete an expense', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.hardDelete(mockExpenseId, mockUserId);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockExpenseId);
    });

    it('should throw NotFoundException when hard deleting non-existent expense', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.hardDelete(mockExpenseId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSummary', () => {
    it('should return expense summary with statistics', async () => {
      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          count: '5',
          totalAmount: '500',
          averageAmount: '100',
          minAmount: '50',
          maxAmount: '150',
        }),
        getRawMany: jest.fn().mockResolvedValue([
          {
            categoryId: mockCategoryId,
            categoryName: 'Food',
            count: '3',
            totalAmount: '300',
          },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getSummary(mockUserId);

      expect(result.totalAmount).toBe(500);
      expect(result.count).toBe(5);
      expect(result.averageAmount).toBe(100);
      expect(result.minAmount).toBe(50);
      expect(result.maxAmount).toBe(150);
      expect(result.byCategory).toHaveLength(1);
      expect(result.byCategory![0].categoryName).toBe('Food');
    });

    it('should include date range in summary when filters provided', async () => {
      const filterDto: ExpenseFilterDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          count: '0',
          totalAmount: '0',
          averageAmount: '0',
          minAmount: '0',
          maxAmount: '0',
        }),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getSummary(mockUserId, filterDto);

      expect(result.dateRange).toBeDefined();
      expect(result.dateRange?.startDate).toEqual(new Date('2024-01-01'));
      expect(result.dateRange?.endDate).toEqual(new Date('2024-12-31'));
    });
  });
});

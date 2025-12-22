import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, deletedAt: IsNull() },
    });
    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      isSystem: false,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL')
      .loadRelationCountAndMap(
        'category.expenseCount',
        'category.expenses',
        'expense',
        (qb) => qb.where('expense.deletedAt IS NULL'),
      )
      .orderBy('category.isSystem', 'DESC')
      .addOrderBy('category.name', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .andWhere('category.deletedAt IS NULL')
      .loadRelationCountAndMap(
        'category.expenseCount',
        'category.expenses',
        'expense',
        (qb) => qb.where('expense.deletedAt IS NULL'),
      )
      .getOne();
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    if (category.isSystem) {
      throw new BadRequestException('System categories cannot be modified');
    }
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, deletedAt: IsNull() },
      });
      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    if (category.isSystem) {
      throw new BadRequestException('System categories cannot be deleted');
    }
    if (category.expenseCount && category.expenseCount > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it has ${category.expenseCount} associated expense(s).`,
      );
    }
    category.deletedAt = new Date();
    await this.categoryRepository.save(category);
  }
}

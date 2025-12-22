import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from '../entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Category created successfully', type: Category })
  @ApiConflictResponse({ description: 'Category name already exists' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all categories', type: [Category] })
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category details', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category updated successfully', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiConflictResponse({ description: 'Category name already exists' })
  @ApiBadRequestResponse({ description: 'Invalid input data or system category modification attempt' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Cannot delete category with existing expenses or system category' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.categoryService.remove(id);
  }
}

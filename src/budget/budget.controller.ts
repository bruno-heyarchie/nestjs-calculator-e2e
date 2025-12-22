import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetQueryDto } from './dto/budget-query.dto';
import {
  BudgetResponseDto,
  PaginatedBudgetResponseDto,
} from './dto/budget-response.dto';
import { BudgetOwnershipGuard } from './guards/budget-ownership.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiCommonResponses } from '../common/decorators/api-common-responses.decorator';

/**
 * Controller for budget management endpoints
 * Provides full CRUD operations for budgets with user authorization
 */
@ApiTags('budgets')
@Controller('budgets')
@ApiBearerAuth()
@ApiCommonResponses()
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  /**
   * Create a new budget
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new budget',
    description:
      'Creates a new budget for the authenticated user with the provided details',
  })
  @ApiCreatedResponse({
    description: 'Budget successfully created',
    type: BudgetResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - User not authenticated',
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createBudgetDto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return await this.budgetService.create(userId, createBudgetDto);
  }

  /**
   * Get all budgets for the authenticated user
   */
  @Get()
  @ApiOperation({
    summary: 'Get all budgets',
    description:
      'Retrieves all budgets for the authenticated user with optional filtering and pagination',
  })
  @ApiOkResponse({
    description: 'Budgets successfully retrieved',
    type: PaginatedBudgetResponseDto,
  })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: BudgetQueryDto,
  ): Promise<PaginatedBudgetResponseDto> {
    return await this.budgetService.findAll(userId, query);
  }

  /**
   * Get a single budget by ID
   */
  @Get(':id')
  @UseGuards(BudgetOwnershipGuard)
  @ApiOperation({
    summary: 'Get budget by ID',
    description:
      'Retrieves a single budget by its ID. User must own the budget.',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Budget successfully retrieved',
    type: BudgetResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Budget not found',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to access this budget',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<BudgetResponseDto> {
    return await this.budgetService.findOne(id, userId);
  }

  /**
   * Update a budget
   */
  @Put(':id')
  @UseGuards(BudgetOwnershipGuard)
  @ApiOperation({
    summary: 'Update budget',
    description: 'Updates an existing budget. User must own the budget.',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Budget successfully updated',
    type: BudgetResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Budget not found',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to update this budget',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return await this.budgetService.update(id, userId, updateBudgetDto);
  }

  /**
   * Delete a budget (soft delete)
   */
  @Delete(':id')
  @UseGuards(BudgetOwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete budget',
    description:
      'Soft deletes a budget. User must own the budget. Historical data is preserved.',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Budget successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Budget not found',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to delete this budget',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    await this.budgetService.remove(id, userId);
  }

  /**
   * Get active budgets
   */
  @Get('active/list')
  @ApiOperation({
    summary: 'Get active budgets',
    description: 'Retrieves all active budgets for the authenticated user',
  })
  @ApiOkResponse({
    description: 'Active budgets successfully retrieved',
    type: [BudgetResponseDto],
  })
  async getActiveBudgets(
    @CurrentUser('id') userId: string,
  ): Promise<BudgetResponseDto[]> {
    return await this.budgetService.getActiveBudgets(userId);
  }
}

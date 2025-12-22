import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BudgetPeriod } from '../../entities/budget.entity';

export class BudgetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  spentAmount!: number;

  @ApiProperty({ enum: BudgetPeriod })
  period!: BudgetPeriod;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  alertEnabled!: boolean;

  @ApiProperty()
  alertThreshold!: number;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional()
  categoryId?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  deletedAt?: Date | null;
}

export class PaginatedBudgetResponseDto {
  @ApiProperty({ type: [BudgetResponseDto] })
  data!: BudgetResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  totalPages!: number;
}

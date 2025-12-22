export enum BudgetPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface BudgetCategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  spentAmount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  alertEnabled: boolean;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string | null;
  category?: BudgetCategory | null;
}

export interface CreateBudgetDto {
  name: string;
  description?: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  alertEnabled?: boolean;
  alertThreshold?: number;
  categoryId?: string;
}

export interface UpdateBudgetDto {
  name?: string;
  description?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  alertEnabled?: boolean;
  alertThreshold?: number;
  categoryId?: string;
}

export interface BudgetQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isActive?: boolean;
  categoryId?: string;
  period?: BudgetPeriod;
}

export interface PaginatedBudgetResponse {
  data: Budget[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

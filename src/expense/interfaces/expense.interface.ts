/**
 * Expense filter and query interfaces
 */

/**
 * Filter options for querying expenses
 */
export interface ExpenseFilterOptions {
  /**
   * Filter by user ID
   */
  userId?: string;

  /**
   * Filter by category ID
   */
  categoryId?: string;

  /**
   * Filter by budget ID
   */
  budgetId?: string;

  /**
   * Filter by start date (inclusive)
   */
  startDate?: Date;

  /**
   * Filter by end date (inclusive)
   */
  endDate?: Date;

  /**
   * Minimum amount filter
   */
  minAmount?: number;

  /**
   * Maximum amount filter
   */
  maxAmount?: number;

  /**
   * Search term for description or notes
   */
  search?: string;

  /**
   * Include soft-deleted expenses
   */
  includeDeleted?: boolean;
}

/**
 * Sort options for expense queries
 */
export interface ExpenseSortOptions {
  /**
   * Field to sort by
   */
  sortBy?: 'date' | 'amount' | 'createdAt' | 'description';

  /**
   * Sort order
   */
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Pagination options for expense queries
 */
export interface ExpensePaginationOptions {
  /**
   * Page number (1-based)
   */
  page?: number;

  /**
   * Number of items per page
   */
  limit?: number;

  /**
   * Skip pagination and return all results
   */
  skipPagination?: boolean;
}

/**
 * Combined query options for expense listing
 */
export interface ExpenseQueryOptions
  extends ExpenseFilterOptions,
    ExpenseSortOptions,
    ExpensePaginationOptions {}

/**
 * Paginated result wrapper
 */
export interface PaginatedExpenseResult<T> {
  /**
   * Array of results
   */
  data: T[];

  /**
   * Total number of items matching the filter
   */
  total: number;

  /**
   * Current page number
   */
  page: number;

  /**
   * Number of items per page
   */
  limit: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNext: boolean;

  /**
   * Whether there is a previous page
   */
  hasPrevious: boolean;
}

/**
 * Expense summary statistics
 */
export interface ExpenseSummary {
  /**
   * Total amount of expenses
   */
  totalAmount: number;

  /**
   * Number of expenses
   */
  count: number;

  /**
   * Average expense amount
   */
  averageAmount: number;

  /**
   * Minimum expense amount
   */
  minAmount: number;

  /**
   * Maximum expense amount
   */
  maxAmount: number;

  /**
   * Breakdown by category
   */
  byCategory?: Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    count: number;
  }>;

  /**
   * Date range of the summary
   */
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

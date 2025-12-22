import {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetQueryParams,
  PaginatedBudgetResponse,
} from '../types/budget.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Create headers with authentication
 */
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Handle API response errors
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

/**
 * Budget API Service
 */
export const budgetApi = {
  /**
   * Get all budgets with optional filtering and pagination
   */
  async getBudgets(params?: BudgetQueryParams): Promise<PaginatedBudgetResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/budgets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<PaginatedBudgetResponse>(response);
  },

  /**
   * Get a single budget by ID
   */
  async getBudgetById(id: string): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<Budget>(response);
  },

  /**
   * Get all active budgets
   */
  async getActiveBudgets(): Promise<Budget[]> {
    const response = await fetch(`${API_BASE_URL}/budgets/active/list`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<Budget[]>(response);
  },

  /**
   * Create a new budget
   */
  async createBudget(data: CreateBudgetDto): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<Budget>(response);
  },

  /**
   * Update an existing budget
   */
  async updateBudget(id: string, data: UpdateBudgetDto): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<Budget>(response);
  },

  /**
   * Delete a budget (soft delete)
   */
  async deleteBudget(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleResponse<void>(response);
  },
};

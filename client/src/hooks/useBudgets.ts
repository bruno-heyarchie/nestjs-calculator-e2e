import { useState, useEffect, useCallback } from 'react';
import {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetQueryParams,
  PaginatedBudgetResponse,
} from '../types/budget.types';
import { budgetApi } from '../services/budgetApi';

interface UseBudgetsReturn {
  budgets: Budget[];
  budget: Budget | null;
  loading: boolean;
  error: string | null;
  meta: PaginatedBudgetResponse['meta'] | null;
  fetchBudgets: (params?: BudgetQueryParams) => Promise<void>;
  fetchBudgetById: (id: string) => Promise<void>;
  fetchActiveBudgets: () => Promise<void>;
  createBudget: (data: CreateBudgetDto) => Promise<Budget | null>;
  updateBudget: (id: string, data: UpdateBudgetDto) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for budget operations with optimistic updates
 */
export const useBudgets = (): UseBudgetsReturn => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginatedBudgetResponse['meta'] | null>(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch all budgets with optional filtering and pagination
   */
  const fetchBudgets = useCallback(async (params?: BudgetQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await budgetApi.getBudgets(params);
      setBudgets(response.data);
      setMeta(response.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budgets';
      setError(errorMessage);
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single budget by ID
   */
  const fetchBudgetById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedBudget = await budgetApi.getBudgetById(id);
      setBudget(fetchedBudget);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget';
      setError(errorMessage);
      console.error('Error fetching budget:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch active budgets
   */
  const fetchActiveBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const activeBudgets = await budgetApi.getActiveBudgets();
      setBudgets(activeBudgets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active budgets';
      setError(errorMessage);
      console.error('Error fetching active budgets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new budget with optimistic update
   */
  const createBudget = useCallback(async (data: CreateBudgetDto): Promise<Budget | null> => {
    setLoading(true);
    setError(null);

    try {
      const newBudget = await budgetApi.createBudget(data);

      // Optimistic update: add the new budget to the list
      setBudgets((prev) => [newBudget, ...prev]);

      return newBudget;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget';
      setError(errorMessage);
      console.error('Error creating budget:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing budget with optimistic update
   */
  const updateBudget = useCallback(async (
    id: string,
    data: UpdateBudgetDto
  ): Promise<Budget | null> => {
    setLoading(true);
    setError(null);

    // Store previous state for rollback
    const previousBudgets = [...budgets];
    const previousBudget = budget;

    // Optimistic update: update the budget in the list
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b))
    );

    if (budget && budget.id === id) {
      setBudget({ ...budget, ...data });
    }

    try {
      const updatedBudget = await budgetApi.updateBudget(id, data);

      // Update with actual server response
      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? updatedBudget : b))
      );

      if (budget && budget.id === id) {
        setBudget(updatedBudget);
      }

      return updatedBudget;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update budget';
      setError(errorMessage);
      console.error('Error updating budget:', err);

      // Rollback optimistic update
      setBudgets(previousBudgets);
      setBudget(previousBudget);

      return null;
    } finally {
      setLoading(false);
    }
  }, [budgets, budget]);

  /**
   * Delete a budget with optimistic update
   */
  const deleteBudget = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Store previous state for rollback
    const previousBudgets = [...budgets];

    // Optimistic update: remove the budget from the list
    setBudgets((prev) => prev.filter((b) => b.id !== id));

    if (budget && budget.id === id) {
      setBudget(null);
    }

    try {
      await budgetApi.deleteBudget(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget';
      setError(errorMessage);
      console.error('Error deleting budget:', err);

      // Rollback optimistic update
      setBudgets(previousBudgets);

      return false;
    } finally {
      setLoading(false);
    }
  }, [budgets, budget]);

  return {
    budgets,
    budget,
    loading,
    error,
    meta,
    fetchBudgets,
    fetchBudgetById,
    fetchActiveBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    clearError,
  };
};

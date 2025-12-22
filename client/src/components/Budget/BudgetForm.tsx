import React, { useState, useEffect } from 'react';
import { Budget, BudgetPeriod, CreateBudgetDto, UpdateBudgetDto } from '../../types/budget.types';

interface BudgetFormProps {
  budget?: Budget | null;
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: CreateBudgetDto | UpdateBudgetDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  amount?: string;
  startDate?: string;
  endDate?: string;
  alertThreshold?: string;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    description: budget?.description || '',
    amount: budget?.amount?.toString() || '',
    period: budget?.period || BudgetPeriod.MONTHLY,
    startDate: budget?.startDate ? budget.startDate.split('T')[0] : '',
    endDate: budget?.endDate ? budget.endDate.split('T')[0] : '',
    isActive: budget?.isActive ?? true,
    alertEnabled: budget?.alertEnabled ?? true,
    alertThreshold: budget?.alertThreshold?.toString() || '80',
    categoryId: budget?.categoryId || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Budget name must be less than 255 characters';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (amount > 9999999.99) {
      newErrors.amount = 'Amount must be less than 10,000,000';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    const threshold = parseInt(formData.alertThreshold);
    if (formData.alertEnabled && (isNaN(threshold) || threshold < 1 || threshold > 100)) {
      newErrors.alertThreshold = 'Alert threshold must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      alertEnabled: formData.alertEnabled,
      alertThreshold: parseInt(formData.alertThreshold),
      categoryId: formData.categoryId || undefined,
    };

    await onSubmit(submitData);
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Format currency for display
  const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {budget ? 'Edit Budget' : 'Create New Budget'}
      </h2>

      {/* Budget Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Monthly Groceries"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional description of your budget..."
          disabled={isLoading}
        />
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Period */}
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Period <span className="text-red-500">*</span>
        </label>
        <select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value={BudgetPeriod.DAILY}>Daily</option>
          <option value={BudgetPeriod.WEEKLY}>Weekly</option>
          <option value={BudgetPeriod.MONTHLY}>Monthly</option>
          <option value={BudgetPeriod.QUARTERLY}>Quarterly</option>
          <option value={BudgetPeriod.YEARLY}>Yearly</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active Budget
        </label>
      </div>

      {/* Alert Settings */}
      <div className="border-t pt-4">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="alertEnabled"
            name="alertEnabled"
            checked={formData.alertEnabled}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="alertEnabled" className="ml-2 block text-sm font-medium text-gray-700">
            Enable Budget Alerts
          </label>
        </div>

        {formData.alertEnabled && (
          <div>
            <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-700 mb-1">
              Alert Threshold (%)
            </label>
            <input
              type="number"
              id="alertThreshold"
              name="alertThreshold"
              value={formData.alertThreshold}
              onChange={handleChange}
              min="1"
              max="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.alertThreshold ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.alertThreshold && (
              <p className="mt-1 text-sm text-red-500">{errors.alertThreshold}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              You'll be notified when spending reaches {formData.alertThreshold}% of your budget
            </p>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
};

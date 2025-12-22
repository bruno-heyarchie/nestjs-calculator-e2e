import React from 'react';
import { Budget } from '../../types/budget.types';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onClick?: (budget: Budget) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
  onClick,
}) => {
  const percentageSpent = budget.amount > 0 ? (budget.spentAmount / budget.amount) * 100 : 0;
  const remaining = budget.amount - budget.spentAmount;

  // Determine progress bar color based on percentage
  const getProgressColor = (): string => {
    if (percentageSpent >= 100) return 'bg-red-500';
    if (percentageSpent >= budget.alertThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Determine status badge color
  const getStatusColor = (): string => {
    if (!budget.isActive) return 'bg-gray-200 text-gray-700';
    if (percentageSpent >= 100) return 'bg-red-100 text-red-700';
    if (percentageSpent >= budget.alertThreshold) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get period display text
  const getPeriodText = (): string => {
    return budget.period.charAt(0).toUpperCase() + budget.period.slice(1);
  };

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onClick) {
      onClick(budget);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{budget.name}</h3>
          {budget.category && (
            <span className="inline-flex items-center text-sm text-gray-600">
              {budget.category.icon && <span className="mr-1">{budget.category.icon}</span>}
              {budget.category.name}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {budget.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Description */}
      {budget.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{budget.description}</p>
      )}

      {/* Budget Amount Info */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium text-gray-800">
            {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.amount)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{percentageSpent.toFixed(1)}% used</span>
          <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            {remaining >= 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))}
            {remaining >= 0 ? ' remaining' : ' over budget'}
          </span>
        </div>
      </div>

      {/* Period and Date Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{getPeriodText()}</span>
        </div>
        <span>
          {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
        </span>
      </div>

      {/* Alert Status */}
      {budget.alertEnabled && (
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span>Alert at {budget.alertThreshold}%</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(budget);
          }}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete "${budget.name}"?`)) {
              onDelete(budget.id);
            }
          }}
          className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

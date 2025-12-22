import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BudgetService } from '../budget.service';

/**
 * Guard to verify that a user owns the budget they're trying to access
 * Checks if the budget ID in the request params belongs to the authenticated user
 */
@Injectable()
export class BudgetOwnershipGuard implements CanActivate {
  constructor(private readonly budgetService: BudgetService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const budgetId = request.params.id;

    // Check if user is authenticated (should be handled by auth guard)
    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if budget ID is present in params
    if (!budgetId) {
      return true; // Let the controller handle missing ID
    }

    // Verify budget ownership
    const belongsToUser = await this.budgetService.belongsToUser(
      budgetId,
      user.id,
    );

    if (!belongsToUser) {
      throw new ForbiddenException(
        'You do not have permission to access this budget',
      );
    }

    return true;
  }
}

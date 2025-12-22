import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the current authenticated user from the request
 * Used with authentication middleware/guards
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentUser() user: any) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested, return that property
    if (data && user) {
      return user[data];
    }

    // Return the entire user object
    return user;
  },
);

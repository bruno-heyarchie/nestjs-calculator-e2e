import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for public routes (bypasses rate limiting if needed)
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public
 * Can be used to bypass guards or apply different rate limiting
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * getHealth() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

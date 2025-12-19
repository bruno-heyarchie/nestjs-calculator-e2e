import { SkipThrottle as NestSkipThrottle } from '@nestjs/throttler';

/**
 * Re-export of @nestjs/throttler SkipThrottle decorator
 * Allows routes to bypass rate limiting
 *
 * @param skip - Whether to skip throttling (default: true)
 *
 * @example
 * ```typescript
 * @SkipThrottle()
 * @Get('health')
 * getHealth() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const SkipThrottle = NestSkipThrottle;

/**
 * Metadata key for throttle skip
 */
export const THROTTLE_SKIP_KEY = 'throttle_skip';

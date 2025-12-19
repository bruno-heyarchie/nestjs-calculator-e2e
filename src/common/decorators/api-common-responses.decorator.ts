import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';

/**
 * Combined decorator for common API error responses
 * Applies standard error response documentation to endpoints
 *
 * @example
 * ```typescript
 * @ApiCommonResponses()
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export function ApiCommonResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request - Invalid input parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
            example: 'Validation failed',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiTooManyRequestsResponse({
      description: 'Too Many Requests - Rate limit exceeded',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 429 },
          message: {
            type: 'string',
            example: 'ThrottlerException: Too Many Requests',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error - Unexpected server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
}

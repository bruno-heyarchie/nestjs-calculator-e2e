import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

/**
 * Generic class for paginated responses
 */
export class PaginatedDto<T> {
  @ApiProperty({ description: 'Array of data items' })
  data!: T[];

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total!: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages!: number;
}

/**
 * Decorator for paginated API responses
 * Generates Swagger documentation for paginated endpoints
 *
 * @param dataDto - The DTO class for individual items
 *
 * @example
 * ```typescript
 * @ApiPaginatedResponse(UserDto)
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  dataDto: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successfully retrieved paginated data',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: `#/components/schemas/${dataDto.name}` },
              },
              total: { type: 'number', example: 100 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 10 },
            },
          },
        ],
      },
    }),
  );
};

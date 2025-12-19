import { ApiProperty } from '@nestjs/swagger';

/**
 * Error response DTO for Swagger documentation
 * Represents the standardized error format returned by the API
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'ISO 8601 timestamp when the error occurred',
    example: '2024-01-15T10:30:45.123Z',
    type: String,
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Request URL path that caused the error',
    example: '/calculator/divide',
    type: String,
  })
  path!: string;

  @ApiProperty({
    description: 'HTTP method used for the request',
    example: 'POST',
    type: String,
  })
  method!: string;

  @ApiProperty({
    description: 'Error message or array of validation errors',
    example: 'Division by zero is not allowed',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message!: string | string[];

  @ApiProperty({
    description: 'Error type/category',
    example: 'Calculator Error',
    type: String,
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Specific error code for programmatic handling',
    example: 'DIVISION_BY_ZERO',
    type: String,
    required: false,
  })
  errorCode?: string;

  @ApiProperty({
    description: 'Human-readable error description',
    example: 'Attempted to divide a number by zero',
    type: String,
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The operation that caused the error',
    example: 'division',
    type: String,
    required: false,
  })
  operation?: string;

  @ApiProperty({
    description: 'Additional details about the error',
    example: '10 / 0',
    type: String,
    required: false,
  })
  details?: string;
}

/**
 * Validation error response DTO for Swagger documentation
 * Represents the error format for validation failures
 */
export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'ISO 8601 timestamp when the error occurred',
    example: '2024-01-15T10:30:45.123Z',
    type: String,
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Request URL path that caused the error',
    example: '/calculator/add',
    type: String,
  })
  path!: string;

  @ApiProperty({
    description: 'HTTP method used for the request',
    example: 'POST',
    type: String,
  })
  method!: string;

  @ApiProperty({
    description: 'Array of validation error messages',
    example: [
      'a must be a number conforming to the specified constraints',
      'b must be a number conforming to the specified constraints',
    ],
    type: [String],
  })
  message!: string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Validation Error',
    type: String,
  })
  error!: string;
}

/**
 * Division by zero error response DTO for Swagger documentation
 */
export class DivisionByZeroErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'ISO 8601 timestamp when the error occurred',
    example: '2024-01-15T10:30:45.123Z',
    type: String,
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Request URL path',
    example: '/calculator/divide',
    type: String,
  })
  path!: string;

  @ApiProperty({
    description: 'HTTP method used',
    example: 'POST',
    type: String,
  })
  method!: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Division by zero is not allowed',
    type: String,
  })
  message!: string;

  @ApiProperty({
    description: 'Error code',
    example: 'DIVISION_BY_ZERO',
    type: String,
  })
  errorCode!: string;

  @ApiProperty({
    description: 'Error category',
    example: 'Calculator Error',
    type: String,
  })
  error!: string;

  @ApiProperty({
    description: 'Human-readable description',
    example: 'Attempted to divide a number by zero',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: 'The operation that failed',
    example: 'division',
    type: String,
  })
  operation!: string;

  @ApiProperty({
    description: 'Additional error details',
    example: '10 / 0',
    type: String,
    required: false,
  })
  details?: string;
}

# OpenAPI/Swagger Documentation Guide

## Overview

This project uses OpenAPI 3.0 (via Swagger) for comprehensive API documentation. The Swagger UI provides an interactive interface to explore and test all API endpoints.

## Accessing the Documentation

### Development Environment
When running the application in development mode:
```bash
npm run start:dev
```

Access the Swagger UI at: **http://localhost:3000/api**

### Staging Environment
When running in staging mode:
```bash
npm run start:staging
```

Access the Swagger UI at: **http://staging.yourdomain.com/api** (or configured staging URL)

### Production Environment
For security reasons, Swagger documentation is **disabled in production** by default.

## Configuration

### Environment Variables

The Swagger documentation can be configured using the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SWAGGER_ENABLED` | Enable/disable Swagger UI | `true` in dev/staging | No |
| `SWAGGER_TITLE` | API documentation title | `Calculator API` | No |
| `SWAGGER_DESCRIPTION` | API description | Auto-generated | No |
| `SWAGGER_PATH` | URL path for Swagger UI | `api` | No |
| `API_BASE_URL` | Base URL for API server | `http://localhost:3000` | No |
| `SUPPORT_EMAIL` | Contact email for API support | `support@example.com` | No |
| `APP_VERSION` | API version number | `1.0` | No |

### Configuration Files

1. **`src/config/swagger.config.ts`**: Main Swagger configuration file
   - Defines Swagger setup logic
   - Manages environment-specific settings
   - Configures Swagger UI options

2. **`src/main.ts`**: Bootstrap file that initializes Swagger
   - Calls `setupSwagger(app)` to initialize documentation
   - Only enables Swagger in allowed environments

### Security Settings

Swagger is automatically enabled/disabled based on the environment:

- ✅ **Enabled**: `NODE_ENV=development` or `DEPLOYMENT_ENV=staging`
- ❌ **Disabled**: `NODE_ENV=production` (unless explicitly enabled with `SWAGGER_ENABLED=true`)

This ensures API documentation is not exposed in production for security reasons.

## Features

### Interactive API Testing
- Try out API endpoints directly from the browser
- Automatic request/response examples
- Request validation and error handling demonstrations

### Comprehensive Documentation
- All endpoints documented with descriptions
- Request parameter specifications
- Response schema definitions
- Error response examples
- Support for both GET and POST methods

### API Tags
Endpoints are organized by functional tags:
- **application**: Application-level endpoints
- **calculator**: Calculator arithmetic operations
- **health**: Health check and monitoring endpoints
- **categories**: Expense categories management
- **expenses**: Expense tracking operations
- **budgets**: Budget management

### Authentication Configuration
The Swagger UI is configured to persist authentication credentials across sessions using `persistAuthorization: true`.

### Custom Styling
The Swagger UI includes custom CSS to:
- Hide the top navigation bar
- Improve spacing and readability
- Maintain consistent styling with the application

## API Documentation Structure

### OpenAPI Specification
The documentation follows OpenAPI 3.0 specification and includes:

1. **API Metadata**
   - Title and version
   - Contact information
   - License details (MIT)

2. **Server Configuration**
   - Base URL configuration
   - Environment-specific servers

3. **Endpoint Documentation**
   - HTTP methods (GET, POST, PUT, DELETE)
   - Path parameters
   - Query parameters
   - Request body schemas
   - Response schemas
   - Error responses

4. **Data Models**
   - DTO (Data Transfer Object) schemas
   - Entity definitions
   - Validation rules

## Using Swagger Decorators

### Controller-Level Decorators

```typescript
import { ApiTags } from '@nestjs/swagger';

@Controller('example')
@ApiTags('example')
export class ExampleController {}
```

### Endpoint-Level Decorators

```typescript
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@Get('endpoint')
@ApiOperation({
  summary: 'Short description',
  description: 'Detailed description of what this endpoint does'
})
@ApiQuery({
  name: 'param',
  type: Number,
  description: 'Parameter description',
  required: true,
  example: 42
})
@ApiResponse({
  status: 200,
  description: 'Success response description',
  type: ResponseDto
})
@ApiResponse({
  status: 400,
  description: 'Error response description'
})
endpoint(@Query() query: QueryDto) {}
```

### DTO-Level Decorators

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExampleDto {
  @ApiProperty({
    description: 'Field description',
    example: 42,
    type: Number
  })
  @IsNumber()
  field: number;
}
```

## Swagger UI Options

The Swagger UI is configured with the following options:

- **persistAuthorization**: `true` - Saves authentication tokens
- **docExpansion**: `list` - Shows operations collapsed by default
- **filter**: `true` - Enables endpoint filtering
- **showRequestDuration**: `true` - Displays request timing
- **tryItOutEnabled**: `true` - Enables "Try it out" by default

## Best Practices

1. **Always document new endpoints** with appropriate Swagger decorators
2. **Include examples** in `@ApiProperty`, `@ApiQuery`, and `@ApiBody` decorators
3. **Document all response codes** including error cases
4. **Use DTOs** for request/response documentation
5. **Keep descriptions clear and concise**
6. **Update version numbers** when making breaking changes
7. **Test documentation** by trying endpoints in Swagger UI

## Troubleshooting

### Swagger UI not loading
- Check that `SWAGGER_ENABLED=true` in your `.env` file
- Verify you're running in development or staging mode
- Check the application logs for Swagger initialization messages

### Endpoints not appearing
- Ensure controllers are properly imported in module files
- Verify `@ApiTags()` decorator is present on controllers
- Check that the module is imported in `AppModule`

### Authentication issues
- Verify authentication decorators are properly configured
- Check that JWT/auth configuration is correct in Swagger setup

## Additional Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## Maintenance

The Swagger configuration should be reviewed when:
- Adding new API endpoints
- Changing authentication mechanisms
- Updating API versions
- Modifying response structures
- Deploying to new environments

---

**Last Updated**: 2025-12-22
**Version**: 1.0.0

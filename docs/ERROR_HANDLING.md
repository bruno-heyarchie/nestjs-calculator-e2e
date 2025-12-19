# Mathematical Error Handling

## Overview

The NestJS Calculator API implements comprehensive mathematical error handling to provide meaningful feedback for invalid operations and edge cases. This document describes the error handling architecture, available exception types, and how errors are logged and reported.

## Architecture

The error handling system consists of three main components:

1. **Custom Exception Classes** - Typed exceptions for specific mathematical errors
2. **Exception Filter** - Centralized error handling and logging
3. **Error Codes** - Standardized error code enumeration

## Exception Classes

### Base Exception

**CalculatorException** - Base class for all calculator exceptions

```typescript
new CalculatorException(
  errorCode: CalculatorErrorCode,
  message: string,
  operation?: string,
  details?: string,
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST
)
```

All exceptions inherit from this base class and provide structured error information including:
- Error code (from CalculatorErrorCode enum)
- Human-readable message
- Operation context
- Additional details
- HTTP status code
- Timestamp
- Error description

### Division Errors

#### DivisionByZeroException

Thrown when attempting to divide by zero.

```typescript
throw new DivisionByZeroException(numerator?: number);
```

- **Error Code**: `CALC_001`
- **HTTP Status**: 400 Bad Request
- **Operation**: `division`

**Example**:
```typescript
// Throws: Division by zero is not allowed
service.divide(10, 0);
```

#### ModuloByZeroException

Thrown when attempting to take modulo by zero.

```typescript
throw new ModuloByZeroException(dividend?: number);
```

- **Error Code**: `CALC_002`
- **HTTP Status**: 400 Bad Request
- **Operation**: `modulo`

### Overflow/Underflow Errors

#### OverflowException

Thrown when an operation result exceeds `Number.MAX_SAFE_INTEGER`.

```typescript
throw new OverflowException(operation: string, details?: string);
```

- **Error Code**: `CALC_101`
- **HTTP Status**: 400 Bad Request
- **Details**: Includes the actual result value and the exceeded limit

**Example**:
```typescript
// Throws: Operation resulted in overflow
service.add(Number.MAX_SAFE_INTEGER, 1);
```

#### UnderflowException

Thrown when an operation result is below `Number.MIN_SAFE_INTEGER`.

```typescript
throw new UnderflowException(operation: string, details?: string);
```

- **Error Code**: `CALC_102`
- **HTTP Status**: 400 Bad Request
- **Details**: Includes the actual result value and the minimum limit

### Invalid Result Errors

#### InvalidResultException

Thrown when an operation produces an invalid result (NaN, Infinity, -Infinity).

```typescript
throw new InvalidResultException(operation: string, reason: string);
```

- **Error Code**: `CALC_201`
- **HTTP Status**: 400 Bad Request

**Example**:
```typescript
// Throws: Invalid result: Result is positive infinity
service.power(10, 1000);
```

### Invalid Operation Errors

#### InvalidOperationException

Thrown when attempting an invalid mathematical operation.

```typescript
throw new InvalidOperationException(
  operation: string,
  reason: string,
  errorCode?: CalculatorErrorCode
);
```

- **Default Error Code**: `CALC_301`
- **HTTP Status**: 400 Bad Request

**Examples**:
```typescript
// Square root of negative number
// Throws: Cannot calculate square root of negative number
service.sqrt(-16);

// Factorial of negative number
// Throws: Cannot calculate factorial of negative number
service.factorial(-5);

// Factorial of non-integer
// Throws: Factorial can only be calculated for integer values
service.factorial(3.14);

// Factorial input too large
// Throws: Input too large (maximum is 170)
service.factorial(200);
```

### Invalid Operand Errors

#### InvalidOperandException

Thrown when operand validation fails.

```typescript
throw new InvalidOperandException(
  operandName: string,
  reason: string,
  errorCode?: CalculatorErrorCode
);
```

- **Default Error Code**: `CALC_401`
- **HTTP Status**: 400 Bad Request

**Examples**:
```typescript
// Throws: Operand cannot be NaN
service.add(NaN, 5);

// Throws: Operand must be a finite number
service.multiply(Infinity, 2);
```

### Validation Errors

#### ValidationException

Thrown for general input validation errors.

```typescript
throw new ValidationException(message: string, details?: string);
```

- **Error Code**: `CALC_501`
- **HTTP Status**: 400 Bad Request

### System Errors

#### UnexpectedException

Thrown for unexpected system errors.

```typescript
throw new UnexpectedException(message: string, details?: string);
```

- **Error Code**: `CALC_999`
- **HTTP Status**: 500 Internal Server Error

## Error Codes

All error codes follow the format `CALC_XXX` where the first digit indicates the category:

| Code Range | Category |
|------------|----------|
| CALC_001-099 | Division errors |
| CALC_101-199 | Overflow/Underflow errors |
| CALC_201-299 | Invalid result errors |
| CALC_301-399 | Invalid operation errors |
| CALC_401-499 | Invalid operand errors |
| CALC_501-599 | Validation errors |
| CALC_999 | System errors |

### Complete Error Code List

```typescript
enum CalculatorErrorCode {
  // Division errors
  DIVISION_BY_ZERO = 'CALC_001',
  MODULO_BY_ZERO = 'CALC_002',

  // Overflow/Underflow errors
  OVERFLOW_ERROR = 'CALC_101',
  UNDERFLOW_ERROR = 'CALC_102',

  // Invalid result errors
  INVALID_RESULT = 'CALC_201',
  RESULT_NOT_FINITE = 'CALC_202',

  // Invalid operation errors
  INVALID_OPERATION = 'CALC_301',
  NEGATIVE_SQUARE_ROOT = 'CALC_302',
  NEGATIVE_FACTORIAL = 'CALC_303',
  NON_INTEGER_FACTORIAL = 'CALC_304',
  FACTORIAL_INPUT_TOO_LARGE = 'CALC_305',

  // Invalid operand errors
  INVALID_OPERAND = 'CALC_401',
  OPERAND_NOT_NUMBER = 'CALC_402',
  OPERAND_IS_NAN = 'CALC_403',
  OPERAND_NOT_FINITE = 'CALC_404',
  OPERAND_NOT_INTEGER = 'CALC_405',

  // Validation errors
  VALIDATION_ERROR = 'CALC_501',

  // System errors
  UNEXPECTED_ERROR = 'CALC_999',
}
```

## Error Response Format

All errors return a consistent JSON response structure:

```json
{
  "statusCode": 400,
  "errorCode": "CALC_001",
  "message": "Division by zero is not allowed",
  "description": "Division by zero is not mathematically defined",
  "operation": "division",
  "details": "10 / 0",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "error": "Calculator Error",
  "path": "/api/calculator/divide",
  "method": "POST"
}
```

### Response Fields

- **statusCode** - HTTP status code (400 or 500)
- **errorCode** - Unique error code identifier
- **message** - Brief error message
- **description** - Detailed error description
- **operation** - The mathematical operation that failed
- **details** - Additional context (optional)
- **timestamp** - ISO 8601 timestamp
- **error** - Error category ("Calculator Error")
- **path** - Request path
- **method** - HTTP method

## Exception Filter

The `MathExceptionFilter` provides comprehensive error handling and logging.

### Features

1. **Comprehensive Logging** - Logs all mathematical errors with full context
2. **Request Metadata Tracking** - Captures IP, user-agent, correlation ID
3. **Sensitive Data Sanitization** - Redacts passwords, tokens, and secrets from logs
4. **Structured Logging** - Outputs JSON for log aggregation systems
5. **Consistent Error Responses** - Standardized error format for API clients

### Log Format

Errors are logged with the following context:

```
Mathematical error in division operation - Error Code: CALC_001 - Message: Division by zero is not allowed - Path: /api/calculator/divide - Method: POST - Status: 400 - Details: 10 / 0 - Request: {"a":10,"b":0} - IP: 192.168.1.100 - Correlation ID: abc-123-def-456
```

### Sensitive Data Sanitization

The filter automatically redacts sensitive fields from request bodies before logging:

- password
- token
- secret
- apiKey
- api_key

Example:
```json
{
  "operation": "add",
  "a": 10,
  "b": 20,
  "apiKey": "***REDACTED***"
}
```

## Error Detection

### Overflow/Underflow Detection

The calculator service validates all operation results against safe integer limits:

```typescript
private readonly MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 9007199254740991
private readonly MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER; // -9007199254740991
```

Operations that produce results outside this range throw `OverflowException` or `UnderflowException`.

### Infinity Detection

Results of `Infinity` or `-Infinity` are detected and throw `InvalidResultException`:

```typescript
// Detected cases:
- Division resulting in Infinity
- Power operations with very large exponents
- Multiplication of extremely large numbers
```

### NaN Detection

`NaN` (Not a Number) values are detected in two places:

1. **Input Validation** - Operands are validated before operations
2. **Result Validation** - Results are checked after operations

### Integer Validation

Certain operations require integer inputs (factorial, etc.):

```typescript
if (!Number.isInteger(n)) {
  throw new InvalidOperandException('Operand', 'must be an integer');
}
```

## Best Practices

### Using Exceptions in Service Layer

```typescript
@Injectable()
export class CalculatorService {
  divide(a: number, b: number): number {
    // 1. Validate operands
    this.validateOperands(a, b);

    // 2. Check for specific edge cases
    if (b === 0) {
      this.logger.error(`Division by zero attempted: ${a} / 0`);
      throw new DivisionByZeroException();
    }

    // 3. Perform operation
    const result = a / b;

    // 4. Validate result
    this.validateResultRange(result, 'division');

    // 5. Log success and return
    this.logger.debug(`Division: ${a} / ${b} = ${result}`);
    return result;
  }
}
```

### Applying the Exception Filter

Register the filter in your controller:

```typescript
@Controller('calculator')
@UseFilters(MathExceptionFilter)
export class CalculatorController {
  // ... endpoints
}
```

Or apply globally in `main.ts`:

```typescript
app.useGlobalFilters(new MathExceptionFilter());
```

### Error Logging

All mathematical errors are automatically logged with:

1. **Error Level Log** - Comprehensive error details
2. **Debug Level Log** - Structured JSON context

Configure log levels in your environment:

```bash
# Development - see all logs
LOG_LEVEL=debug

# Production - error logs only
LOG_LEVEL=error
```

## Testing Error Handling

### Unit Tests

Test that exceptions are thrown correctly:

```typescript
it('should throw DivisionByZeroException', () => {
  expect(() => service.divide(10, 0))
    .toThrow(DivisionByZeroException);
});

it('should throw OverflowException for large results', () => {
  expect(() => service.add(Number.MAX_SAFE_INTEGER, 1))
    .toThrow(OverflowException);
});
```

### Integration Tests

Test that error responses are formatted correctly:

```typescript
it('should return proper error response for division by zero', async () => {
  const response = await request(app.getHttpServer())
    .post('/calculator/divide')
    .send({ a: 10, b: 0 })
    .expect(400);

  expect(response.body).toMatchObject({
    statusCode: 400,
    errorCode: 'CALC_001',
    message: 'Division by zero is not allowed',
    operation: 'division',
  });
});
```

## Monitoring and Observability

### Error Metrics

Track the following metrics in production:

1. **Error Rate** - Number of mathematical errors per minute
2. **Error Code Distribution** - Which error codes occur most frequently
3. **Operation Failures** - Which operations fail most often
4. **Response Times** - Latency of error handling

### Log Aggregation

The structured error logging supports aggregation in tools like:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **CloudWatch Logs**

Query example:
```
errorCode:CALC_001 AND path:/calculator/divide
```

### Correlation IDs

Pass correlation IDs in request headers for distributed tracing:

```bash
curl -X POST https://api.example.com/calculator/divide \
  -H "X-Correlation-ID: abc-123-def-456" \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":0}'
```

The correlation ID is automatically included in error logs.

## Migration Guide

### From Legacy MathematicalError

The legacy `MathematicalError` class is deprecated. Migrate to the new exception classes:

**Before**:
```typescript
throw new MathematicalError('division', 'Division by zero');
```

**After**:
```typescript
throw new DivisionByZeroException();
```

Benefits:
- Standardized error codes
- Better type safety
- Consistent error descriptions
- Enhanced logging context

## Related Documentation

- [API Documentation](./API.md)
- [Development Guide](../DEVELOPMENT.md)
- [Testing Guide](../test/README.md)

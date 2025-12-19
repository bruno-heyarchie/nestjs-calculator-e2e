# API Documentation Guide

Complete reference for the Calculator REST API including all endpoints, request/response formats, and usage examples.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Configure via environment variables

## Interactive Documentation

Access Swagger UI at: `http://localhost:3000/api`

## API Endpoints

### Health Check

```http
GET /
GET /health
```

Returns API health status.

### Calculator Operations

All operations support both GET (query params) and POST (JSON body) methods.

#### Addition
```http
GET /calculator/add?a=5&b=3
POST /calculator/add
```

#### Subtraction
```http
GET /calculator/subtract?a=10&b=3
POST /calculator/subtract
```

#### Multiplication
```http
GET /calculator/multiply?a=6&b=7
POST /calculator/multiply
```

#### Division
```http
GET /calculator/divide?a=20&b=4
POST /calculator/divide
```

## Request Format

### GET Request
```bash
curl "http://localhost:3000/calculator/add?a=5&b=3"
```

### POST Request
```bash
curl -X POST http://localhost:3000/calculator/add \
  -H "Content-Type: application/json" \
  -d '{"a":5,"b":3}'
```

## Response Format

Success response:
```json
{
  "operation": "addition",
  "a": 5,
  "b": 3,
  "result": 8
}
```

Error response:
```json
{
  "statusCode": 400,
  "message": "Division by zero is not allowed",
  "error": "Bad Request"
}
```

## Error Handling

The API validates all inputs and returns appropriate error messages:
- Invalid numbers
- Division by zero
- Missing parameters
- Non-finite values (NaN, Infinity)

## Code Examples

### JavaScript
```javascript
const response = await fetch('http://localhost:3000/calculator/add?a=5&b=3');
const data = await response.json();
console.log(data.result); // 8
```

### Python
```python
import requests
response = requests.get('http://localhost:3000/calculator/add', params={'a': 5, 'b': 3})
print(response.json()['result'])  # 8
```

## Resources

- Interactive Swagger UI: `http://localhost:3000/api`
- OpenAPI Specification: `http://localhost:3000/api-json`
- [NestJS Documentation](https://docs.nestjs.com)

import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  DivisionByZeroErrorResponseDto,
} from './error-response.dto';

describe('ErrorResponseDto', () => {
  describe('ErrorResponseDto', () => {
    it('should create an instance with all required fields', () => {
      const dto = new ErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'Division by zero is not allowed';

      expect(dto.statusCode).toBe(400);
      expect(dto.timestamp).toBe('2024-01-15T10:30:45.123Z');
      expect(dto.path).toBe('/calculator/divide');
      expect(dto.method).toBe('POST');
      expect(dto.message).toBe('Division by zero is not allowed');
    });

    it('should support message as string', () => {
      const dto = new ErrorResponseDto();
      dto.message = 'Single error message';

      expect(typeof dto.message).toBe('string');
      expect(dto.message).toBe('Single error message');
    });

    it('should support message as array of strings', () => {
      const dto = new ErrorResponseDto();
      dto.message = ['Error 1', 'Error 2', 'Error 3'];

      expect(Array.isArray(dto.message)).toBe(true);
      expect(dto.message).toHaveLength(3);
      expect(dto.message[0]).toBe('Error 1');
    });

    it('should include optional error field', () => {
      const dto = new ErrorResponseDto();
      dto.error = 'Calculator Error';

      expect(dto.error).toBe('Calculator Error');
    });

    it('should include optional errorCode field', () => {
      const dto = new ErrorResponseDto();
      dto.errorCode = 'DIVISION_BY_ZERO';

      expect(dto.errorCode).toBe('DIVISION_BY_ZERO');
    });

    it('should include optional description field', () => {
      const dto = new ErrorResponseDto();
      dto.description = 'Attempted to divide a number by zero';

      expect(dto.description).toBe('Attempted to divide a number by zero');
    });

    it('should include optional operation field', () => {
      const dto = new ErrorResponseDto();
      dto.operation = 'division';

      expect(dto.operation).toBe('division');
    });

    it('should include optional details field', () => {
      const dto = new ErrorResponseDto();
      dto.details = '10 / 0';

      expect(dto.details).toBe('10 / 0');
    });

    it('should create complete error response', () => {
      const dto = new ErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'Division by zero is not allowed';
      dto.error = 'Calculator Error';
      dto.errorCode = 'DIVISION_BY_ZERO';
      dto.description = 'Attempted to divide a number by zero';
      dto.operation = 'division';
      dto.details = '10 / 0';

      expect(dto).toHaveProperty('statusCode');
      expect(dto).toHaveProperty('timestamp');
      expect(dto).toHaveProperty('path');
      expect(dto).toHaveProperty('method');
      expect(dto).toHaveProperty('message');
      expect(dto).toHaveProperty('error');
      expect(dto).toHaveProperty('errorCode');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('operation');
      expect(dto).toHaveProperty('details');
    });
  });

  describe('ValidationErrorResponseDto', () => {
    it('should create an instance with all required fields', () => {
      const dto = new ValidationErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/add';
      dto.method = 'POST';
      dto.message = [
        'a must be a number conforming to the specified constraints',
        'b must be a number conforming to the specified constraints',
      ];
      dto.error = 'Validation Error';

      expect(dto.statusCode).toBe(400);
      expect(dto.timestamp).toBe('2024-01-15T10:30:45.123Z');
      expect(dto.path).toBe('/calculator/add');
      expect(dto.method).toBe('POST');
      expect(Array.isArray(dto.message)).toBe(true);
      expect(dto.message).toHaveLength(2);
      expect(dto.error).toBe('Validation Error');
    });

    it('should have message as array type', () => {
      const dto = new ValidationErrorResponseDto();
      dto.message = ['Validation error 1', 'Validation error 2'];

      expect(Array.isArray(dto.message)).toBe(true);
      expect(dto.message[0]).toBe('Validation error 1');
      expect(dto.message[1]).toBe('Validation error 2');
    });

    it('should handle single validation error', () => {
      const dto = new ValidationErrorResponseDto();
      dto.message = ['a must be a number'];

      expect(dto.message).toHaveLength(1);
      expect(dto.message[0]).toBe('a must be a number');
    });

    it('should handle multiple validation errors', () => {
      const dto = new ValidationErrorResponseDto();
      dto.message = [
        'a must be a number',
        'b must be a number',
        'a must not be empty',
        'b must not be empty',
      ];

      expect(dto.message).toHaveLength(4);
    });

    it('should have all required properties', () => {
      const dto = new ValidationErrorResponseDto();

      expect(dto).toHaveProperty('statusCode');
      expect(dto).toHaveProperty('timestamp');
      expect(dto).toHaveProperty('path');
      expect(dto).toHaveProperty('method');
      expect(dto).toHaveProperty('message');
      expect(dto).toHaveProperty('error');
    });
  });

  describe('DivisionByZeroErrorResponseDto', () => {
    it('should create an instance with all required fields', () => {
      const dto = new DivisionByZeroErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'Division by zero is not allowed';
      dto.errorCode = 'DIVISION_BY_ZERO';
      dto.error = 'Calculator Error';
      dto.description = 'Attempted to divide a number by zero';
      dto.operation = 'division';

      expect(dto.statusCode).toBe(400);
      expect(dto.timestamp).toBe('2024-01-15T10:30:45.123Z');
      expect(dto.path).toBe('/calculator/divide');
      expect(dto.method).toBe('POST');
      expect(dto.message).toBe('Division by zero is not allowed');
      expect(dto.errorCode).toBe('DIVISION_BY_ZERO');
      expect(dto.error).toBe('Calculator Error');
      expect(dto.description).toBe('Attempted to divide a number by zero');
      expect(dto.operation).toBe('division');
    });

    it('should include optional details field', () => {
      const dto = new DivisionByZeroErrorResponseDto();
      dto.details = '10 / 0';

      expect(dto.details).toBe('10 / 0');
    });

    it('should support different division by zero scenarios', () => {
      const dto = new DivisionByZeroErrorResponseDto();
      dto.statusCode = 400;
      dto.path = '/calculator/divide';
      dto.method = 'GET';
      dto.message = 'Division by zero is not allowed';
      dto.errorCode = 'DIVISION_BY_ZERO';
      dto.details = '5 / 0';

      expect(dto.details).toBe('5 / 0');
      expect(dto.method).toBe('GET');
    });

    it('should have all required properties', () => {
      const dto = new DivisionByZeroErrorResponseDto();

      expect(dto).toHaveProperty('statusCode');
      expect(dto).toHaveProperty('timestamp');
      expect(dto).toHaveProperty('path');
      expect(dto).toHaveProperty('method');
      expect(dto).toHaveProperty('message');
      expect(dto).toHaveProperty('errorCode');
      expect(dto).toHaveProperty('error');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('operation');
      expect(dto).toHaveProperty('details');
    });

    it('should create complete division by zero error response', () => {
      const dto = new DivisionByZeroErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'Division by zero is not allowed';
      dto.errorCode = 'DIVISION_BY_ZERO';
      dto.error = 'Calculator Error';
      dto.description = 'Attempted to divide a number by zero';
      dto.operation = 'division';
      dto.details = '100 / 0';

      expect(Object.keys(dto)).toContain('statusCode');
      expect(Object.keys(dto)).toContain('timestamp');
      expect(Object.keys(dto)).toContain('path');
      expect(Object.keys(dto)).toContain('method');
      expect(Object.keys(dto)).toContain('message');
      expect(Object.keys(dto)).toContain('errorCode');
      expect(Object.keys(dto)).toContain('error');
      expect(Object.keys(dto)).toContain('description');
      expect(Object.keys(dto)).toContain('operation');
      expect(Object.keys(dto)).toContain('details');
    });
  });

  describe('DTO property types', () => {
    it('should have correct types for ErrorResponseDto', () => {
      const dto = new ErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'test';

      expect(typeof dto.statusCode).toBe('number');
      expect(typeof dto.timestamp).toBe('string');
      expect(typeof dto.path).toBe('string');
      expect(typeof dto.method).toBe('string');
    });

    it('should have correct types for ValidationErrorResponseDto', () => {
      const dto = new ValidationErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/add';
      dto.method = 'POST';
      dto.message = ['error'];
      dto.error = 'Validation Error';

      expect(typeof dto.statusCode).toBe('number');
      expect(typeof dto.timestamp).toBe('string');
      expect(typeof dto.path).toBe('string');
      expect(typeof dto.method).toBe('string');
      expect(Array.isArray(dto.message)).toBe(true);
      expect(typeof dto.error).toBe('string');
    });

    it('should have correct types for DivisionByZeroErrorResponseDto', () => {
      const dto = new DivisionByZeroErrorResponseDto();
      dto.statusCode = 400;
      dto.timestamp = '2024-01-15T10:30:45.123Z';
      dto.path = '/calculator/divide';
      dto.method = 'POST';
      dto.message = 'Division by zero is not allowed';
      dto.errorCode = 'DIVISION_BY_ZERO';
      dto.error = 'Calculator Error';
      dto.description = 'test';
      dto.operation = 'division';

      expect(typeof dto.statusCode).toBe('number');
      expect(typeof dto.timestamp).toBe('string');
      expect(typeof dto.path).toBe('string');
      expect(typeof dto.method).toBe('string');
      expect(typeof dto.message).toBe('string');
      expect(typeof dto.errorCode).toBe('string');
      expect(typeof dto.error).toBe('string');
      expect(typeof dto.description).toBe('string');
      expect(typeof dto.operation).toBe('string');
    });
  });
});

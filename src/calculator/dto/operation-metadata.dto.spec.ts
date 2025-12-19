import { validate } from 'class-validator';
import { OperationMetadataDto } from './operation-metadata.dto';

describe('OperationMetadataDto', () => {
  describe('constructor', () => {
    it('should create an instance with all properties', () => {
      const timestamp = new Date().toISOString();
      const operationId = 'calc_123';
      const executionTimeMs = 1.5;
      const tags = ['arithmetic', 'basic'];
      const notes = 'Test operation';

      const dto = new OperationMetadataDto(
        timestamp,
        operationId,
        executionTimeMs,
        tags,
        notes,
      );

      expect(dto.timestamp).toBe(timestamp);
      expect(dto.operationId).toBe(operationId);
      expect(dto.executionTimeMs).toBe(executionTimeMs);
      expect(dto.tags).toEqual(tags);
      expect(dto.notes).toBe(notes);
    });

    it('should create an instance without parameters', () => {
      const dto = new OperationMetadataDto();

      expect(dto.timestamp).toBeUndefined();
      expect(dto.operationId).toBeUndefined();
      expect(dto.executionTimeMs).toBeUndefined();
      expect(dto.tags).toBeUndefined();
      expect(dto.notes).toBeUndefined();
    });

    it('should create an instance with required properties only', () => {
      const timestamp = new Date().toISOString();
      const operationId = 'calc_123';

      const dto = new OperationMetadataDto(timestamp, operationId);

      expect(dto.timestamp).toBe(timestamp);
      expect(dto.operationId).toBe(operationId);
      expect(dto.executionTimeMs).toBeUndefined();
      expect(dto.tags).toBeUndefined();
      expect(dto.notes).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should pass validation for a complete DTO', async () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        1.5,
        ['arithmetic'],
        'Test',
      );

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only required fields', async () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
      );

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when timestamp is invalid', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = 'invalid-date';
      dto.operationId = 'calc_123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timestamp');
    });

    it('should fail validation when operationId is not a string', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.operationId = 123 as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('operationId');
    });

    it('should pass validation when optional fields are missing', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.operationId = 'calc_123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when tags contain non-string values', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.operationId = 'calc_123';
      dto.tags = [123, 'valid'] as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass validation when tags is an array of strings', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.operationId = 'calc_123';
      dto.tags = ['arithmetic', 'basic', 'test'];

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when tags is an empty array', async () => {
      const dto = new OperationMetadataDto();
      dto.timestamp = '2025-12-19T10:30:00.000Z';
      dto.operationId = 'calc_123';
      dto.tags = [];

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('execution time handling', () => {
    it('should handle execution time in milliseconds', () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        0.5,
      );

      expect(dto.executionTimeMs).toBe(0.5);
    });

    it('should handle zero execution time', () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        0,
      );

      expect(dto.executionTimeMs).toBe(0);
    });

    it('should handle larger execution times', () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        100.456,
      );

      expect(dto.executionTimeMs).toBe(100.456);
    });
  });

  describe('tags handling', () => {
    it('should handle single tag', () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        undefined,
        ['arithmetic'],
      );

      expect(dto.tags).toEqual(['arithmetic']);
    });

    it('should handle multiple tags', () => {
      const tags = ['arithmetic', 'basic', 'binary', 'addition'];
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        undefined,
        tags,
      );

      expect(dto.tags).toEqual(tags);
    });
  });

  describe('notes handling', () => {
    it('should handle short notes', () => {
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        undefined,
        undefined,
        'Simple add',
      );

      expect(dto.notes).toBe('Simple add');
    });

    it('should handle longer notes', () => {
      const longNote =
        'This is a complex operation that requires detailed documentation of what happened during execution.';
      const dto = new OperationMetadataDto(
        '2025-12-19T10:30:00.000Z',
        'calc_123',
        undefined,
        undefined,
        longNote,
      );

      expect(dto.notes).toBe(longNote);
    });
  });
});

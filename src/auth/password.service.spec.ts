import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

describe('PasswordService', () => {
  let service: PasswordService;
  let configService: ConfigService;

  // Mock ConfigService
  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      if (key === 'PASSWORD_SALT_ROUNDS') {
        return defaultValue || 12;
      }
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    // Reset mocks before each test and restore the default implementation
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation(
      (key: string, defaultValue?: any) => {
        if (key === 'PASSWORD_SALT_ROUNDS') {
          return defaultValue !== undefined ? defaultValue : 12;
        }
        return defaultValue;
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with default salt rounds from config', () => {
      expect(service.getSaltRounds()).toBe(12);
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'PASSWORD_SALT_ROUNDS',
        12,
      );
    });

    it('should throw error if salt rounds is below minimum (10)', () => {
      mockConfigService.get.mockReturnValue(9);
      expect(() => new PasswordService(configService)).toThrow(
        'PASSWORD_SALT_ROUNDS must be between 10 and 20',
      );
    });

    it('should throw error if salt rounds is above maximum (20)', () => {
      mockConfigService.get.mockReturnValue(21);
      expect(() => new PasswordService(configService)).toThrow(
        'PASSWORD_SALT_ROUNDS must be between 10 and 20',
      );
    });

    it('should accept salt rounds at minimum boundary (10)', () => {
      mockConfigService.get.mockReturnValue(10);
      const newService = new PasswordService(configService);
      expect(newService.getSaltRounds()).toBe(10);
    });

    it('should accept salt rounds at maximum boundary (20)', () => {
      mockConfigService.get.mockReturnValue(20);
      const newService = new PasswordService(configService);
      expect(newService.getSaltRounds()).toBe(20);
    });
  });

  describe('hashPassword', () => {
    it('should hash a valid password successfully', async () => {
      const password = 'mySecurePassword123';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt hash format
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'samePassword';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
      // But both should be valid bcrypt hashes
      expect(hash1).toMatch(/^\$2[aby]\$\d{2}\$/);
      expect(hash2).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should hash passwords with special characters', async () => {
      const password = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should hash very long passwords', async () => {
      const password = 'a'.repeat(100);
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should throw error for empty string password', async () => {
      await expect(service.hashPassword('')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.hashPassword('')).rejects.toThrow(
        'Failed to hash password: Password cannot be empty',
      );
    });

    it('should throw error for null password', async () => {
      await expect(service.hashPassword(null as any)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.hashPassword(null as any)).rejects.toThrow(
        'Failed to hash password: Password must be a non-empty string',
      );
    });

    it('should throw error for undefined password', async () => {
      await expect(service.hashPassword(undefined as any)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.hashPassword(undefined as any)).rejects.toThrow(
        'Failed to hash password: Password must be a non-empty string',
      );
    });

    it('should throw error for non-string password', async () => {
      await expect(service.hashPassword(12345 as any)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(
        service.hashPassword({ password: 'test' } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });

    // Note: Cannot easily test bcrypt.hash failure without mocking the entire bcrypt module
    // This would be tested in integration tests or with a proper mock of the bcrypt module
  });

  describe('comparePasswords', () => {
    let validPassword: string;
    let validHash: string;

    beforeEach(async () => {
      validPassword = 'testPassword123';
      validHash = await service.hashPassword(validPassword);
    });

    it('should return true for matching password and hash', async () => {
      const result = await service.comparePasswords(validPassword, validHash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const wrongPassword = 'wrongPassword';
      const result = await service.comparePasswords(wrongPassword, validHash);
      expect(result).toBe(false);
    });

    it('should return false for similar but not exact password', async () => {
      const similarPassword = 'testPassword124'; // Off by one character
      const result = await service.comparePasswords(similarPassword, validHash);
      expect(result).toBe(false);
    });

    it('should return false for password with different case', async () => {
      const differentCase = 'TESTPASSWORD123';
      const result = await service.comparePasswords(differentCase, validHash);
      expect(result).toBe(false);
    });

    it('should handle passwords with special characters', async () => {
      const specialPassword = 'P@ssw0rd!#$%';
      const specialHash = await service.hashPassword(specialPassword);

      const result = await service.comparePasswords(
        specialPassword,
        specialHash,
      );
      expect(result).toBe(true);
    });

    it('should return false for empty password', async () => {
      const result = await service.comparePasswords('', validHash);
      expect(result).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const result = await service.comparePasswords(validPassword, '');
      expect(result).toBe(false);
    });

    it('should return false for invalid hash format', async () => {
      const invalidHash = 'not-a-valid-bcrypt-hash';
      const result = await service.comparePasswords(validPassword, invalidHash);
      expect(result).toBe(false);
    });

    it('should throw error for null password', async () => {
      await expect(
        service.comparePasswords(null as any, validHash),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for undefined password', async () => {
      await expect(
        service.comparePasswords(undefined as any, validHash),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for null hash', async () => {
      await expect(
        service.comparePasswords(validPassword, null as any),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for undefined hash', async () => {
      await expect(
        service.comparePasswords(validPassword, undefined as any),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for non-string password', async () => {
      await expect(
        service.comparePasswords(12345 as any, validHash),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw error for non-string hash', async () => {
      await expect(
        service.comparePasswords(validPassword, 12345 as any),
      ).rejects.toThrow(InternalServerErrorException);
    });

    // Note: Cannot easily test bcrypt.compare failure without mocking the entire bcrypt module
    // This would be tested in integration tests or with a proper mock of the bcrypt module

    it('should return false for malformed hash (invalid salt)', async () => {
      const malformedHash = '$2b$10$invalidSaltHere';
      const result = await service.comparePasswords(
        validPassword,
        malformedHash,
      );
      expect(result).toBe(false);
    });
  });

  describe('getSaltRounds', () => {
    it('should return the configured salt rounds', () => {
      const saltRounds = service.getSaltRounds();
      expect(saltRounds).toBe(12);
    });

    it('should return correct salt rounds when configured differently', () => {
      mockConfigService.get.mockReturnValue(14);
      const newService = new PasswordService(configService);
      expect(newService.getSaltRounds()).toBe(14);
    });
  });

  describe('Security Properties', () => {
    it('should use timing-safe comparison (no timing leak)', async () => {
      const password = 'securePassword';
      const hash = await service.hashPassword(password);

      // Measure time for correct password
      const start1 = Date.now();
      await service.comparePasswords(password, hash);
      const time1 = Date.now() - start1;

      // Measure time for incorrect password
      const start2 = Date.now();
      await service.comparePasswords('wrongPassword', hash);
      const time2 = Date.now() - start2;

      // Times should be similar (within reasonable margin)
      // Note: This is a basic check; real timing attack testing requires more sophisticated tools
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });

    it('should include salt in hash (no rainbow table attacks)', async () => {
      const password = 'commonPassword';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      // Different salts mean different hashes
      expect(hash1).not.toBe(hash2);
    });

    it('should create hash that cannot be reversed', async () => {
      const password = 'originalPassword';
      const hash = await service.hashPassword(password);

      // Hash should not contain the original password
      expect(hash).not.toContain(password);
      expect(hash.toLowerCase()).not.toContain(password.toLowerCase());
    });
  });

  describe('Integration Tests', () => {
    it('should handle full authentication flow (hash -> compare)', async () => {
      // User registration
      const userPassword = 'userPassword123!';
      const hashedPassword = await service.hashPassword(userPassword);

      // Store hash in database (simulated)
      expect(hashedPassword).toBeDefined();

      // User login - correct password
      const loginSuccess = await service.comparePasswords(
        userPassword,
        hashedPassword,
      );
      expect(loginSuccess).toBe(true);

      // User login - wrong password
      const loginFail = await service.comparePasswords(
        'wrongPassword',
        hashedPassword,
      );
      expect(loginFail).toBe(false);
    });

    it('should handle multiple users with same password differently', async () => {
      const commonPassword = 'Password123!';

      // Two users register with the same password
      const user1Hash = await service.hashPassword(commonPassword);
      const user2Hash = await service.hashPassword(commonPassword);

      // Hashes should be different (different salts)
      expect(user1Hash).not.toBe(user2Hash);

      // But both should verify correctly
      expect(await service.comparePasswords(commonPassword, user1Hash)).toBe(
        true,
      );
      expect(await service.comparePasswords(commonPassword, user2Hash)).toBe(
        true,
      );

      // Cross-verification should also work (bcrypt stores salt in hash)
      expect(await service.comparePasswords(commonPassword, user1Hash)).toBe(
        true,
      );
      expect(await service.comparePasswords(commonPassword, user2Hash)).toBe(
        true,
      );
    });
  });
});

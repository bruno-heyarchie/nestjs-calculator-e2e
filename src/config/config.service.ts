import { Injectable } from '@nestjs/common';
import configuration, { AppConfig } from './configuration';

/**
 * Configuration service for accessing application configuration
 * Provides type-safe access to configuration values
 */
@Injectable()
export class ConfigService {
  private readonly config = configuration();

  /**
   * Get application configuration
   */
  get app(): AppConfig {
    return this.config.app;
  }

  /**
   * Get a specific configuration value
   */
  get<T = unknown>(key: string): T {
    const keys = key.split('.');

    let value: any = this.config;

    for (const k of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      value = value?.[k];
    }

    return value as T;
  }
}

import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * Configuration module for application-wide configuration
 * Made global so it's available to all modules without explicit importing
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

/**
 * Users module that manages user-related functionality
 * Provides User repository for dependency injection
 *
 * @module UsersModule
 * @description
 * - Registers User entity with TypeORM
 * - Provides User repository for use in other modules
 * - Can be imported by auth and other modules that need user access
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UsersModule {}

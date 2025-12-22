import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

/**
 * User role enum for role-based access control
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * User entity representing application users with authentication capabilities
 *
 * Features:
 * - UUID primary key for security
 * - Unique email constraint with index for fast lookups
 * - Soft delete support via DeleteDateColumn
 * - Automatic timestamps (created_at, updated_at)
 * - Role-based access control (user, admin)
 * - Password field for authentication (should be hashed before storage)
 * - First name and last name fields for user profile
 *
 * @entity users
 */
@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email!: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;
}

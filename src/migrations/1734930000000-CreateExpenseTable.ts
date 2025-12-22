import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

/**
 * Migration to create the expenses table with all necessary columns, indexes, and foreign keys
 *
 * This migration creates the core expense tracking table with:
 * - UUID primary key for security and distributed systems
 * - Decimal type for precise monetary amounts (10 digits, 2 decimal places)
 * - Date field for expense tracking
 * - Optional notes field for additional context
 * - Soft delete support via deleted_at timestamp
 * - Foreign key relationships to users, categories, and budgets
 * - Composite indexes for optimized queries
 * - Automatic timestamps for audit trails
 */
export class CreateExpenseTable1734930000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure UUID extension is available
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create expenses table
    await queryRunner.createTable(
      new Table({
        name: 'expenses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'budget_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create composite index on user_id and date for efficient date-range queries
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_expenses_user_id_date',
        columnNames: ['user_id', 'date'],
      }),
    );

    // Create composite index on user_id and category_id for category-based queries
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_expenses_user_id_category_id',
        columnNames: ['user_id', 'category_id'],
      }),
    );

    // Create index on budget_id for budget-related queries
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_expenses_budget_id',
        columnNames: ['budget_id'],
      }),
    );

    // Create foreign key constraint to users table with CASCADE delete
    // When a user is deleted, all their expenses are automatically deleted
    await queryRunner.createForeignKey(
      'expenses',
      new TableForeignKey({
        name: 'FK_expenses_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create foreign key constraint to budgets table with SET NULL
    // When a budget is deleted, expenses are kept but budget_id is set to null
    await queryRunner.createForeignKey(
      'expenses',
      new TableForeignKey({
        name: 'FK_expenses_budget_id',
        columnNames: ['budget_id'],
        referencedTableName: 'budgets',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Create foreign key constraint to categories table with RESTRICT
    // Categories cannot be deleted if they have associated expenses
    await queryRunner.createForeignKey(
      'expenses',
      new TableForeignKey({
        name: 'FK_expenses_category_id',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.dropForeignKey('expenses', 'FK_expenses_category_id');
    await queryRunner.dropForeignKey('expenses', 'FK_expenses_budget_id');
    await queryRunner.dropForeignKey('expenses', 'FK_expenses_user_id');

    // Drop indexes
    await queryRunner.dropIndex('expenses', 'IDX_expenses_budget_id');
    await queryRunner.dropIndex('expenses', 'IDX_expenses_user_id_category_id');
    await queryRunner.dropIndex('expenses', 'IDX_expenses_user_id_date');

    // Drop the table
    await queryRunner.dropTable('expenses');
  }
}

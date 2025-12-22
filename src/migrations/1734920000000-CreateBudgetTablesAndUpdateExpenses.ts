import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class CreateBudgetTablesAndUpdateExpenses1734920000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create budget_period enum type
    await queryRunner.query(`
      CREATE TYPE budget_period AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
    `);

    // Create budget_categories table
    await queryRunner.createTable(
      new Table({
        name: 'budget_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '7',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '50',
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
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create unique index on budget_categories name
    await queryRunner.createIndex(
      'budget_categories',
      new TableIndex({
        name: 'IDX_budget_categories_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    // Insert default budget categories
    await queryRunner.query(`
      INSERT INTO budget_categories (name, description, color, icon) VALUES
        ('Groceries', 'Grocery shopping budget', '#4CAF50', 'shopping-cart'),
        ('Dining Out', 'Restaurant and dining budget', '#FF9800', 'utensils'),
        ('Transportation', 'Transportation and fuel budget', '#2196F3', 'car'),
        ('Entertainment', 'Entertainment and leisure budget', '#E91E63', 'film'),
        ('Healthcare', 'Medical and healthcare budget', '#00BCD4', 'heart'),
        ('Housing', 'Rent and housing expenses budget', '#9C27B0', 'home'),
        ('Utilities', 'Utility bills budget', '#FFC107', 'bolt'),
        ('Savings', 'Savings and investments budget', '#8BC34A', 'piggy-bank'),
        ('Personal', 'Personal expenses budget', '#FF5722', 'user'),
        ('Other', 'Miscellaneous budget', '#607D8B', 'ellipsis-h')
    `);

    // Create budgets table
    await queryRunner.createTable(
      new Table({
        name: 'budgets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'spent_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'period',
            type: 'budget_period',
            default: "'monthly'",
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'alert_enabled',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'alert_threshold',
            type: 'integer',
            default: 80,
            isNullable: false,
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
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes on budgets table for frequently queried fields
    await queryRunner.createIndex(
      'budgets',
      new TableIndex({
        name: 'IDX_budgets_user_id_start_date_end_date',
        columnNames: ['user_id', 'start_date', 'end_date'],
      }),
    );

    await queryRunner.createIndex(
      'budgets',
      new TableIndex({
        name: 'IDX_budgets_user_id_category_id',
        columnNames: ['user_id', 'category_id'],
      }),
    );

    // Create foreign key constraints for budgets table
    await queryRunner.createForeignKey(
      'budgets',
      new TableForeignKey({
        name: 'FK_budgets_user_id',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'budgets',
      new TableForeignKey({
        name: 'FK_budgets_category_id',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'budget_categories',
        onDelete: 'SET NULL',
      }),
    );

    // Update expenses table to add budget_id column
    const hasExpensesTable = await queryRunner.hasTable('expenses');
    if (hasExpensesTable) {
      // Add budget_id column to expenses table
      await queryRunner.addColumn(
        'expenses',
        new TableColumn({
          name: 'budget_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      // Create index on expenses.budget_id
      await queryRunner.createIndex(
        'expenses',
        new TableIndex({
          name: 'IDX_expenses_budget_id',
          columnNames: ['budget_id'],
        }),
      );

      // Create foreign key constraint for expenses.budget_id
      await queryRunner.createForeignKey(
        'expenses',
        new TableForeignKey({
          name: 'FK_expenses_budget_id',
          columnNames: ['budget_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'budgets',
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key and column from expenses table
    const hasExpensesTable = await queryRunner.hasTable('expenses');
    if (hasExpensesTable) {
      const expensesTable = await queryRunner.getTable('expenses');
      const budgetForeignKey = expensesTable?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('budget_id') !== -1,
      );
      if (budgetForeignKey) {
        await queryRunner.dropForeignKey('expenses', budgetForeignKey);
      }

      await queryRunner.dropIndex('expenses', 'IDX_expenses_budget_id');
      await queryRunner.dropColumn('expenses', 'budget_id');
    }

    // Drop foreign keys from budgets table
    await queryRunner.dropForeignKey('budgets', 'FK_budgets_category_id');
    await queryRunner.dropForeignKey('budgets', 'FK_budgets_user_id');

    // Drop indexes from budgets table
    await queryRunner.dropIndex('budgets', 'IDX_budgets_user_id_category_id');
    await queryRunner.dropIndex(
      'budgets',
      'IDX_budgets_user_id_start_date_end_date',
    );

    // Drop budgets table
    await queryRunner.dropTable('budgets', true);

    // Drop budget_categories table
    await queryRunner.dropIndex(
      'budget_categories',
      'IDX_budget_categories_name',
    );
    await queryRunner.dropTable('budget_categories', true);

    // Drop budget_period enum type
    await queryRunner.query(`DROP TYPE budget_period;`);
  }
}

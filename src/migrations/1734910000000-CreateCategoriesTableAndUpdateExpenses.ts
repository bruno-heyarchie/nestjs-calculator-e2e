import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class CreateCategoriesTableAndUpdateExpenses1734910000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: 'categories',
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
          { name: 'color', type: 'varchar', length: '7', isNullable: true },
          { name: 'icon', type: 'varchar', length: '50', isNullable: true },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'is_system',
            type: 'boolean',
            default: false,
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
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'categories',
      new TableIndex({
        name: 'IDX_categories_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );
    await queryRunner.query(`INSERT INTO categories (name, color, icon, description, is_system) VALUES
      ('Food', '#FF6B6B', 'utensils', 'Food and dining expenses', true),
      ('Transportation', '#4ECDC4', 'car', 'Transportation and travel expenses', true),
      ('Utilities', '#45B7D1', 'bolt', 'Utility bills and services', true),
      ('Entertainment', '#FFA07A', 'film', 'Entertainment and leisure', true),
      ('Healthcare', '#98D8C8', 'heart', 'Medical and health expenses', true),
      ('Shopping', '#F7DC6F', 'shopping-bag', 'Shopping and retail', true),
      ('Education', '#BB8FCE', 'book', 'Education and learning', true),
      ('Housing', '#85C1E2', 'home', 'Housing and rent expenses', true),
      ('Other', '#95A5A6', 'ellipsis-h', 'Miscellaneous expenses', true)`);
    const hasExpensesTable = await queryRunner.hasTable('expenses');
    if (hasExpensesTable) {
      await queryRunner.addColumn(
        'expenses',
        new TableColumn({
          name: 'category_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
      await queryRunner.changeColumn(
        'expenses',
        'category_id',
        new TableColumn({
          name: 'category_id',
          type: 'uuid',
          isNullable: false,
        }),
      );
      await queryRunner.createIndex(
        'expenses',
        new TableIndex({
          name: 'IDX_expenses_category_id',
          columnNames: ['category_id'],
        }),
      );
      await queryRunner.createForeignKey(
        'expenses',
        new TableForeignKey({
          columnNames: ['category_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'categories',
          onDelete: 'RESTRICT',
          name: 'FK_expenses_category_id',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasExpensesTable = await queryRunner.hasTable('expenses');
    if (hasExpensesTable) {
      await queryRunner.dropForeignKey('expenses', 'FK_expenses_category_id');
      await queryRunner.dropIndex('expenses', 'IDX_expenses_category_id');
      await queryRunner.dropColumn('expenses', 'category_id');
    }
    await queryRunner.dropIndex('categories', 'IDX_categories_name');
    await queryRunner.dropTable('categories');
  }
}

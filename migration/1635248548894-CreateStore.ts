import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStore1635248548894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'store',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tel',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'opening',
            type: 'time without time zone',
            isNullable: true,
          },
          {
            name: 'closing',
            type: 'time without time zone',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'geometry',
            isNullable: false,
          },
          {
            name: 'img',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'date',
          },
          {
            name: 'deleted_at',
            type: 'date',
          },
          {
            name: 'updated_at',
            type: 'date',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('store');
  }
}

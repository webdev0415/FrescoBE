import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class canvasTable1604508401202 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'canvas',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '225',
                    isNullable: false,
                },
                {
                    name: 'data',
                    type: 'longtext',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('canvas');
    }
}

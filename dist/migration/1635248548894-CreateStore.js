"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStore1635248548894 = void 0;
const typeorm_1 = require("typeorm");
class CreateStore1635248548894 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('store');
    }
}
exports.CreateStore1635248548894 = CreateStore1635248548894;
//# sourceMappingURL=1635248548894-CreateStore.js.map
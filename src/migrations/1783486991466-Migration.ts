import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783486991466 implements MigrationInterface {
    name = 'Migration1783486991466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaElaboracion"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaElaboracion" date`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaIngreso"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaIngreso" date`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaCaducidad"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaCaducidad" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaCaducidad"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaCaducidad" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaIngreso"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaIngreso" character varying`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaElaboracion"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaElaboracion" character varying`);
    }

}

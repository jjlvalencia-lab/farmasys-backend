import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783485997610 implements MigrationInterface {
    name = 'Migration1783485997610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "nombreCompleto" character varying`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaElaboracion"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaElaboracion" character varying`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaIngreso"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaIngreso" character varying`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaCaducidad"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaCaducidad" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "descuento"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "descuento" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "promocionInicio"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "promocionInicio" character varying`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "promocionFin"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "promocionFin" character varying`);
        await queryRunner.query(`ALTER TABLE "venta" ALTER COLUMN "recargoPago" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "rol" SET DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "rol" SET DEFAULT 'empleado'`);
        await queryRunner.query(`ALTER TABLE "venta" ALTER COLUMN "recargoPago" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "promocionFin"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "promocionFin" date`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "promocionInicio"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "promocionInicio" date`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "descuento"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "descuento" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaCaducidad"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaCaducidad" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaIngreso"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaIngreso" date`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "fechaElaboracion"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "fechaElaboracion" date`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "nombreCompleto"`);
    }

}

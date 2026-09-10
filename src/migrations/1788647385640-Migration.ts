import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788647385640 implements MigrationInterface {
    name = 'Migration1788647385640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" ADD "imagenUrl" text`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "rol" SET DEFAULT 'empleado'`);
        await queryRunner.query(`CREATE INDEX "IDX_d86d179360134b4b74bda75066" ON "producto" ("nombre") `);
        await queryRunner.query(`CREATE INDEX "IDX_e2be3c58fe3a893052c4e1cc6e" ON "producto" ("fechaCaducidad") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b735813bfcaba3b9cc4ec8a65" ON "producto" ("categoria") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8b735813bfcaba3b9cc4ec8a65"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2be3c58fe3a893052c4e1cc6e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d86d179360134b4b74bda75066"`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "rol" SET DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "imagenUrl"`);
    }

}

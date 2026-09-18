import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789693824816 implements MigrationInterface {
    name = 'Migration1789693824816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "motorista" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "placa" character varying NOT NULL, "modeloVehiculo" character varying NOT NULL, "estado" character varying NOT NULL DEFAULT 'disponible', CONSTRAINT "PK_ab94c3b7ad53a62d54b775a2a2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "motorista"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789691926461 implements MigrationInterface {
    name = 'Migration1789691926461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "detalle_pedido" ("id" SERIAL NOT NULL, "productoId" integer, "nombreProducto" character varying NOT NULL, "cantidad" integer NOT NULL, "precioUnitario" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, "pedidoId" integer, CONSTRAINT "PK_123bec7ab52f5db0a11766f87c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido" ("id" SERIAL NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "clienteNombre" character varying NOT NULL, "clienteTelefono" character varying NOT NULL, "clienteDireccion" character varying, "clienteReferencia" character varying, "estado" character varying NOT NULL DEFAULT 'pendiente_pago', "total" numeric(10,2) NOT NULL DEFAULT '0', "metodoPago" character varying, "referenciaPago" character varying, "bancoPago" character varying, "capturaPago" character varying, "observacion" character varying, "cajero" character varying, CONSTRAINT "PK_af8d8b3d07fae559c37f56b3f43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_4d39e79d693b68f9f35cf4238e1" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_aa6bb17cb0e47d62ace803293eb" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_aa6bb17cb0e47d62ace803293eb"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_4d39e79d693b68f9f35cf4238e1"`);
        await queryRunner.query(`DROP TABLE "pedido"`);
        await queryRunner.query(`DROP TABLE "detalle_pedido"`);
    }

}

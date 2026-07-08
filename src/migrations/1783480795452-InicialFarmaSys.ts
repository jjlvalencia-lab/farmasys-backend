import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InicialFarmaSys1783480795452 implements MigrationInterface {
  name = 'InicialFarmaSys1783480795452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'usuario',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'username', type: 'varchar', isUnique: true },
        { name: 'password', type: 'varchar' },
        { name: 'rol', type: 'varchar', default: "'empleado'" },
      ]
    }), true);

    await queryRunner.createTable(new Table({
      name: 'producto',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'nombre', type: 'varchar' },
        { name: 'precio', type: 'decimal', precision: 10, scale: 2 },
        { name: 'precioCosto', type: 'decimal', precision: 10, scale: 2, default: '0' },
        { name: 'precioCaja', type: 'decimal', precision: 10, scale: 2, default: '0' },
        { name: 'unidadesPorCaja', type: 'int', default: '1' },
        { name: 'lote', type: 'varchar' },
        { name: 'fechaElaboracion', type: 'date', isNullable: true },
        { name: 'fechaIngreso', type: 'date', isNullable: true },
        { name: 'fechaCaducidad', type: 'date' },
        { name: 'stock', type: 'int', default: '0' },
        { name: 'stockMinimo', type: 'int', default: '10' },
        { name: 'stockMaximo', type: 'int', default: '1000' },
        { name: 'categoria', type: 'varchar', default: "'Otros'" },
        { name: 'imagen', type: 'text', isNullable: true },
        { name: 'enPromocion', type: 'boolean', default: false },
        { name: 'descuento', type: 'int', default: '0' },
        { name: 'promocionInicio', type: 'date', isNullable: true },
        { name: 'promocionFin', type: 'date', isNullable: true },
      ]
    }), true);

    await queryRunner.createTable(new Table({
      name: 'venta',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'fecha', type: 'timestamp' },
        { name: 'total', type: 'decimal', precision: 10, scale: 2 },
        { name: 'metodoPago', type: 'varchar' },
        { name: 'entidadFinanciera', type: 'varchar', isNullable: true },
        { name: 'tipoTarjeta', type: 'varchar', isNullable: true },
        { name: 'recargoPago', type: 'decimal', isNullable: true },
        { name: 'referencia', type: 'varchar', isNullable: true },
        { name: 'observacion', type: 'varchar', isNullable: true },
        { name: 'tipoCliente', type: 'varchar', default: "'consumidor_final'" },
        { name: 'clienteNombre', type: 'varchar', isNullable: true },
        { name: 'clienteCedula', type: 'varchar', isNullable: true },
        { name: 'clienteTelefono', type: 'varchar', isNullable: true },
        { name: 'clienteDireccion', type: 'varchar', isNullable: true },
        { name: 'cajero', type: 'varchar', isNullable: true },
      ]
    }), true);

    await queryRunner.createTable(new Table({
      name: 'detalle_venta',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'ventaId', type: 'int', isNullable: true },
        { name: 'productoId', type: 'int', isNullable: true },
        { name: 'nombreProducto', type: 'varchar' },
        { name: 'cantidad', type: 'int' },
        { name: 'precioUnitario', type: 'decimal', precision: 10, scale: 2 },
        { name: 'subtotal', type: 'decimal', precision: 10, scale: 2 },
      ]
    }), true);

    await queryRunner.createForeignKey('detalle_venta', new TableForeignKey({
      columnNames: ['ventaId'],
      referencedTableName: 'venta',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('detalle_venta', new TableForeignKey({
      columnNames: ['productoId'],
      referencedTableName: 'producto',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('detalle_venta', true);
    await queryRunner.dropTable('venta', true);
    await queryRunner.dropTable('producto', true);
    await queryRunner.dropTable('usuario', true);
  }
}

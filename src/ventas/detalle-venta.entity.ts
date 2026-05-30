import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Venta, venta => venta.detalles)
  venta!: Venta;

  @Column()
  productoId!: number;

  @Column()
  nombreProducto!: string;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;
}
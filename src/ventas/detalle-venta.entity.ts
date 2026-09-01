import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../productos/producto.entity';

@Entity()
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Venta, venta => venta.detalles, { onDelete: 'CASCADE' })
  venta!: Venta;

  @ManyToOne(() => Producto, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productoId' })
  producto!: Producto;

  @Column({ nullable: true })
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

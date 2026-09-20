import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../productos/producto.entity';

@Entity()
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pedido, pedido => pedido.detalles, { onDelete: 'CASCADE' })
  pedido!: Pedido;

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

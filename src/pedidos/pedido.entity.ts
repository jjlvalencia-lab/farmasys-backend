import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { DetallePedido } from './detalle-pedido.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  fecha!: Date;

  @Column()
  clienteNombre!: string;

  @Column()
  clienteTelefono!: string;

  @Column({ nullable: true })
  clienteDireccion!: string;

  @Column({ nullable: true })
  clienteReferencia!: string;

  @Column({ default: 'pendiente_pago' })
  estado!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ nullable: true })
  metodoPago!: string;

  @Column({ nullable: true })
  referenciaPago!: string;

  @Column({ nullable: true })
  bancoPago!: string;

  @Column({ nullable: true })
  capturaPago!: string;

  @Column({ nullable: true })
  observacion!: string;

  @Column({ nullable: true })
  cajero!: string;

  @OneToMany(() => DetallePedido, detalle => detalle.pedido, { cascade: true })
  detalles!: DetallePedido[];
}

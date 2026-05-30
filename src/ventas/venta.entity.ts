import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  fecha!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column()
  metodoPago!: string;

  @Column({ nullable: true })
  referencia!: string;

  @Column({ nullable: true })
  observacion!: string;

  @OneToMany(() => DetalleVenta, detalle => detalle.venta, { cascade: true })
  detalles!: DetalleVenta[];
}
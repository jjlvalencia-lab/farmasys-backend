import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  fecha!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column()
  metodoPago!: string;

  @Column({ nullable: true })
  entidadFinanciera!: string;

  @Column({ nullable: true })
  tipoTarjeta!: string;

  @Column({ nullable: true })
  recargoPago!: number;

  @Column({ nullable: true })
  referencia!: string;

  @Column({ nullable: true })
  observacion!: string;

  @Column({ default: 'consumidor_final' })
  tipoCliente!: string;

  @Column({ nullable: true })
  clienteNombre!: string;

  @Column({ nullable: true })
  clienteCedula!: string;

  @Column({ nullable: true })
  clienteTelefono!: string;

  @Column({ nullable: true })
  clienteDireccion!: string;

  @Column({ nullable: true })
  cajero!: string;

  @OneToMany(() => DetalleVenta, detalle => detalle.venta, { cascade: true })
  detalles!: DetalleVenta[];
}

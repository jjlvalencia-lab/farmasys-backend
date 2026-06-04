import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioCosto!: number;

  @Column({ default: 1 })
  unidadesPorCaja!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioCaja!: number;

  @Column()
  lote!: string;

  @Column({ nullable: true })
  fechaElaboracion!: string;

  @Column({ nullable: true })
  fechaIngreso!: string;

  @Column()
  fechaCaducidad!: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: 10 })
  stockMinimo!: number;

  @Column({ default: 1000 })
  stockMaximo!: number;

  @Column({ type: 'text', nullable: true })
  imagen!: string;

  @Column({ default: 'Otros' })
  categoria!: string;
}

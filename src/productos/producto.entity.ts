import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['categoria'])
@Index(['fechaCaducidad'])
@Index(['nombre'])
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

  @Column({ type: 'date', nullable: true })
  fechaElaboracion!: string;

  @Column({ type: 'date', nullable: true })
  fechaIngreso!: string;

  @Column({ type: 'date' })
  fechaCaducidad!: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: 10 })
  stockMinimo!: number;

  @Column({ default: 1000 })
  stockMaximo!: number;

  @Column({ type: 'text', nullable: true })
  imagen!: string;

  @Column({ type: 'text', nullable: true })
  imagenUrl!: string;

  @Column({ default: 'Otros' })
  categoria!: string;

  @Column({ default: false })
  enPromocion!: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  descuento!: number;

  @Column({ nullable: true })
  promocionInicio!: string;

  @Column({ nullable: true })
  promocionFin!: string;
}

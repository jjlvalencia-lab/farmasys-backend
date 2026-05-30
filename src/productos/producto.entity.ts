import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  lote!: string;

  @Column()
  fechaCaducidad!: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ type: 'text', nullable: true })
  imagen!: string;

  @Column({ default: 'Otros' })
  categoria!: string;
}

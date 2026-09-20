import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Motorista {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  placa!: string;

  @Column()
  modeloVehiculo!: string;

  @Column({ default: 'disponible' })
  estado!: string;
}

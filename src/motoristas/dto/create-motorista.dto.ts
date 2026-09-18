import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMotoristaDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre!: string;

  @IsNotEmpty({ message: 'La placa es requerida' })
  @IsString()
  placa!: string;

  @IsNotEmpty({ message: 'El modelo del vehículo es requerido' })
  @IsString()
  modeloVehiculo!: string;
}

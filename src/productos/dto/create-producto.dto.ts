import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre!: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio!: number;

  @IsNumber()
  @Min(0)
  precioCosto!: number;

  @IsOptional()
  @IsNumber()
  unidadesPorCaja?: number;

  @IsOptional()
  @IsNumber()
  precioCaja?: number;

  @IsNotEmpty({ message: 'El lote es requerido' })
  @IsString()
  lote!: string;

  @IsOptional()
  @IsString()
  fechaElaboracion?: string;

  @IsOptional()
  @IsString()
  fechaIngreso?: string;

  @IsNotEmpty({ message: 'La fecha de caducidad es requerida' })
  @IsString()
  fechaCaducidad!: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsNumber()
  stockMinimo?: number;

  @IsOptional()
  @IsNumber()
  stockMaximo?: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString()
  categoria!: string;

  @IsOptional()
  @IsBoolean()
  enPromocion?: boolean;

  @IsOptional()
  @IsNumber()
  descuento?: number;

  @IsOptional()
  @IsString()
  promocionInicio?: string;

  @IsOptional()
  @IsString()
  promocionFin?: string;
}

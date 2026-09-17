import { IsNotEmpty, IsString, IsOptional, IsNumber,
         IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DetallePedidoDto {
  @IsNumber()
  productoId!: number;

  @IsNotEmpty()
  @IsString()
  nombreProducto!: string;

  @IsNumber()
  @Min(1)
  cantidad!: number;

  @IsNumber()
  @Min(0)
  precioUnitario!: number;

  @IsNumber()
  @Min(0)
  subtotal!: number;
}

export class CreatePedidoDto {
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  @IsString()
  clienteNombre!: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  clienteTelefono!: string;

  @IsOptional()
  @IsString()
  clienteDireccion?: string;

  @IsOptional()
  @IsString()
  clienteReferencia?: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsString()
  cajero?: string;

  @IsNumber()
  @Min(0)
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetallePedidoDto)
  detalles!: DetallePedidoDto[];
}

import {
  IsNotEmpty, IsNumber, IsString, IsOptional,
  IsArray, ValidateNested, Min, IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
  @IsNumber()
  productoId!: number;

  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString()
  nombreProducto!: string;

  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad!: number;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precioUnitario!: number;

  @IsNumber()
  @Min(0, { message: 'El subtotal no puede ser negativo' })
  subtotal!: number;
}

export class CreateVentaDto {
  @IsNumber()
  @Min(0, { message: 'El total no puede ser negativo' })
  total!: number;

  @IsNotEmpty({ message: 'El método de pago es requerido' })
  @IsIn(['efectivo', 'tarjeta', 'transferencia', 'qr'], {
    message: 'Método de pago inválido'
  })
  metodoPago!: string;

  @IsOptional()
  @IsString()
  entidadFinanciera?: string;

  @IsOptional()
  @IsString()
  tipoTarjeta?: string;

  @IsOptional()
  @IsNumber()
  recargoPago?: number;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsNotEmpty({ message: 'El tipo de cliente es requerido' })
  @IsIn(['consumidor_final', 'con_datos'], {
    message: 'Tipo de cliente inválido'
  })
  tipoCliente!: string;

  @IsOptional()
  @IsString()
  clienteNombre?: string;

  @IsOptional()
  @IsString()
  clienteCedula?: string;

  @IsOptional()
  @IsString()
  clienteTelefono?: string;

  @IsOptional()
  @IsString()
  clienteDireccion?: string;

  @IsOptional()
  @IsString()
  cajero?: string;

  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles!: DetalleVentaDto[];
}

export class CreateVentaDto {
  total!: number;
  metodoPago!: string;
  referencia?: string;
  observacion?: string;
  detalles!: {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

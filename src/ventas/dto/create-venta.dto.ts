export class CreateVentaDto {
  total!: number;
  metodoPago!: string;
  entidadFinanciera?: string;
  tipoTarjeta?: string;
  recargoPago?: number;
  referencia?: string;
  observacion?: string;
  tipoCliente!: string;
  clienteNombre?: string;
  clienteCedula?: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  cajero!: string;
  detalles!: {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

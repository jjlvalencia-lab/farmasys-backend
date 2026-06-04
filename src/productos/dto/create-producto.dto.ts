export class CreateProductoDto {
  nombre!: string;
  precio!: number;
  precioCosto!: number;
  unidadesPorCaja?: number;
  precioCaja?: number;
  lote!: string;
  fechaElaboracion?: string;
  fechaIngreso?: string;
  fechaCaducidad!: string;
  stock!: number;
  stockMinimo?: number;
  stockMaximo?: number;
  imagen?: string;
  categoria!: string;
}

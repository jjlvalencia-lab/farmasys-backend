export class CreateProductoDto {
  nombre!: string;
  precio!: number;
  lote!: string;
  fechaCaducidad!: string;
  stock!: number;
  imagen?: string;
  categoria!: string;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Venta } from '../ventas/venta.entity';

interface FindAllParams {
  page?: number;
  limit?: number;
  categoria?: string;
  busqueda?: string;
}

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
  ) {}

  async findAll(params: FindAllParams = {}): Promise<Producto[] | { data: Producto[]; total: number; page: number; totalPages: number }> {
    const { page, limit, categoria, busqueda } = params;

    const where: any = {};
    if (categoria && categoria !== 'Todos') {
      where.categoria = categoria;
    }
    if (busqueda) {
      where.nombre = Like(`%${busqueda}%`);
    }

    // Sin paginación — devuelve todos (compatibilidad con frontend actual)
    if (!page || !limit) {
      return this.productosRepository.find({ where, order: { nombre: 'ASC' } });
    }

    // Con paginación
    const [data, total] = await this.productosRepository.findAndCount({
      where,
      order: { nombre: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(dto);
    return this.productosRepository.save(producto);
  }

  async update(id: number, dto: Partial<CreateProductoDto>): Promise<Producto> {
    await this.productosRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productosRepository.delete(id);
  }

  async getRotacion() {
    const productos = await this.productosRepository.find();
    const ventas = await this.ventasRepository.find({ relations: { detalles: true } });

    return productos.map(p => {
      const detallesProducto = ventas.flatMap(v => v.detalles || [])
        .filter(d => d.productoId === p.id);

      const totalVendido = detallesProducto.reduce((sum, d) => sum + d.cantidad, 0);
      const ingresoGenerado = detallesProducto.reduce((sum, d) =>
        sum + parseFloat(d.subtotal as any), 0);

      const fechaIngreso = p.fechaIngreso ? new Date(p.fechaIngreso) : new Date();
      const diasEnInventario = Math.ceil(
        (new Date().getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24)
      );

      const velocidad = diasEnInventario > 0
        ? (totalVendido / diasEnInventario).toFixed(2)
        : '0';

      const estado = p.stock === 0 ? 'agotado'
        : totalVendido === 0 ? 'sin_movimiento'
        : 'activo';

      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        stock: p.stock,
        totalVendido,
        ingresoGenerado: ingresoGenerado.toFixed(2),
        diasEnInventario,
        velocidadVenta: velocidad,
        valorInventario: parseFloat(p.precioCosto as any) * p.stock,
        gananciaEstimada: (parseFloat(p.precio as any) - parseFloat(p.precioCosto as any)) * p.stock,
        estado
      };
    }).sort((a, b) => b.totalVendido - a.totalVendido);
  }

  async getAnalisis() {
    const productos = await this.productosRepository.find();
    const ventas = await this.ventasRepository.find({ relations: { detalles: true } });

    const totalInvertido = productos.reduce((sum, p) =>
      sum + (parseFloat(p.precioCosto as any) * p.stock), 0);

    const valorVentaPotencial = productos.reduce((sum, p) =>
      sum + (parseFloat(p.precio as any) * p.stock), 0);

    const gananciaEstimada = valorVentaPotencial - totalInvertido;
    const margenPromedio = totalInvertido > 0
      ? ((gananciaEstimada / totalInvertido) * 100).toFixed(1)
      : '0';

    const hace30dias = new Date();
    hace30dias.setDate(hace30dias.getDate() - 30);

    const idsVendidos30 = new Set<number>();
    ventas.filter(v => new Date(v.fecha) >= hace30dias)
      .forEach(v => v.detalles?.forEach(d => idsVendidos30.add(d.productoId)));

    const productosSinMovimiento = productos.filter(p =>
      p.stock > 0 && !idsVendidos30.has(p.id)).length;

    const productosAgotados = productos.filter(p => p.stock === 0).length;
    const enPromocion = productos.filter(p => p.enPromocion).length;
    const stockBajo = productos.filter(p =>
      p.stock > 0 && p.stock <= (p.stockMinimo || 10)).length;

    return {
      totalInvertido: totalInvertido.toFixed(2),
      valorVentaPotencial: valorVentaPotencial.toFixed(2),
      gananciaEstimada: gananciaEstimada.toFixed(2),
      margenPromedio: `${margenPromedio}%`,
      productosSinMovimiento,
      productosAgotados,
      enPromocion,
      stockBajo,
      totalProductos: productos.length
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.productosRepository.find();
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
    const hoy = new Date();
    return productos.map(p => {
      const diasEnInventario = p.fechaIngreso
        ? Math.ceil((hoy.getTime() - new Date(p.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        stock: p.stock,
        precio: p.precio,
        precioCosto: p.precioCosto,
        fechaIngreso: p.fechaIngreso,
        diasEnInventario,
        valorInventario: Number(p.stock) * Number(p.precioCosto),
        gananciaEstimada: Number(p.stock) * (Number(p.precio) - Number(p.precioCosto)),
        estado: p.stock === 0 ? 'agotado' : diasEnInventario > 30 ? 'sin_movimiento' : 'activo'
      };
    }).sort((a, b) => b.diasEnInventario - a.diasEnInventario);
  }

  async getAnalisis() {
    const productos = await this.productosRepository.find();
    const totalInvertido = productos.reduce((sum, p) => sum + (Number(p.stock) * Number(p.precioCosto)), 0);
    const valorVentaPotencial = productos.reduce((sum, p) => sum + (Number(p.stock) * Number(p.precio)), 0);
    const gananciaEstimada = valorVentaPotencial - totalInvertido;
    const sinMovimiento = productos.filter(p => {
      if (!p.fechaIngreso) return false;
      const dias = Math.ceil((new Date().getTime() - new Date(p.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24));
      return dias > 30 && p.stock > 0;
    });
    return {
      totalProductos: productos.length,
      totalInvertido: totalInvertido.toFixed(2),
      valorVentaPotencial: valorVentaPotencial.toFixed(2),
      gananciaEstimada: gananciaEstimada.toFixed(2),
      productosAgotados: productos.filter(p => p.stock === 0).length,
      productosSinMovimiento: sinMovimiento.length,
      enPromocion: productos.filter(p => p.enPromocion).length
    };
  }
}

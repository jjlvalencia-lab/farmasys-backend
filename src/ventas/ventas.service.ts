import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { Producto } from '../productos/producto.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detallesRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(dto: CreateVentaDto): Promise<Venta> {
    for (const detalle of dto.detalles) {
      const producto = await this.productosRepository.findOne({
        where: { id: detalle.productoId },
      });
      if (!producto)
        throw new BadRequestException(
          `Producto ${detalle.nombreProducto} no encontrado`,
        );
      if (producto.stock < detalle.cantidad)
        throw new BadRequestException(
          `Stock insuficiente para ${detalle.nombreProducto}`,
        );
      await this.productosRepository.update(detalle.productoId, {
        stock: producto.stock - detalle.cantidad,
      });
    }
    const venta = this.ventasRepository.create({
      total: dto.total,
      metodoPago: dto.metodoPago,
      referencia: dto.referencia,
      observacion: dto.observacion,
    });
    const ventaGuardada = await this.ventasRepository.save(venta);
    for (const detalle of dto.detalles) {
      const detalleVenta = this.detallesRepository.create({
        venta: ventaGuardada,
        productoId: detalle.productoId,
        nombreProducto: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      });
      await this.detallesRepository.save(detalleVenta);
    }
    return this.ventasRepository.findOne({
      where: { id: ventaGuardada.id },
      relations: { detalles: true },
    });
  }

  findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: { detalles: true },
      order: { fecha: 'DESC' },
    });
  }

  findOne(id: number): Promise<Venta | null> {
    return this.ventasRepository.findOne({
      where: { id },
      relations: { detalles: true },
    });
  }
}

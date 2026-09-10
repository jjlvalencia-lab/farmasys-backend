import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  getFechaEcuador(): Date {
    const ahora = new Date();
    const offsetEcuador = -5 * 60;
    const fechaUTC = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
    return new Date(fechaUTC + (offsetEcuador * 60000));
  }

  async create(dto: CreateVentaDto): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar stock de todos los productos primero
      for (const detalle of dto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.productoId }
        });
        if (!producto) {
          throw new BadRequestException(
            `Producto ${detalle.nombreProducto} no encontrado`
          );
        }
        if (producto.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${detalle.nombreProducto}. Disponible: ${producto.stock}`
          );
        }
      }

      // Crear la venta
      const venta = queryRunner.manager.create(Venta, {
        fecha: this.getFechaEcuador(),
        total: dto.total,
        metodoPago: dto.metodoPago,
        entidadFinanciera: dto.entidadFinanciera,
        tipoTarjeta: dto.tipoTarjeta,
        recargoPago: dto.recargoPago,
        referencia: dto.referencia,
        observacion: dto.observacion,
        tipoCliente: dto.tipoCliente,
        clienteNombre: dto.clienteNombre,
        clienteCedula: dto.clienteCedula,
        clienteTelefono: dto.clienteTelefono,
        clienteDireccion: dto.clienteDireccion,
        cajero: dto.cajero,
      });

      const ventaGuardada = await queryRunner.manager.save(venta);

      // Guardar detalles y descontar stock
      for (const detalle of dto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.productoId }
        });

        const detalleVenta = queryRunner.manager.create(DetalleVenta, {
          venta: ventaGuardada,
          productoId: detalle.productoId,
          nombreProducto: detalle.nombreProducto,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal,
        });

        await queryRunner.manager.save(detalleVenta);
        await queryRunner.manager.update(Producto, detalle.productoId, {
          stock: producto!.stock - detalle.cantidad
        });
      }

      await queryRunner.commitTransaction();

      return this.ventasRepository.findOne({
        where: { id: ventaGuardada.id },
        relations: { detalles: true }
      }) as Promise<Venta>;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: { detalles: true },
      order: { fecha: 'DESC' }
    });
  }

  findOne(id: number): Promise<Venta | null> {
    return this.ventasRepository.findOne({
      where: { id },
      relations: { detalles: true }
    });
  }

  async findByFecha(fecha: string): Promise<Venta[]> {
    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59`);
    return this.ventasRepository.find({
      where: { fecha: Between(inicio, fin) },
      relations: { detalles: true },
      order: { fecha: 'DESC' }
    });
  }

  async getCierreDelDia(fecha: string) {
    const ventas = await this.findByFecha(fecha);
    const totalVentas = ventas.reduce((sum, v) =>
      sum + parseFloat(v.total.toString()), 0);
    const totalEfectivo = ventas
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + parseFloat(v.total.toString()), 0);
    const totalTarjeta = ventas
      .filter(v => v.metodoPago === 'tarjeta')
      .reduce((sum, v) => sum + parseFloat(v.total.toString()), 0);
    const totalTransferencia = ventas
      .filter(v => v.metodoPago === 'transferencia')
      .reduce((sum, v) => sum + parseFloat(v.total.toString()), 0);
    const totalQr = ventas
      .filter(v => v.metodoPago === 'qr')
      .reduce((sum, v) => sum + parseFloat(v.total.toString()), 0);

    const productos = await this.productosRepository.find();
    const ganancia = ventas.reduce((sum, v) => {
      return sum + v.detalles.reduce((s, d) => {
        const prod = productos.find(p => p.id === d.productoId);
        const costo = prod ? parseFloat(prod.precioCosto.toString()) : 0;
        return s + (parseFloat(d.subtotal.toString()) - (costo * d.cantidad));
      }, 0);
    }, 0);

    return {
      fecha,
      totalVentas: totalVentas.toFixed(2),
      cantidadVentas: ventas.length,
      totalEfectivo: totalEfectivo.toFixed(2),
      totalTarjeta: totalTarjeta.toFixed(2),
      totalTransferencia: totalTransferencia.toFixed(2),
      totalQr: totalQr.toFixed(2),
      gananciaEstimada: ganancia.toFixed(2),
      ventas
    };
  }
}

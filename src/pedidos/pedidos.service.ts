import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './pedido.entity';
import { DetallePedido } from './detalle-pedido.entity';
import { Producto } from '../productos/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private detallesRepository: Repository<DetallePedido>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidosRepository.create({
      clienteNombre: dto.clienteNombre,
      clienteTelefono: dto.clienteTelefono,
      clienteDireccion: dto.clienteDireccion,
      clienteReferencia: dto.clienteReferencia,
      observacion: dto.observacion,
      cajero: dto.cajero,
      total: dto.total,
      estado: 'pendiente_pago',
    });

    const pedidoGuardado = await this.pedidosRepository.save(pedido);

    for (const detalle of dto.detalles) {
      const det = this.detallesRepository.create({
        pedido: pedidoGuardado,
        productoId: detalle.productoId,
        nombreProducto: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      });
      await this.detallesRepository.save(det);
    }

    return this.pedidosRepository.findOne({
      where: { id: pedidoGuardado.id },
      relations: { detalles: true }
    }) as Promise<Pedido>;
  }

  findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      relations: { detalles: true },
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: { detalles: true }
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }

  async cambiarEstado(id: number, estado: string): Promise<Pedido> {
    const pedido = await this.findOne(id);
    const estadosValidos = [
      'pendiente_pago', 'pago_recibido',
      'en_preparacion', 'en_camino',
      'entregado', 'cancelado'
    ];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }
    pedido.estado = estado;
    await this.pedidosRepository.save(pedido);
    return pedido;
  }

  async confirmarPago(id: number, datos: {
    metodoPago: string;
    referenciaPago?: string;
    bancoPago?: string;
    capturaPago?: string;
  }): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pedido = await this.findOne(id);

      // Verificar stock antes de confirmar
      for (const detalle of pedido.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.productoId }
        });
        if (!producto) throw new BadRequestException(
          `Producto ${detalle.nombreProducto} no encontrado`
        );
        if (producto.stock < detalle.cantidad) throw new BadRequestException(
          `Stock insuficiente para ${detalle.nombreProducto}. Disponible: ${producto.stock}`
        );
      }

      // Descontar stock
      for (const detalle of pedido.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.productoId }
        });
        await queryRunner.manager.update(Producto, detalle.productoId, {
          stock: producto!.stock - detalle.cantidad
        });
      }

      // Actualizar pedido
      pedido.estado = 'pago_recibido';
      pedido.metodoPago = datos.metodoPago;
      pedido.referenciaPago = datos.referenciaPago || '';
      pedido.bancoPago = datos.bancoPago || '';
      pedido.capturaPago = datos.capturaPago || '';
      await queryRunner.manager.save(pedido);

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getResumen() {
    const pedidos = await this.findAll();
    const hoy = new Date().toISOString().split('T')[0];

    const pedidosHoy = pedidos.filter(p =>
      new Date(p.fecha).toISOString().split('T')[0] === hoy
    );

    const totalRecaudado = pedidos
      .filter(p => p.estado !== 'cancelado')
      .reduce((sum, p) => sum + parseFloat(p.total.toString()), 0);

    const porEstado = {
      pendiente_pago: pedidos.filter(p => p.estado === 'pendiente_pago').length,
      pago_recibido: pedidos.filter(p => p.estado === 'pago_recibido').length,
      en_preparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
      en_camino: pedidos.filter(p => p.estado === 'en_camino').length,
      entregado: pedidos.filter(p => p.estado === 'entregado').length,
      cancelado: pedidos.filter(p => p.estado === 'cancelado').length,
    };

    return {
      totalPedidos: pedidos.length,
      pedidosHoy: pedidosHoy.length,
      totalRecaudado: totalRecaudado.toFixed(2),
      porEstado,
    };
  }
}

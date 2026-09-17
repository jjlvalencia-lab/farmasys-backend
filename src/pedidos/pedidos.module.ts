import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.entity';
import { DetallePedido } from './detalle-pedido.entity';
import { Producto } from '../productos/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, DetallePedido, Producto])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

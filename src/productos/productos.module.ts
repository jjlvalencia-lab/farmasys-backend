import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';
import { Venta } from '../ventas/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Venta])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}

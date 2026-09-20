import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotoristasController } from './motoristas.controller';
import { MotoristasService } from './motoristas.service';
import { Motorista } from './motorista.entity';
import { Pedido } from '../pedidos/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Motorista, Pedido])],
  controllers: [MotoristasController],
  providers: [MotoristasService],
})
export class MotoristasModule {}

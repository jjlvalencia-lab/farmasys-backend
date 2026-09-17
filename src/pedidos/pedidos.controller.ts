import { Controller, Get, Post, Put, Body,
         Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('pedidos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo pedido online' })
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos' })
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get('resumen')
  @ApiOperation({ summary: 'Resumen de pedidos para dashboard' })
  getResumen() {
    return this.pedidosService.getResumen();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado del pedido' })
  cambiarEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.pedidosService.cambiarEstado(+id, body.estado);
  }

  @Put(':id/confirmar-pago')
  @ApiOperation({ summary: 'Confirmar pago y descontar stock' })
  confirmarPago(@Param('id') id: string, @Body() body: {
    metodoPago: string;
    referenciaPago?: string;
    bancoPago?: string;
    capturaPago?: string;
  }) {
    return this.pedidosService.confirmarPago(+id, body);
  }
}

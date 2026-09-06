import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('ventas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta registrada correctamente' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o datos inválidos' })
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ventas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('cierre')
  @ApiOperation({ summary: 'Cierre de caja por fecha' })
  @ApiQuery({ name: 'fecha', required: false, type: String, example: '2026-09-06' })
  @ApiResponse({ status: 200, description: 'Resumen del cierre de caja' })
  getCierre(@Query('fecha') fecha: string) {
    const hoy = fecha || new Date().toISOString().split('T')[0];
    return this.ventasService.getCierreDelDia(hoy);
  }

  @Get('fecha')
  @ApiOperation({ summary: 'Buscar ventas por fecha' })
  @ApiQuery({ name: 'fecha', required: true, type: String, example: '2026-09-06' })
  @ApiResponse({ status: 200, description: 'Ventas del día seleccionado' })
  findByFecha(@Query('fecha') fecha: string) {
    return this.ventasService.findByFecha(fecha);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener venta por ID' })
  @ApiResponse({ status: 200, description: 'Detalle de la venta' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}

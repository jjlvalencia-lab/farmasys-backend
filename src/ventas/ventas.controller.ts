import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('cierre')
  getCierre(@Query('fecha') fecha: string) {
    const hoy = fecha || new Date().toISOString().split('T')[0];
    return this.ventasService.getCierreDelDia(hoy);
  }

  @Get('fecha')
  findByFecha(@Query('fecha') fecha: string) {
    return this.ventasService.findByFecha(fecha);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}

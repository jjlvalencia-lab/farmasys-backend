import { Controller, Get, Post, Put, Delete,
         Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MotoristasService } from './motoristas.service';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('motoristas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('motoristas')
export class MotoristasController {
  constructor(private readonly motoistasService: MotoristasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los motoristas' })
  findAll() {
    return this.motoistasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener motorista por ID' })
  findOne(@Param('id') id: string) {
    return this.motoistasService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Crear motorista (solo admin)' })
  create(@Body() dto: CreateMotoristaDto) {
    return this.motoistasService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar motorista (solo admin)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateMotoristaDto>) {
    return this.motoistasService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar motorista (solo admin)' })
  remove(@Param('id') id: string) {
    return this.motoistasService.remove(+id);
  }

  @Post(':motoristaId/asignar/:pedidoId')
  @ApiOperation({ summary: 'Asignar motorista a pedido' })
  asignarAPedido(
    @Param('motoristaId') motoristaId: string,
    @Param('pedidoId') pedidoId: string
  ) {
    return this.motoistasService.asignarAPedido(+pedidoId, +motoristaId);
  }
}

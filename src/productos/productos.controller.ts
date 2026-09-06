import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
  UploadedFile, UseInterceptors, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@ApiTags('productos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoria', required: false, type: String })
  @ApiQuery({ name: 'busqueda', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoria') categoria?: string,
    @Query('busqueda') busqueda?: string,
  ) {
    return this.productosService.findAll({ page, limit, categoria, busqueda });
  }

  @Get('rotacion')
  @ApiOperation({ summary: 'Rotación de productos' })
  getRotacion() {
    return this.productosService.getRotacion();
  }

  @Get('analisis')
  @ApiOperation({ summary: 'Análisis de inventario' })
  getAnalisis() {
    return this.productosService.getAnalisis();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto (solo admin)' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto (solo admin)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductoDto>) {
    return this.productosService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto (solo admin)' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @UseGuards(RolesGuard)
  @Post(':id/imagen')
  @ApiOperation({ summary: 'Subir imagen de producto a Cloudinary (solo admin)' })
  @UseInterceptors(FileInterceptor('imagen', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'), false);
      }
      cb(null, true);
    }
  }))
  async subirImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('No se recibió ninguna imagen');
    const url = await this.cloudinaryService.subirImagen(file.buffer, id);
    await this.productosService.update(+id, { imagenUrl: url });
    return { imagenUrl: url };
  }
}

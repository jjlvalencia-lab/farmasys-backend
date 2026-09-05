import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
  UploadedFile, UseInterceptors, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoria') categoria?: string,
    @Query('busqueda') busqueda?: string,
  ) {
    return this.productosService.findAll({ page, limit, categoria, busqueda });
  }

  @Get('rotacion')
  getRotacion() {
    return this.productosService.getRotacion();
  }

  @Get('analisis')
  getAnalisis() {
    return this.productosService.getAnalisis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductoDto>) {
    return this.productosService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @UseGuards(RolesGuard)
  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('imagen', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
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

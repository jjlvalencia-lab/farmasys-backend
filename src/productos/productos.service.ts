import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.productosRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(dto);
    return this.productosRepository.save(producto);
  }

  async update(id: number, dto: Partial<CreateProductoDto>): Promise<Producto> {
    await this.productosRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productosRepository.delete(id);
  }
}
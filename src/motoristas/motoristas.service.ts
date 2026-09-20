import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from './motorista.entity';
import { Pedido } from '../pedidos/pedido.entity';
import { CreateMotoristaDto } from './dto/create-motorista.dto';

@Injectable()
export class MotoristasService {
  constructor(
    @InjectRepository(Motorista)
    private motoristasRepository: Repository<Motorista>,
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
  ) {}

  findAll(): Promise<Motorista[]> {
    return this.motoristasRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Motorista> {
    const motorista = await this.motoristasRepository.findOne({ where: { id } });
    if (!motorista) throw new NotFoundException('Motorista no encontrado');
    return motorista;
  }

  create(dto: CreateMotoristaDto): Promise<Motorista> {
    const motorista = this.motoristasRepository.create(dto);
    return this.motoristasRepository.save(motorista);
  }

  async update(id: number, dto: Partial<CreateMotoristaDto>): Promise<Motorista> {
    await this.motoristasRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.motoristasRepository.delete(id);
  }

  async asignarAPedido(pedidoId: number, motoristaId: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id: pedidoId },
      relations: { detalles: true }
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    const motorista = await this.findOne(motoristaId);

    pedido.estado = 'en_camino';
    pedido.observacion = `${pedido.observacion || ''} | Motorista: ${motorista.nombre} | Placa: ${motorista.placa} | Vehículo: ${motorista.modeloVehiculo}`.trim();

    return this.pedidosRepository.save(pedido);
  }
}

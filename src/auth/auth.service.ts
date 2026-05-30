import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const existe = await this.usuariosRepository.findOne({
      where: { username },
    });
    if (existe) throw new ConflictException('El usuario ya existe');
    const hash = await bcrypt.hash(password, 10);
    const usuario = this.usuariosRepository.create({ username, password: hash });
    await this.usuariosRepository.save(usuario);
    return { mensaje: 'Usuario registrado correctamente' };
  }

  async login(username: string, password: string) {
    const usuario = await this.usuariosRepository.findOne({ where: { username } });
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) throw new UnauthorizedException('Credenciales incorrectas');
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}

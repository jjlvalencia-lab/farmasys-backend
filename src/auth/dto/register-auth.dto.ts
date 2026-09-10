import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'El usuario debe ser texto' })
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El usuario no puede tener más de 50 caracteres' })
  username!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no puede tener más de 100 caracteres',
  })
  password!: string;

  @IsOptional()
  @IsIn(['admin', 'empleado'], { message: 'El rol debe ser admin o empleado' })
  rol?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombreCompleto?: string;
}

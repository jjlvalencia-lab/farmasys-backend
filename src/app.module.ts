import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'xavier444',
      database: 'farmasys_db',
      autoLoadEntities: true,
      synchronize: false,
      extra: {
        timezone: 'America/Guayaquil',
      },
    }),
    ProductosModule,
    AuthModule,
    VentasModule,
  ],
})
export class AppModule {}

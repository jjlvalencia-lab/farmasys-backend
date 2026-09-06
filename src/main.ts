import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL') || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger — solo en desarrollo
  if (config.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('FarmaSys API')
      .setDescription('Sistema de gestión de inventario para farmacias')
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT'
      )
      .addTag('auth', 'Autenticación y registro de usuarios')
      .addTag('productos', 'Gestión de inventario')
      .addTag('ventas', 'Punto de venta y reportes')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: { persistAuthorization: true }
    });
    logger.log('📖 Swagger disponible en http://localhost:3000/api');
  }

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`🚀 FarmaSys backend corriendo en http://localhost:${port}`);
}
bootstrap();

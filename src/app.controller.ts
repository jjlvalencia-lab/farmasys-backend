import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      sistema: 'FarmaSys API',
      version: '1.0.0',
      entorno: this.config.get<string>('NODE_ENV') || 'development',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())} segundos`,
    };
  }
}

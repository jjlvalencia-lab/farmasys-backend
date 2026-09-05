import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async subirImagen(buffer: Buffer, nombreArchivo: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'farmasys/productos',
          public_id: `producto_${nombreArchivo}_${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      ).end(buffer);
    });
  }

  async eliminarImagen(url: string): Promise<void> {
    try {
      const partes = url.split('/');
      const archivo = partes[partes.length - 1].split('.')[0];
      const publicId = `farmasys/productos/${archivo}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error eliminando imagen de Cloudinary:', error);
    }
  }
}

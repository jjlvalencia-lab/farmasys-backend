import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isProduction
    ? 'db.uturpmxoyhhpjskcaixk.supabase.co'
    : 'localhost',
  port: 5432,
  username: 'postgres',
  password: isProduction
    ? 'X4v13r0412**'
    : 'xavier444',
  database: isProduction ? 'postgres' : 'farmasys_db',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

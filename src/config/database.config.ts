import { registerAs } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';

const databaseConfig = registerAs('database', () => ({
  dialect: 'postgres' as const,
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'orders_db',
  logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  pool: {
    max: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
    min: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE ?? '30000', 10),
    idle: parseInt(process.env.DB_POOL_IDLE ?? '10000', 10),
  },
}));

export default databaseConfig;
export type DatabaseConfig = ConfigType<typeof databaseConfig>;

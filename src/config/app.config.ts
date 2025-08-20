import { registerAs } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
  enableCors: (process.env.APP_ENABLE_CORS ?? 'true') === 'true',
  swagger: {
    enabled: (process.env.SWAGGER_ENABLED ?? 'true') === 'true',
    path: process.env.SWAGGER_PATH ?? 'api',
  },
}));

export default appConfig;
export type AppConfig = ConfigType<typeof appConfig>;

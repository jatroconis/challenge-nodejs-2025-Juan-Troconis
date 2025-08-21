import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        ttl: config.get<number>('redis.ttl'),
      }),
    }),
  ],
})
export class RedisModule {}

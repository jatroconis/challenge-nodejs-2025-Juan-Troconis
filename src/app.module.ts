import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { RedisModule } from './config/redis.module';

@Module({
  imports: [ConfigModule, DatabaseModule, OrdersModule, RedisModule],
})
export class AppModule {}

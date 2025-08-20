import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbCfg = configService.get<DatabaseConfig>('database');

        return {
          dialect: 'postgres',
          host: dbCfg.host,
          port: dbCfg.port,
          username: dbCfg.username,
          password: dbCfg.password,
          database: dbCfg.database,
          autoLoadModels: true,
          synchronize: true,
          logging: dbCfg.logging ? console.log : false,
          pool: dbCfg.pool,
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pedido } from 'src/pedidos/pedidos/pedido.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        return {
          dialect: 'mysql',
          uri: dbUrl,
          autoLoadModels: true,
          synchronize: true,
          models: [Pedido],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class SequelizeConfigModule {}
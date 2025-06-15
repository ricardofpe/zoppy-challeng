import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pedido } from 'src/pedidos/pedidos/pedido.model';
import { Produto } from 'src/produtos/produto.model';
import { PedidoProduto } from 'src/produtos/pedido-produto-model';

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
          models: [ Produto, Pedido, PedidoProduto],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class SequelizeConfigModule {}
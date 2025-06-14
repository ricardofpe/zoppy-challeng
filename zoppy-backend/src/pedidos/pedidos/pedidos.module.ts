import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';


import { Pedido } from './pedido.model';
import { PedidosService } from './pedidos.service';
import { PedidosController } from '../pedido/pedido.controller';

@Module({
  imports: [SequelizeModule.forFeature([Pedido])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
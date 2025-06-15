import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';


import { Pedido } from './pedido.model';
import { PedidosService } from './pedidos.service';
import { PedidosController } from '../pedido/pedido.controller';
import { Produto } from 'src/produtos/produto.model';
import { PedidoProduto } from 'src/produtos/pedido-produto-model';

@Module({
  imports: [SequelizeModule.forFeature([Pedido, Produto, PedidoProduto])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
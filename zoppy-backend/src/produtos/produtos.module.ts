import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { Produto } from './produto.model';
import { Pedido } from 'src/pedidos/pedidos/pedido.model';
import { PedidoProduto } from './pedido-produto-model';


@Module({
  imports: [SequelizeModule.forFeature([Produto, Pedido, PedidoProduto])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService], 
})
export class ProdutosModule {}
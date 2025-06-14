import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedido.controller';

import { SequelizeModule } from '@nestjs/sequelize';
import { PedidosService } from '../pedidos/pedidos.service';
import { Pedido } from '../pedidos/pedido.model';

describe('PedidoController', () => {
  let controller: PedidosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Pedido],
          synchronize: true,
        }),
        SequelizeModule.forFeature([Pedido]),
      ],
      controllers: [PedidosController],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

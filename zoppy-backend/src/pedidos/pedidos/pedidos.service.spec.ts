import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.model';
import { SequelizeModule } from '@nestjs/sequelize';

describe('PedidosService', () => {
  let service: PedidosService;

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
      providers: [PedidosService],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
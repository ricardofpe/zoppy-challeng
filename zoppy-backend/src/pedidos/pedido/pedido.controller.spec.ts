import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedido.controller';
import { PedidosService } from '../pedidos/pedidos.service';
import { Pedido } from '../pedidos/pedido.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { GetPedidosDto } from '../pedidos/dto/get-pedidos.dto';

describe('PedidosController', () => {
  let controller: PedidosController;
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
      controllers: [PedidosController],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const pedidoMock = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente' };
      jest.spyOn(service, 'create').mockResolvedValue(pedidoMock as any);

      const result = await controller.create(pedidoMock);

      expect(service.create).toHaveBeenCalledWith(pedidoMock);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle errors during creation', async () => {
      const pedidoMock = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente' };
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Erro ao criar'));

      try {
        await controller.create(pedidoMock);
      } catch (error) {
        expect(error.message).toEqual('Erro ao criar');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of pedidos with pagination and count', async () => {
      const pedidosMock = [{ cliente: 'Cliente 1' }, { cliente: 'Cliente 2' }];
      const countMock = 2;
      const findAllMock = { rows: pedidosMock, count: countMock };
      jest.spyOn(service, 'findAll').mockResolvedValue(findAllMock as any);

      const queryParams: GetPedidosDto = { page: 1, limit: 10 };
      const result = await controller.findAll(queryParams);

      expect(service.findAll).toHaveBeenCalledWith(queryParams);
      expect(result).toEqual(findAllMock);
    });

    it('should handle errors during findAll', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Erro ao buscar todos'));

      const queryParams: GetPedidosDto = { page: 1, limit: 10 };

      try {
        await controller.findAll(queryParams);
      } catch (error) {
        expect(error.message).toEqual('Erro ao buscar todos');
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste' };
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      try {
        await controller.findOne('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Pedido não encontrado');
      }
    });

    it('should handle errors during findOne', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Erro ao buscar'));

      try {
        await controller.findOne('1');
      } catch (error) {
        expect(error.message).toEqual('Erro ao buscar');
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Atualizado' };
      jest.spyOn(service, 'update').mockResolvedValue(pedidoMock as any);

      const result = await controller.update('1', { cliente: 'Cliente Atualizado' });

      expect(service.update).toHaveBeenCalledWith(1, { cliente: 'Cliente Atualizado' });
      expect(result).toEqual(pedidoMock);
    });

    it('should handle NotFoundException during update', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      try {
        await controller.update('1', { cliente: 'Cliente Atualizado' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Pedido não encontrado');
      }
    });

    it('should handle errors during update', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error('Erro ao atualizar'));

      try {
        await controller.update('1', { cliente: 'Cliente Atualizado' });
      } catch (error) {
        expect(error.message).toEqual('Erro ao atualizar');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('remove', () => {
    it('should remove a pedido', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Pedido com ID 1 removido com sucesso.' });
    });

    it('should handle NotFoundException during remove', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      try {
        await controller.remove('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Pedido não encontrado');
      }
    });

    it('should handle errors during remove', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error('Erro ao remover'));

      try {
        await controller.remove('1');
      } catch (error) {
        expect(error.message).toEqual('Erro ao remover');
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
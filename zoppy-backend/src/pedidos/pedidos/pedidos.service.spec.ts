import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('PedidosService', () => {
  let service: PedidosService;
  let pedidoModel: typeof Pedido;

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
    pedidoModel = module.get<typeof Pedido>(getModelToken(Pedido));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pedidos', async () => {
      const pedidosMock = [{ cliente: 'Cliente 1' }, { cliente: 'Cliente 2' }];
      jest.spyOn(pedidoModel, 'findAll').mockResolvedValue(pedidosMock as any);

      const result = await service.findAll();

      expect(pedidoModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(pedidosMock);
    });

    it('should handle errors during findAll', async () => {
      jest.spyOn(pedidoModel, 'findAll').mockRejectedValue(new Error('Erro ao buscar'));

      await expect(service.findAll()).rejects.toThrowError('Não foi possível buscar a lista de pedidos.');
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste' };
      jest.spyOn(pedidoModel, 'findByPk').mockResolvedValue(pedidoMock as any);

      const result = await service.findOne(1);

      expect(pedidoModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(pedidoMock);
    });

    it('should throw NotFoundException if pedido is not found', async () => {
      jest.spyOn(pedidoModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during findOne', async () => {
      jest.spyOn(pedidoModel, 'findByPk').mockRejectedValue(new Error('Erro ao buscar'));

      await expect(service.findOne(1)).rejects.toThrowError('Não foi possível buscar o pedido com ID 1.');
    });
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const pedidoMock = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente' };
      jest.spyOn(pedidoModel, 'create').mockResolvedValue(pedidoMock as any);

      const result = await service.create(pedidoMock);

      expect(pedidoModel.create).toHaveBeenCalledWith(pedidoMock);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle errors during create', async () => {
      const pedidoMock = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente' };
      jest.spyOn(pedidoModel, 'create').mockRejectedValue(new Error('Erro ao criar'));

      await expect(service.create(pedidoMock)).rejects.toThrowError('Não foi possível criar o pedido. Verifique os dados e tente novamente.');
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Atualizado' };
      jest.spyOn(pedidoModel, 'update').mockResolvedValue([[1], [pedidoMock]] as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);

      const result = await service.update(1, { cliente: 'Cliente Atualizado' });

      expect(pedidoModel.update).toHaveBeenCalledWith({ cliente: 'Cliente Atualizado' }, { where: { id: 1 }, returning: true });
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(pedidoMock);
    });

    it('should throw NotFoundException if pedido is not found during update', async () => {
      jest.spyOn(pedidoModel, 'update').mockResolvedValue([[0], []] as any);

      await expect(service.update(1, { cliente: 'Cliente Atualizado' })).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during update', async () => {
      jest.spyOn(pedidoModel, 'update').mockRejectedValue(new Error('Erro ao atualizar'));

      await expect(service.update(1, { cliente: 'Cliente Atualizado' })).rejects.toThrowError('Não foi possível atualizar o pedido com ID 1. Verifique os dados e tente novamente.');
    });
  });

  describe('remove', () => {
    it('should remove a pedido', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste', destroy: jest.fn() };
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(pedidoMock.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if pedido is not found during remove', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      await expect(service.remove(1)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during remove', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste', destroy: jest.fn().mockRejectedValue(new Error('Erro ao remover')) };
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);

      await expect(service.remove(1)).rejects.toThrowError('Não foi possível remover o pedido com ID 1.');
    });
  });
});
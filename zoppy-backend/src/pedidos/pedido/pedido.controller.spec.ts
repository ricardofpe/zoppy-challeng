import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Query, HttpStatus, NotFoundException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedido.controller';
import { PedidosService } from '../pedidos/pedidos.service';
import { Pedido } from '../pedidos/pedido.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GetPedidosDto } from '../pedidos/dto/get-pedidos.dto';
import { CreatePedidoDto } from '../pedidos/dto/create-pedido.dto';
import { UpdatePedidoDto } from '../pedidos/dto/update-pedido.dto';
import { Produto } from 'src/produtos/produto.model';
import { PedidoProduto } from 'src/produtos/pedido-produto-model';

describe('PedidosController', () => {
  let controller: PedidosController;
  let service: PedidosService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Pedido, Produto, PedidoProduto],
          synchronize: true,
          autoLoadModels: true,
          logging: false,
        }),
        SequelizeModule.forFeature([Pedido, Produto, PedidoProduto]),
      ],
      controllers: [PedidosController],
      providers: [PedidosService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto: CreatePedidoDto = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente', produtoIds: [] };
      const pedidoMock = { id: 1, ...createPedidoDto };
      jest.spyOn(service, 'create').mockResolvedValue(pedidoMock as any);

      const result = await controller.create(createPedidoDto);

      expect(service.create).toHaveBeenCalledWith(createPedidoDto);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle errors during creation', async () => {
      const createPedidoDto: CreatePedidoDto = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente', produtoIds: [] };
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Erro ao criar'));

      await expect(controller.create(createPedidoDto)).rejects.toThrowError('Erro ao criar');
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

      await expect(controller.findAll(queryParams)).rejects.toThrowError('Erro ao buscar todos');
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste' };
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      await expect(controller.findOne(1)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during findOne', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Erro ao buscar'));

      await expect(controller.findOne(1)).rejects.toThrowError('Erro ao buscar');
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [] };
      const pedidoMock = { id: 1, cliente: 'Cliente Atualizado' };
      jest.spyOn(service, 'update').mockResolvedValue(pedidoMock as any);

      const result = await controller.update(1, updatePedidoDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePedidoDto);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle NotFoundException during update', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [] };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      await expect(controller.update(1, updatePedidoDto)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during update', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [] };
      jest.spyOn(service, 'update').mockRejectedValue(new Error('Erro ao atualizar'));

      await expect(controller.update(1, updatePedidoDto)).rejects.toThrowError('Erro ao atualizar');
    });
  });

  describe('remove', () => {
    it('should remove a pedido', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Pedido com ID 1 removido com sucesso.' });
    });

    it('should handle NotFoundException during remove', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Pedido não encontrado'));

      await expect(controller.remove(1)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during remove', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error('Erro ao remover'));

      await expect(controller.remove(1)).rejects.toThrowError('Erro ao remover');
    });
  });
});
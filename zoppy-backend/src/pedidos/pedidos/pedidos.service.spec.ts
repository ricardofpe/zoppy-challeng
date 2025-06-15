import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { GetPedidosDto } from './dto/get-pedidos.dto';
import { Op } from 'sequelize';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Produto } from 'src/produtos/produto.model';
import { PedidoProduto } from 'src/produtos/pedido-produto-model';

describe('PedidosService', () => {
  let service: PedidosService;
  let pedidoModel: typeof Pedido;
  let produtoModel: typeof Produto;
  let pedidoProdutoModel: typeof PedidoProduto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Pedido, Produto, PedidoProduto],
          synchronize: true,
          autoLoadModels: true,
          logging: false
        }),
        SequelizeModule.forFeature([Pedido, Produto, PedidoProduto]),
      ],
      providers: [PedidosService],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    pedidoModel = module.get<typeof Pedido>(getModelToken(Pedido));
    produtoModel = module.get<typeof Produto>(getModelToken(Produto));
    pedidoProdutoModel = module.get<typeof PedidoProduto>(getModelToken(PedidoProduto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pedidos with pagination and count', async () => {
      const pedidosMock = [{ cliente: 'Cliente 1' }, { cliente: 'Cliente 2' }];
      const countMock = 2;
      const findAndCountAllMock = { rows: pedidosMock, count: countMock };
      jest.spyOn(pedidoModel, 'findAndCountAll').mockResolvedValue(findAndCountAllMock as any);

      const queryParams: GetPedidosDto = { page: 1, limit: 10 };
      const result = await service.findAll(queryParams);

      expect(pedidoModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        offset: 0,
        limit: 10,
        order: [['dataPedido', 'DESC']],
        include: [Produto]
      });
      expect(result).toEqual({ rows: pedidosMock, count: countMock });
    });

    it('should apply filters and pagination', async () => {
      const pedidosMock = [{ cliente: 'Cliente Filtered' }];
      const countMock = 1;
      const findAndCountAllMock = { rows: pedidosMock, count: countMock };
      jest.spyOn(pedidoModel, 'findAndCountAll').mockResolvedValue(findAndCountAllMock as any);

      const queryParams: GetPedidosDto = { page: 1, limit: 5, cliente: 'Filtered', status: 'Pendente', dataPedidoInicio: '2023-01-01', dataPedidoFim: '2023-01-31' };
      await service.findAll(queryParams);

      expect(pedidoModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          cliente: { [Op.like]: '%Filtered%' },
          status: 'Pendente',
          dataPedido: { [Op.between]: [new Date('2023-01-01'), new Date('2023-01-31')] }
        },
        offset: 0,
        limit: 5,
        order: [['dataPedido', 'DESC']],
        include: [Produto]
      });
    });

    it('should handle errors during findAll', async () => {
      jest.spyOn(pedidoModel, 'findAndCountAll').mockRejectedValue(new Error('Erro ao buscar'));

      const queryParams: GetPedidosDto = { page: 1, limit: 10 };
      await expect(service.findAll(queryParams)).rejects.toThrowError('Não foi possível buscar a lista de pedidos.');
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const pedidoMock = { id: 1, cliente: 'Cliente Teste' };
      jest.spyOn(pedidoModel, 'findByPk').mockResolvedValue(pedidoMock as any);

      const result = await service.findOne(1);

      expect(pedidoModel.findByPk).toHaveBeenCalledWith(1, { include: [Produto] });
      expect(result).toEqual(pedidoMock);
    });

    it('should throw NotFoundException if pedido is not found', async () => {
      jest.spyOn(pedidoModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during findOne', async () => {
      jest.spyOn(pedidoModel, 'findByPk').mockRejectedValue(new Error('Erro ao buscar'));

      await expect(service.findOne(1)).rejects.toThrowError(`Não foi possível buscar o pedido com ID 1.`);
    });
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto: CreatePedidoDto = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente', produtoIds: [1, 2] };
      const pedidoMock = { id: 1, ...createPedidoDto };

      jest.spyOn(produtoModel, 'findByPk').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(pedidoModel, 'create').mockResolvedValue(pedidoMock as any);
      jest.spyOn(PedidoProduto, 'create').mockResolvedValue({ pedidoId: 1, produtoId: 1 } as any);

      const result = await service.create(createPedidoDto);

      expect(produtoModel.findByPk).toHaveBeenCalledTimes(2);
      expect(pedidoModel.create).toHaveBeenCalledWith(createPedidoDto);
      expect(PedidoProduto.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(pedidoMock);
    });

    it('should handle errors during create', async () => {
      const createPedidoDto: CreatePedidoDto = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente', produtoIds: [1] };
      jest.spyOn(pedidoModel, 'create').mockRejectedValue(new Error('Erro ao criar'));

      await expect(service.create(createPedidoDto)).rejects.toThrowError('Não foi possível criar o pedido. Verifique os dados e tente novamente.');
    });

    it('should throw NotFoundException if product not found during create', async () => {
        const createPedidoDto: CreatePedidoDto = { cliente: 'Cliente Teste', dataPedido: new Date(), valorTotal: 100, status: 'Pendente', produtoIds: [1] };
        jest.spyOn(produtoModel, 'findByPk').mockResolvedValue(null);

        await expect(service.create(createPedidoDto)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [1, 2] };
      const pedidoMock = { id: 1, cliente: 'Cliente Atualizado' };

      jest.spyOn(pedidoModel, 'update').mockResolvedValue([[1]] as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(pedidoMock as any);
      jest.spyOn(PedidoProduto, 'destroy').mockResolvedValue(1);
      jest.spyOn(produtoModel, 'findByPk').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(PedidoProduto, 'create').mockResolvedValue({ pedidoId: 1, produtoId: 1 } as any);

      const result = await service.update(1, updatePedidoDto);

      expect(pedidoModel.update).toHaveBeenCalledWith(updatePedidoDto, { where: { id: 1 }, returning: true });
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(PedidoProduto.destroy).toHaveBeenCalledWith({ where: { pedidoId: 1 } });
      expect(produtoModel.findByPk).toHaveBeenCalledTimes(2);
      expect(PedidoProduto.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(pedidoMock);
    });

    it('should throw NotFoundException if pedido is not found during update', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [1] };
      jest.spyOn(pedidoModel, 'update').mockResolvedValue([[0]] as any);

      await expect(service.update(1, updatePedidoDto)).rejects.toThrowError(NotFoundException);
    });

    it('should handle errors during update', async () => {
      const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Atualizado', produtoIds: [1] };
      jest.spyOn(pedidoModel, 'update').mockRejectedValue(new Error('Erro ao atualizar'));

      await expect(service.update(1, updatePedidoDto)).rejects.toThrowError(`Não foi possível atualizar o pedido com ID 1. Verifique os dados e tente novamente.`);
    });

      it('should throw NotFoundException if product not found during update', async () => {
        const updatePedidoDto: UpdatePedidoDto = { cliente: 'Cliente Teste', produtoIds: [1] };
        jest.spyOn(pedidoModel, 'update').mockResolvedValue([[1]] as any);
        jest.spyOn(service, 'findOne').mockResolvedValue({id: 1} as any);
        jest.spyOn(PedidoProduto, 'destroy').mockResolvedValue(1);
        jest.spyOn(produtoModel, 'findByPk').mockResolvedValue(null);

        await expect(service.update(1, updatePedidoDto)).rejects.toThrowError(NotFoundException);
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

      await expect(service.remove(1)).rejects.toThrowError(`Não foi possível remover o pedido com ID 1.`);
    });
  });
});
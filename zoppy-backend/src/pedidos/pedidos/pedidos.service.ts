import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pedido } from './pedido.model';
import { GetPedidosDto } from './dto/get-pedidos.dto';
import { Op } from 'sequelize';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido)
    private pedidoModel: typeof Pedido,
  ) {}

  async findAll(query: GetPedidosDto): Promise<{ rows: Pedido[]; count: number }> {
    try {
      let { page = 1, limit = 10, cliente, status, dataPedidoInicio, dataPedidoFim } = query;

      page = parseInt(page.toString(), 10);
      limit = parseInt(limit.toString(), 10);

      const offset = (page - 1) * limit;

      const where: any = {};

      if (cliente) {
        where.cliente = { [Op.like]: `%${cliente}%` }; 
      }

      if (status) {
        where.status = status;
      }

      if (dataPedidoInicio && dataPedidoFim) {
          where.dataPedido = {
              [Op.between]: [new Date(dataPedidoInicio), new Date(dataPedidoFim)]
          };
      } else if (dataPedidoInicio) {
          where.dataPedido = {
              [Op.gte]: new Date(dataPedidoInicio)
          };
      } else if (dataPedidoFim) {
          where.dataPedido = {
              [Op.lte]: new Date(dataPedidoFim)
          };
      }

      const { rows, count } = await this.pedidoModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [['dataPedido', 'DESC']], 
      });

      return { rows, count };
    } catch (error) {
      console.error('Erro ao buscar pedidos com paginação e filtros:', error);
      throw new Error('Não foi possível buscar a lista de pedidos.');
    }
  }

  async findOne(id: number): Promise<Pedido> {
    try {
      const pedido = await this.pedidoModel.findByPk(id);
      if (!pedido) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
      }
      return pedido;
    } catch (error) {
      console.error(`Erro ao buscar pedido com ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Não foi possível buscar o pedido com ID ${id}.`);
    }
  }

  async create(pedido: any): Promise<Pedido> {
    try {
      return await this.pedidoModel.create(pedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error('Não foi possível criar o pedido. Verifique os dados e tente novamente.');
    }
  }

  async update(id: number, pedido: any): Promise<Pedido> {
    try {
      const [numberOfAffectedRows, updatedPedidos] = await this.pedidoModel.update(pedido, {
        where: { id },
        returning: true,
      });

      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado para atualização.`);
      }

      const updatedPedido = await this.findOne(id);
      return updatedPedido;

    } catch (error) {
      console.error(`Erro ao atualizar pedido com ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Não foi possível atualizar o pedido com ID ${id}. Verifique os dados e tente novamente.`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const pedido = await this.findOne(id);
      if (!pedido) {
        throw new NotFoundException(`Não foi possível excluir: Pedido com ID ${id} não encontrado.`);
      }
      await pedido.destroy();
    } catch (error) {
      console.error(`Erro ao remover pedido com ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Não foi possível remover o pedido com ID ${id}.`);
    }
  }
}
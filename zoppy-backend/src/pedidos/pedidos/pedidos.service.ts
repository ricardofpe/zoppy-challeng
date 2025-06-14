import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pedido } from './pedido.model';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido)
    private pedidoModel: typeof Pedido,
  ) {}

  async findAll(): Promise<Pedido[]> {
    try {
      return await this.pedidoModel.findAll();
    } catch (error) {
      console.error('Erro ao buscar todos os pedidos:', error);
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
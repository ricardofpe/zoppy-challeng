import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Produto } from './produto.model';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PedidoProduto } from './pedido-produto-model';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto)
    private produtoModel: typeof Produto,
    @InjectModel(PedidoProduto)
    private pedidoProdutoModel: typeof PedidoProduto,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    try {
      const produto = await this.produtoModel.create(createProdutoDto);
      return produto;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Não foi possível criar o produto.');
    }
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoModel.findAll();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoModel.findByPk(id);
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    try {
      const [affectedCount] = await this.produtoModel.update(updateProdutoDto, {
        where: { id },
      });

      if (affectedCount === 0) {
        throw new NotFoundException(`Produto com ID ${id} não encontrado para atualização.`);
      }

      const produto = await this.produtoModel.findByPk(id);
      return produto;

    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error);
      throw new Error('Não foi possível atualizar o produto.');
    }
  }

  async remove(id: number): Promise<void> {
    const produto = await this.produtoModel.findByPk(id);
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    const associatedPedidos = await this.pedidoProdutoModel.count({
      where: { produtoId: id },
    });

    if (associatedPedidos > 0) {
      throw new ConflictException(`Não é possível excluir o produto com ID ${id} porque está associado a um ou mais pedidos.`);
    }

    await produto.destroy();
  }
}
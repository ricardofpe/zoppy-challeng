import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Produto } from './produto.model';
import { Pedido } from 'src/pedidos/pedidos/pedido.model';

@Table({ tableName: 'pedido_produto', timestamps: false })
export class PedidoProduto extends Model<PedidoProduto> {
  @ForeignKey(() => Pedido)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  pedidoId: number;

  @ForeignKey(() => Produto)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  produtoId: number;
}
import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Produto } from 'src/produtos/produto.model';
import { PedidoProduto } from 'src/produtos/pedido-produto-model';

@Table({ tableName: 'pedidos' })
export class Pedido extends Model<Pedido> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number = undefined;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cliente: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataPedido: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  valorTotal: number;

  @Column({
    type: DataType.STRING,
  })
  status: string;

  @BelongsToMany(() => Produto, () => PedidoProduto)
  produtos: Produto[];
}
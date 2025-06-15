import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Pedido } from 'src/pedidos/pedidos/pedido.model';
import { PedidoProduto } from './pedido-produto-model';


@Table({ tableName: 'produtos' })
export class Produto extends Model<Produto> {
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
  nome: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descricao: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  preco: number;

  @BelongsToMany(() => Pedido, () => PedidoProduto)
  pedidos: Pedido[];
}
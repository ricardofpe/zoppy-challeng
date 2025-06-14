import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
}

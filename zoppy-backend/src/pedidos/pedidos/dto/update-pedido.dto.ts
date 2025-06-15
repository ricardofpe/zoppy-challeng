export class UpdatePedidoDto {
  cliente?: string;
  dataPedido?: Date;
  valorTotal?: number;
  status?: string;
  produtoIds?: number[]; 
}
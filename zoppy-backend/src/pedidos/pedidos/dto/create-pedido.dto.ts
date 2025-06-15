export class CreatePedidoDto {
  cliente: string;
  dataPedido: Date;
  valorTotal: number;
  status: string;
  produtoIds: number[];  
}
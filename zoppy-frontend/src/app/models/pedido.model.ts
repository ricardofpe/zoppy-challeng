export interface Pedido {
  id?: number;
  cliente: string;
  dataPedido: string; 
  valorTotal: number;
  status: string;
}
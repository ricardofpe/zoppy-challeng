import { Produto } from "./produto.model";

export interface Pedido {
    id?: number;
    cliente: string;
    dataPedido: string;
    valorTotal: number;
    status: string;
    produtoIds?: number[];
    produtos?: Produto[];
}
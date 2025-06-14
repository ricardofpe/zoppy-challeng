import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import type { Observable } from "rxjs";
import type { Pedido } from "../models/pedido.model";

interface PagedResponse<T> {
    rows: T[];
    count: number;
}

interface FilterParams {
    page?: number;
    limit?: number;
    cliente?: string;
    status?: string;
    dataPedidoInicio?: string;
    dataPedidoFim?: string;
}

@Injectable({
    providedIn: "root",
})
export class PedidoService {
    private http = inject(HttpClient);
    private apiUrl = "http://localhost:3000/pedidos";

    findAll(filters: FilterParams = {}): Observable<PagedResponse<Pedido>> {
        let params = new HttpParams();

        if (filters.page) {
            params = params.set('page', filters.page.toString());
        }
        if (filters.limit) {
            params = params.set('limit', filters.limit.toString());
        }
        if (filters.cliente) {
            params = params.set('cliente', filters.cliente);
        }
        if (filters.status) {
            params = params.set('status', filters.status);
        }
        if (filters.dataPedidoInicio) {
            params = params.set('dataPedidoInicio', filters.dataPedidoInicio);
        }
        if (filters.dataPedidoFim) {
            params = params.set('dataPedidoFim', filters.dataPedidoFim);
        }

        return this.http.get<PagedResponse<Pedido>>(this.apiUrl, { params: params });
    }

    findOne(id: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
    }

    create(pedido: Pedido): Observable<Pedido> {
        return this.http.post<Pedido>(this.apiUrl, pedido);
    }

    update(id: number, pedido: Pedido): Observable<Pedido> {
        return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
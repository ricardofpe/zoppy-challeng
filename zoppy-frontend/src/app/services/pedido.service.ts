import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import type { Observable } from "rxjs";
import type { Pedido } from "../models/pedido.model";

interface PagedResponse<T> {
  rows: T[];
  count: number;
}

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/pedidos";

  findAll(page: number = 1, limit: number = 10): Observable<PagedResponse<Pedido>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

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
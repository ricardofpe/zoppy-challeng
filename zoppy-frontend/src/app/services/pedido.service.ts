import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Pedido } from "../models/pedido.model"

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private http = inject(HttpClient)
  private apiUrl = "http://localhost:3000/pedidos"

  findAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl)
  }

  findOne(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`)
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido)
  }

  update(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido)
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
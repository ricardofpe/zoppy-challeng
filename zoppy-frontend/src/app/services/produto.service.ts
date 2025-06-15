import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Produto } from '../models/produto.model';

@Injectable({
    providedIn: 'root',
})
export class ProdutoService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/produtos';

    findAll(): Observable<Produto[]> {
        return this.http.get<Produto[]>(this.apiUrl);
    }

    findById(id: number): Observable<Produto> {
        return this.findOne(id); 
    }

    findOne(id: number): Observable<Produto> {
        return this.http.get<Produto>(`${this.apiUrl}/${id}`);
    }

    create(produto: any): Observable<Produto> {
        return this.http.post<Produto>(this.apiUrl, produto);
    }

    update(id: number, produto: any): Observable<Produto> {
        return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
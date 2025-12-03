import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { Estoque } from '../models/estoque';

@Injectable({
    providedIn: 'root'
})
export class EstoqueService {
    private apiUrl = `${environment.apiUrl}/api/Estoque`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Estoque[]> {
        return this.http.get<Estoque[]>(this.apiUrl);
    }

    getById(id: number): Observable<Estoque> {
        return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
    }

    create(estoque: { produtoSkuId: number; quantidadeAtual: number }): Observable<Estoque> {
        const body = {
            produtoSkuId: estoque.produtoSkuId,
            quantidadeAtual: estoque.quantidadeAtual
        };
        return this.http.post<Estoque>(this.apiUrl, body);
    }

    update(id: number, quantidadeAtual: number): Observable<void> {
        const body = {
            quantidadeAtual: quantidadeAtual
        };
        return this.http.put<void>(`${this.apiUrl}/${id}`, body);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { ProdutoVariation } from '../models/produto-variation';

@Injectable({
    providedIn: 'root'
})
export class ProdutoVariationService {
    private apiUrl = `${environment.apiUrl}/api/ProdutoVariation`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<ProdutoVariation[]> {
        return this.http.get<ProdutoVariation[]>(this.apiUrl);
    }

    getById(id: number): Observable<ProdutoVariation> {
        return this.http.get<ProdutoVariation>(`${this.apiUrl}/${id}`);
    }

    create(variation: Omit<ProdutoVariation, 'id'>): Observable<ProdutoVariation> {
        const body = {
            nome: variation.nome?.trim() || '',
            descricao: variation.descricao?.trim() || null
        };
        return this.http.post<ProdutoVariation>(this.apiUrl, body);
    }

    update(id: number, variation: Omit<ProdutoVariation, 'id'>): Observable<ProdutoVariation> {
        const body = {
            nome: variation.nome?.trim() || '',
            descricao: variation.descricao?.trim() || null
        };
        return this.http.put<ProdutoVariation>(`${this.apiUrl}/${id}`, body);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}


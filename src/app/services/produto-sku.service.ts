import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { ProdutoSku } from '../models/produto-sku';

export interface ProdutoSkuPagedResponse {
    data: ProdutoSku[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProdutoSkuService {
    private apiUrl = `${environment.apiUrl}/api/ProdutoSku`;

    constructor(private http: HttpClient) { }

    getAll(pageNumber: number = 0, pageSize: number = 10, includeInactive: boolean = false): Observable<ProdutoSkuPagedResponse> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString())
            .set('includeInactive', includeInactive.toString());

        return this.http.get<ProdutoSkuPagedResponse>(this.apiUrl, { params });
    }

    getAllAsArray(): Observable<ProdutoSku[]> {
        return this.http.get<ProdutoSku[]>(this.apiUrl);
    }

    getById(id: number): Observable<ProdutoSku> {
        return this.http.get<ProdutoSku>(`${this.apiUrl}/${id}`);
    }

    getByProdutoId(produtoId: number): Observable<ProdutoSku[]> {
        // Busca todos os SKUs e filtra por produtoId no cliente
        // TODO: Verificar se a API tem endpoint específico para buscar por produtoId
        return this.http.get<ProdutoSku[]>(this.apiUrl);
    }

    create(sku: Omit<ProdutoSku, 'id'>): Observable<ProdutoSku> {
        const body = {
            produtoId: sku.produtoId,
            produtoVariationId1: sku.produtoVariationId1,
            produtoVariationId2: sku.produtoVariationId2,
            descricao: sku.descricao?.trim() || '',
            precoVenda: sku.precoVenda || 0
        };
        return this.http.post<ProdutoSku>(this.apiUrl, body);
    }

    update(id: number, sku: Omit<ProdutoSku, 'id'>): Observable<ProdutoSku> {
        const body = {
            produtoId: sku.produtoId,
            produtoVariationId1: sku.produtoVariationId1,
            produtoVariationId2: sku.produtoVariationId2,
            descricao: sku.descricao?.trim() || '',
            precoVenda: sku.precoVenda || 0
        };
        return this.http.put<ProdutoSku>(`${this.apiUrl}/${id}`, body);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    activate(id: number): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {});
    }

    deactivate(id: number): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {});
    }
}


import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { Produto } from '../models/produto';

export interface ProdutoPagedResponse {
  data: Produto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.apiUrl}/api/Produto`;

  constructor(private http: HttpClient) { }

  getAll(pageNumber: number = 0, pageSize: number = 10, includeInactive: boolean = false): Observable<ProdutoPagedResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('includeInactive', includeInactive.toString());

    return this.http.get<ProdutoPagedResponse>(this.apiUrl, { params });
  }

  // Alias para compatibilidade com chamadas existentes em outros arquivos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  create(produto: Omit<Produto, 'id'>): Observable<Produto> {
    const body = {
      nome: produto.nome?.trim() || '',
      descricao: produto.descricao?.trim() || '',
      precoCusto: produto.precoCusto ?? 0,
      precoVenda: produto.precoVenda || 0,
      fornecedorId: produto.fornecedorId || 0
    };

    console.log('Enviando produto para API:', JSON.stringify(body, null, 2));
    return this.http.post<Produto>(this.apiUrl, body);
  }

  update(id: number, produto: Omit<Produto, 'id'>): Observable<Produto> {
    const body = {
      nome: produto.nome?.trim() || '',
      descricao: produto.descricao?.trim() || '',
      precoCusto: produto.precoCusto ?? 0,
      precoVenda: produto.precoVenda || 0,
      fornecedorId: produto.fornecedorId || 0
    };

    console.log('Atualizando produto na API:', JSON.stringify(body, null, 2));
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, body);
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

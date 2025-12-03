import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { Venda } from '../models/venda';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = `${environment.apiUrl}/api/Venda`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  getById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  create(venda: Omit<Venda, 'id' | 'dataVenda' | 'valorTotal'>): Observable<Venda> {
    const body = {
      nomeCliente: venda.nomeCliente,
      itens: venda.itens.map(item => ({
        produtoSkuId: item.produtoSkuId,
        quantidade: item.quantidade
      }))
    };
    return this.http.post<Venda>(this.apiUrl, body);
  }

  update(id: number, venda: Omit<Venda, 'id' | 'dataVenda' | 'valorTotal'>): Observable<Venda> {
    const body = {
      nomeCliente: venda.nomeCliente,
      itens: venda.itens.map(item => ({
        produtoSkuId: item.produtoSkuId,
        quantidade: item.quantidade
      }))
    };
    return this.http.put<Venda>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

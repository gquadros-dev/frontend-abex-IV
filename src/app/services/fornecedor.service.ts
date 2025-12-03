import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../components/environment';
import { Fornecedor } from '../models/fornecedor';

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/api/Fornecedor`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
  }

  private limparFormatacao(valor: string): string {
    return valor.replace(/[.\-\/()\s]/g, '');
  }

  create(fornecedor: Omit<Fornecedor, 'id'>): Observable<Fornecedor> {
    const body = {
      nome: fornecedor.nome.trim(),
      cnpjCpf: this.limparFormatacao(fornecedor.cnpjCpf),
      email: fornecedor.email.trim(),
      telefone: this.limparFormatacao(fornecedor.telefone),
      endereco: fornecedor.endereco.trim()
    };
    return this.http.post<Fornecedor>(this.apiUrl, body);
  }

  update(id: number, fornecedor: Omit<Fornecedor, 'id'>): Observable<void> {
    const body = {
      nome: fornecedor.nome.trim(),
      cnpjCpf: this.limparFormatacao(fornecedor.cnpjCpf),
      email: fornecedor.email.trim(),
      telefone: this.limparFormatacao(fornecedor.telefone),
      endereco: fornecedor.endereco.trim()
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
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

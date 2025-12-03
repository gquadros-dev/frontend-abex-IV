import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda';
import { environment } from '../components/environment'; 

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  //private apiUrl = 'http://sitebecho/api/vendas';
  
  private apiUrl = `${environment.apiUrl}/vendas`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  create(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda);
  }


  update(venda: Venda): Observable<Venda> {
    return this.http.put<Venda>(`${this.apiUrl}/${venda.id}`, venda);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
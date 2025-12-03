import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(data => {
      this.produtos = data;
    });
  }
}

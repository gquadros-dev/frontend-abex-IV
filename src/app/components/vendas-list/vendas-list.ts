import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Produto } from '../../models/produto';
import { ProdutoSku } from '../../models/produto-sku';
import { Venda, VendaItem } from '../../models/venda';
import { ProdutoSkuService } from '../../services/produto-sku.service';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { BaseFormDialogWithTabsComponent, TabConfig } from '../base-form-dialog-with-tabs/base-form-dialog-with-tabs.component';
import { FormField } from '../base-form-dialog/base-form-dialog.component';
import { BaseListComponent, ColumnDefinition } from '../base-list/base-list.component';
import { SelecionarItemVendaComponent } from '../selecionar-item-venda/selecionar-item-venda.component';

@Component({
  selector: 'app-vendas-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseListComponent,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './vendas-list.html',
  styleUrls: ['./vendas-list.css']
})
export class VendasListComponent {
  columns: ColumnDefinition[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nomeCliente', label: 'Cliente', sortable: true },
    { key: 'dataVenda', label: 'Data da Venda', sortable: true, pipe: 'date', pipeArgs: 'dd/MM/yyyy' },
    { key: 'valorTotal', label: 'Valor Total', sortable: true, pipe: 'currency', pipeArgs: 'BRL' }
  ];

  vendas: Venda[] = [];
  isLoading = false;
  produtos: Produto[] = [];
  skus: ProdutoSku[] = [];
  itens: VendaItem[] = [];
  @ViewChild('itensTemplate') itensTemplate!: TemplateRef<any>;

  constructor(
    private vendaService: VendaService,
    private produtoService: ProdutoService,
    private skuService: ProdutoSkuService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.carregarVendas();
    this.carregarProdutos();
    this.carregarSkus();
  }

  carregarVendas() {
    this.isLoading = true;
    this.vendaService.getAll().subscribe({
      next: (dados) => {
        this.vendas = dados;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar vendas.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
      }
    });
  }

  carregarSkus() {
    this.skuService.getAllAsArray().subscribe({
      next: (skus) => {
        this.skus = skus;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar SKUs', 'Fechar', { duration: 3000 });
      }
    });
  }

  getSkusPorProduto(produtoId: number): ProdutoSku[] {
    return this.skus.filter(sku => sku.produtoId === produtoId);
  }

  openDialog(venda?: Venda): void {
    // Inicializar itens
    if (venda && venda.itens) {
      this.itens = [...venda.itens];
    } else {
      this.itens = [];
    }

    const vendaFields: FormField[] = [
      { key: 'nomeCliente', label: 'Nome do Cliente', type: 'text', required: true }
    ];

    const tabs: TabConfig[] = [
      {
        label: 'Dados da Venda',
        fields: vendaFields
      },
      {
        label: 'Itens da Venda',
        customTemplate: this.itensTemplate
      }
    ];

    const dialogRef = this.dialog.open(BaseFormDialogWithTabsComponent, {
      width: '800px',
      data: {
        title: venda ? 'Editar Venda' : 'Nova Venda',
        tabs: tabs,
        data: venda ? {
          nomeCliente: venda.nomeCliente,
          itens: venda.itens
        } : {
          nomeCliente: '',
          itens: []
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const vendaData = {
          nomeCliente: result.nomeCliente,
          itens: this.itens.map(item => ({
            produtoSkuId: item.produtoSkuId,
            quantidade: item.quantidade
          }))
        };

        if (venda && venda.id) {
          this.vendaService.update(venda.id, vendaData).subscribe({
            next: () => {
              this.snackBar.open('Venda atualizada com sucesso!', 'Fechar', { duration: 3000 });
              this.carregarVendas();
            },
            error: () => {
              this.snackBar.open('Erro ao atualizar venda', 'Fechar', { duration: 3000 });
            }
          });
        } else {
          this.vendaService.create(vendaData).subscribe({
            next: () => {
              this.snackBar.open('Venda criada com sucesso!', 'Fechar', { duration: 3000 });
              this.carregarVendas();
            },
            error: () => {
              this.snackBar.open('Erro ao criar venda', 'Fechar', { duration: 3000 });
            }
          });
        }
      }
      // Limpar itens após fechar
      this.itens = [];
    });
  }

  onNewItem() {
    const dialogRef = this.dialog.open(SelecionarItemVendaComponent, {
      width: '600px',
      data: {
        produtos: this.produtos,
        skus: this.skus
      }
    });

    dialogRef.afterClosed().subscribe((result: { produtoSkuId: number; quantidade: number } | undefined) => {
      if (result && result.produtoSkuId && result.quantidade > 0) {
        this.itens.push({
          produtoSkuId: result.produtoSkuId,
          quantidade: result.quantidade
        });
      }
    });
  }

  onDeleteItem(index: number) {
    this.itens.splice(index, 1);
  }

  getSkuDescricao(skuId: number): string {
    const sku = this.skus.find(s => s.id === skuId);
    if (!sku) return `SKU ${skuId}`;

    const produto = this.produtos.find(p => p.id === sku.produtoId);
    const produtoNome = produto ? produto.nome : '';
    return `${produtoNome} - ${sku.descricao || 'Sem descrição'}`;
  }

  getSkuPreco(skuId: number): number {
    const sku = this.skus.find(s => s.id === skuId);
    return sku ? sku.precoVenda : 0;
  }

  excluir(venda: Venda): void {
    if (confirm(`Tem certeza que deseja excluir a venda do cliente "${venda.nomeCliente}"?`)) {
      if (venda.id) {
        this.vendaService.delete(venda.id).subscribe({
          next: () => {
            this.snackBar.open('Venda excluída com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarVendas();
          },
          error: () => this.snackBar.open('Erro ao excluir venda', 'Fechar', { duration: 3000 })
        });
      }
    }
  }
}

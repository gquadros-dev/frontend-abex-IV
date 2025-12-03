import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoSku } from '../../models/produto-sku';
import { ProdutoVariation } from '../../models/produto-variation';
import { ProdutoSkuService } from '../../services/produto-sku.service';
import { ProdutoVariationService } from '../../services/produto-variation.service';
import { ProdutoService } from '../../services/produto.service';
import { BaseFormDialogWithTabsComponent, TabConfig } from '../base-form-dialog-with-tabs/base-form-dialog-with-tabs.component';
import { BaseFormDialogComponent, FormField } from '../base-form-dialog/base-form-dialog.component';
import { BaseListComponent, ColumnDefinition } from '../base-list/base-list.component';

@Component({
  standalone: true,
  selector: 'app-produto-form',
  templateUrl: './produto-form.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseListComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CurrencyPipe
  ],
  styleUrls: ['./produto-form.css']
})
export class ProdutoFormComponent implements OnInit {
  columns: ColumnDefinition[] = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'descricao', label: 'Descrição' },
    { key: 'precoVenda', label: 'Preço de Venda', sortable: true, pipe: 'currency', pipeArgs: 'BRL' },
    { key: 'fornecedorId', label: 'Fornecedor ID' }
  ];

  form!: FormGroup;
  produtos: Produto[] = [];
  editando = false;
  produtoEditandoId: number | null = null;
  isLoading = false;

  // Para gerenciar SKUs no modal
  variations: ProdutoVariation[] = [];
  skus: ProdutoSku[] = [];
  produtoIdNoModal: number | null = null;
  @ViewChild('skusTemplate') skusTemplate!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private produtoService: ProdutoService,
    private skuService: ProdutoSkuService,
    private variationService: ProdutoVariationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required]],
      precoCusto: [0, [Validators.required, Validators.min(0.01)]],
      precoVenda: [0, [Validators.required, Validators.min(0.01)]],
      fornecedorId: [null, [Validators.required]]
    });

    this.carregarProdutos();
  }


  carregarProdutos() {
    this.isLoading = true;
    this.produtoService.getProdutos()
      .subscribe({
        next: data => {
          this.produtos = data;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  salvar(produto: any) {
    const { id, ...produtoSemId } = produto;

    if (produto.id && produto.id > 0) {
      // Edição
      this.produtoService.update(produto.id, produtoSemId).subscribe({
        next: () => {
          this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.cancelarEdicao();
          this.carregarProdutos();
        },
        error: (error) => {
          console.error('Erro ao atualizar produto:', error);
          const errorMessage = error?.error?.message || error?.message || 'Erro ao atualizar produto';
          this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        }
      });
    } else {
      // Criação
      this.produtoService.create(produtoSemId).subscribe({
        next: () => {
          this.snackBar.open('Produto salvo com sucesso!', 'Fechar', { duration: 3000 });
          this.form.reset();
          this.carregarProdutos();
        },
        error: (error) => {
          console.error('Erro ao salvar produto:', error);
          const errorMessage = error?.error?.message || error?.message || 'Erro ao salvar produto';
          this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.produtoEditandoId = null;
    this.form.reset();
  }

  excluir(produto: Produto) {
    if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
      this.produtoService.delete(produto.id).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarProdutos();
        },
        error: () => this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 })
      });
    }
  }

  produtoFields: FormField[] = [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'descricao', label: 'Descrição', type: 'textarea', required: true, rows: 3 },
    { key: 'precoCusto', label: 'Preço de Custo', type: 'number', required: true, min: 0, step: 0.01 },
    { key: 'precoVenda', label: 'Preço de Venda', type: 'number', required: true, min: 0, step: 0.01 },
    { key: 'fornecedorId', label: 'Fornecedor ID', type: 'number', required: true, min: 1 }
  ];


  async openDialog(produto?: Produto) {
    // Carregar variações antes de abrir o modal
    await this.carregarVariations();

    // Se for edição, carregar SKUs também
    if (produto?.id) {
      this.produtoIdNoModal = produto.id;
      await this.carregarSkus(produto.id);
    } else {
      this.produtoIdNoModal = null;
      this.skus = [];
    }

    const tabs: TabConfig[] = [
      {
        label: 'Dados do Produto',
        fields: this.produtoFields
      },
      {
        label: 'SKUs',
        customTemplate: this.skusTemplate
      }
    ];

    const dialogRef = this.dialog.open(BaseFormDialogWithTabsComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        title: produto ? 'Editar Produto' : 'Novo Produto',
        tabs: tabs,
        data: produto ? {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          precoCusto: produto.precoCusto || 0,
          precoVenda: produto.precoVenda,
          fornecedorId: produto.fornecedorId
        } : {
          nome: '',
          descricao: '',
          precoCusto: 0,
          precoVenda: 0,
          fornecedorId: 0
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (produto && produto.id) {
          // Edição: garante que o id está presente
          this.salvar({ ...result, id: produto.id });
        } else {
          // Criação: não tem id
          this.salvar(result);
        }
      }
      // Limpar dados do modal
      this.produtoIdNoModal = null;
      this.skus = [];
    });
  }

  carregarVariations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.variationService.getAll().subscribe({
        next: (variations) => {
          this.variations = variations;
          resolve();
        },
        error: () => {
          this.snackBar.open('Erro ao carregar variações', 'Fechar', { duration: 3000 });
          reject();
        }
      });
    });
  }

  carregarSkus(produtoId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.skuService.getAllAsArray().subscribe({
        next: (skus) => {
          this.skus = skus.filter((sku: ProdutoSku) => sku.produtoId === produtoId);
          resolve();
        },
        error: () => {
          this.snackBar.open('Erro ao carregar SKUs', 'Fechar', { duration: 3000 });
          reject();
        }
      });
    });
  }

  getSkuFields(): FormField[] {
    const variationOptions = this.variations.map(v => ({
      value: v.id,
      label: `${v.nome}${v.descricao ? ' - ' + v.descricao : ''}`
    }));
    return [
      { key: 'produtoVariationId1', label: 'Variação 1', type: 'select', required: true, options: variationOptions },
      { key: 'produtoVariationId2', label: 'Variação 2 (opcional)', type: 'select', options: [{ value: null, label: 'Nenhuma' }, ...variationOptions] },
      { key: 'descricao', label: 'Descrição', type: 'text', required: true },
      { key: 'precoVenda', label: 'Preço de Venda', type: 'number', required: true, min: 0, step: 0.01 }
    ];
  }

  onNewSku() {
    if (!this.produtoIdNoModal) {
      this.snackBar.open('Salve o produto primeiro antes de adicionar SKUs', 'Fechar', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(BaseFormDialogComponent, {
      width: '500px',
      data: {
        title: 'Novo SKU',
        fields: this.getSkuFields(),
        data: {
          produtoId: this.produtoIdNoModal,
          produtoVariationId1: null,
          produtoVariationId2: null,
          descricao: '',
          precoVenda: 0
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.produtoIdNoModal) {
        const { produtoId, ...skuSemId } = result;
        this.skuService.create({ ...skuSemId, produtoId: this.produtoIdNoModal! }).subscribe({
          next: () => {
            this.snackBar.open('SKU criado com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarSkus(this.produtoIdNoModal!);
          },
          error: () => {
            this.snackBar.open('Erro ao criar SKU', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  onEditSku(sku: ProdutoSku) {
    const dialogRef = this.dialog.open(BaseFormDialogComponent, {
      width: '500px',
      data: {
        title: 'Editar SKU',
        fields: this.getSkuFields(),
        data: {
          produtoId: sku.produtoId,
          produtoVariationId1: sku.produtoVariationId1,
          produtoVariationId2: sku.produtoVariationId2,
          descricao: sku.descricao,
          precoVenda: sku.precoVenda
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && sku.id) {
        const { produtoId, ...skuSemId } = result;
        this.skuService.update(sku.id, { ...skuSemId, produtoId: sku.produtoId }).subscribe({
          next: () => {
            this.snackBar.open('SKU atualizado com sucesso!', 'Fechar', { duration: 3000 });
            if (this.produtoIdNoModal) {
              this.carregarSkus(this.produtoIdNoModal);
            }
          },
          error: () => {
            this.snackBar.open('Erro ao atualizar SKU', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  onDeleteSku(sku: ProdutoSku) {
    if (confirm(`Tem certeza que deseja excluir o SKU "${sku.descricao}"?`)) {
      this.skuService.delete(sku.id).subscribe({
        next: () => {
          this.snackBar.open('SKU excluído com sucesso!', 'Fechar', { duration: 3000 });
          if (this.produtoIdNoModal) {
            this.carregarSkus(this.produtoIdNoModal);
          }
        },
        error: () => {
          this.snackBar.open('Erro ao excluir SKU', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getVariationName(id: number | null): string {
    if (!id) return '-';
    const variation = this.variations.find(v => v.id === id);
    return variation ? variation.nome : `ID: ${id}`;
  }

}

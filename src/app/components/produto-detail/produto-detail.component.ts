import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoSku } from '../../models/produto-sku';
import { ProdutoVariation } from '../../models/produto-variation';
import { ProdutoSkuService } from '../../services/produto-sku.service';
import { ProdutoVariationService } from '../../services/produto-variation.service';
import { ProdutoService } from '../../services/produto.service';
import { BaseFormDialogComponent, FormField } from '../base-form-dialog/base-form-dialog.component';
import { BaseListComponent, ColumnDefinition } from '../base-list/base-list.component';

@Component({
    selector: 'app-produto-detail',
    standalone: true,
    imports: [
        CommonModule,
        CurrencyPipe,
        MatTabsModule,
        MatButtonModule,
        BaseListComponent
    ],
    templateUrl: './produto-detail.component.html',
    styleUrls: ['./produto-detail.component.css']
})
export class ProdutoDetailComponent implements OnInit {
    produto: Produto | null = null;
    produtoId: number | null = null;
    skus: ProdutoSku[] = [];
    isLoading = false;
    isLoadingSkus = false;

    skuColumns: ColumnDefinition[] = [
        { key: 'descricao', label: 'Descrição', sortable: true },
        { key: 'produtoVariationId1', label: 'Variação 1' },
        { key: 'produtoVariationId2', label: 'Variação 2' },
        { key: 'precoVenda', label: 'Preço de Venda', sortable: true, pipe: 'currency', pipeArgs: 'BRL' }
    ];

    variations: ProdutoVariation[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private produtoService: ProdutoService,
        private skuService: ProdutoSkuService,
        private variationService: ProdutoVariationService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
        this.carregarVariations();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.produtoId = +id;
                this.carregarProduto();
                this.carregarSkus();
            }
        });
    }

    carregarVariations() {
        this.variationService.getAll().subscribe({
            next: (variations) => {
                this.variations = variations;
            },
            error: () => {
                this.snackBar.open('Erro ao carregar variações', 'Fechar', { duration: 3000 });
            }
        });
    }

    carregarProduto() {
        if (!this.produtoId) return;
        this.isLoading = true;
        this.produtoService.getById(this.produtoId).subscribe({
            next: (produto) => {
                this.produto = produto;
                this.isLoading = false;
            },
            error: () => {
                this.snackBar.open('Erro ao carregar produto', 'Fechar', { duration: 3000 });
                this.isLoading = false;
            }
        });
    }

    carregarSkus() {
        if (!this.produtoId) return;
        this.isLoadingSkus = true;
        this.skuService.getAllAsArray().subscribe({
            next: (skus: ProdutoSku[]) => {
                // Filtra os SKUs pelo produtoId (até ter endpoint específico na API)
                this.skus = skus.filter((sku: ProdutoSku) => sku.produtoId === this.produtoId);
                this.isLoadingSkus = false;
            },
            error: () => {
                this.snackBar.open('Erro ao carregar SKUs', 'Fechar', { duration: 3000 });
                this.isLoadingSkus = false;
            }
        });
    }

    getSkuFields(): FormField[] {
        const variationOptions = this.variations.map(v => ({ value: v.id, label: `${v.nome} - ${v.descricao || ''}` }));
        return [
            { key: 'produtoVariationId1', label: 'Variação 1', type: 'select', required: true, options: variationOptions },
            { key: 'produtoVariationId2', label: 'Variação 2 (opcional)', type: 'select', options: [{ value: null, label: 'Nenhuma' }, ...variationOptions] },
            { key: 'descricao', label: 'Descrição', type: 'text', required: true },
            { key: 'precoVenda', label: 'Preço de Venda', type: 'number', required: true, min: 0, step: 0.01 }
        ];
    }

    onNewSku() {
        if (!this.produtoId) return;

        const dialogRef = this.dialog.open(BaseFormDialogComponent, {
            width: '500px',
            data: {
                title: 'Novo SKU',
                fields: this.getSkuFields(),
                data: {
                    produtoId: this.produtoId,
                    produtoVariationId1: null,
                    produtoVariationId2: null,
                    descricao: '',
                    precoVenda: 0
                }
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                const { produtoId, ...skuSemId } = result;
                this.skuService.create({ ...skuSemId, produtoId: this.produtoId! }).subscribe({
                    next: () => {
                        this.snackBar.open('SKU criado com sucesso!', 'Fechar', { duration: 3000 });
                        this.carregarSkus();
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
                        this.carregarSkus();
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
                    this.carregarSkus();
                },
                error: () => {
                    this.snackBar.open('Erro ao excluir SKU', 'Fechar', { duration: 3000 });
                }
            });
        }
    }

    voltar() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}


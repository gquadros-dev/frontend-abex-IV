import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Produto } from '../../models/produto';
import { ProdutoSku } from '../../models/produto-sku';

export interface SelecionarItemVendaData {
    produtos: Produto[];
    skus: ProdutoSku[];
}

@Component({
    selector: 'app-selecionar-item-venda',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        CurrencyPipe
    ],
    templateUrl: './selecionar-item-venda.component.html',
    styleUrls: ['./selecionar-item-venda.component.css']
})
export class SelecionarItemVendaComponent implements OnInit {
    produtos: Produto[] = [];
    skus: ProdutoSku[] = [];
    skuSelecionado: number | null = null;
    quantidade: number = 1;

    constructor(
        public dialogRef: MatDialogRef<SelecionarItemVendaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelecionarItemVendaData
    ) {
        this.produtos = data.produtos || [];
        this.skus = data.skus || [];
    }

    ngOnInit(): void {
    }

    getSkusPorProduto(produtoId: number): ProdutoSku[] {
        return this.skus.filter(sku => sku.produtoId === produtoId);
    }

    selecionarSku(skuId: number) {
        this.skuSelecionado = skuId;
    }

    getSkuSelecionado(): ProdutoSku | null {
        if (!this.skuSelecionado) return null;
        return this.skus.find(s => s.id === this.skuSelecionado) || null;
    }

    adicionar() {
        if (this.skuSelecionado && this.quantidade > 0) {
            this.dialogRef.close({
                produtoSkuId: this.skuSelecionado,
                quantidade: this.quantidade
            });
        }
    }

    cancelar() {
        this.dialogRef.close();
    }
}


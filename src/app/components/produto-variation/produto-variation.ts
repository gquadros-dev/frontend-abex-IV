import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProdutoVariation } from '../../models/produto-variation';
import { ProdutoVariationService } from '../../services/produto-variation.service';
import { BaseFormDialogComponent, FormField } from '../base-form-dialog/base-form-dialog.component';
import { BaseListComponent, ColumnDefinition } from '../base-list/base-list.component';

@Component({
    standalone: true,
    selector: 'app-produto-variation',
    imports: [BaseListComponent],
    templateUrl: './produto-variation.html',
    styleUrls: ['./produto-variation.css']
})
export class ProdutoVariationComponent {
    columns: ColumnDefinition[] = [
        { key: 'nome', label: 'Nome', sortable: true },
        { key: 'descricao', label: 'Descrição', sortable: true }
    ];

    variations: ProdutoVariation[] = [];
    isLoading = false;

    variationFields: FormField[] = [
        { key: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: Tamanho P, Cor Preta' },
        { key: 'descricao', label: 'Descrição', type: 'textarea', required: false, placeholder: 'Descrição opcional', rows: 2 }
    ];

    constructor(
        private variationService: ProdutoVariationService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
        this.carregarVariations();
    }

    carregarVariations() {
        this.isLoading = true;
        this.variationService.getAll()
            .subscribe({
                next: dados => {
                    this.variations = dados;
                    this.isLoading = false;
                },
                error: () => {
                    this.snackBar.open('Erro ao carregar variações', 'Fechar', { duration: 3000 });
                    this.isLoading = false;
                }
            });
    }

    salvarVariation(variationData: any) {
        const variationSemId = {
            nome: variationData.nome,
            descricao: variationData.descricao || null
        };
        this.variationService.create(variationSemId).subscribe({
            next: () => {
                this.snackBar.open('Variação salva com sucesso!', 'Fechar', { duration: 3000 });
                this.carregarVariations();
            },
            error: (error) => {
                console.error('Erro ao salvar variação:', error);
                this.snackBar.open('Erro ao salvar variação', 'Fechar', { duration: 3000 });
            }
        });
    }

    editarVariation(variation: ProdutoVariation) {
        this.openDialog(variation);
    }

    deletarVariation(variation: ProdutoVariation) {
        if (confirm(`Tem certeza que deseja excluir a variação "${variation.nome}"?`)) {
            this.variationService.delete(variation.id).subscribe({
                next: () => {
                    this.snackBar.open('Variação deletada!', 'Fechar', { duration: 3000 });
                    this.carregarVariations();
                },
                error: () => {
                    this.snackBar.open('Erro ao deletar variação', 'Fechar', { duration: 3000 });
                }
            });
        }
    }

    openDialog(variation?: ProdutoVariation) {
        const dialogRef = this.dialog.open(BaseFormDialogComponent, {
            width: '500px',
            data: {
                title: variation ? 'Editar Variação' : 'Nova Variação',
                fields: this.variationFields,
                data: variation ? {
                    id: variation.id,
                    nome: variation.nome,
                    descricao: variation.descricao || ''
                } : {
                    nome: '',
                    descricao: ''
                }
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                if (variation && variation.id) {
                    const { id, ...dadosAtualizacao } = result;
                    this.variationService.update(variation.id, dadosAtualizacao).subscribe({
                        next: () => {
                            this.snackBar.open('Variação atualizada!', 'Fechar', { duration: 3000 });
                            this.carregarVariations();
                        },
                        error: () => {
                            this.snackBar.open('Erro ao atualizar variação', 'Fechar', { duration: 3000 });
                        }
                    });
                } else {
                    this.salvarVariation(result);
                }
            }
        });
    }
}


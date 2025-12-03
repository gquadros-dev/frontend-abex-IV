import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fornecedor } from '../../models/fornecedor';
import { FornecedorService } from '../../services/fornecedor.service';
import { BaseFormDialogComponent, FormField } from '../base-form-dialog/base-form-dialog.component';
import { BaseListComponent, ColumnDefinition } from '../base-list/base-list.component';

@Component({
  standalone: true,
  selector: 'app-fornecedores',
  imports: [BaseListComponent],
  templateUrl: './fornecedores.html',
  styleUrls: ['./fornecedores.css']
})
export class FornecedoresComponent {
  columns: ColumnDefinition[] = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'cnpjCpf', label: 'CNPJ/CPF', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone' }
  ];

  fornecedores: Fornecedor[] = [];
  isLoading = false;

  constructor(
    private fornecedorService: FornecedorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.carregarFornecedores();
  }

  carregarFornecedores() {
    this.isLoading = true;
    this.fornecedorService.getAll()
      .subscribe({
        next: dados => {
          this.fornecedores = dados;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar fornecedores', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  salvarFornecedor(fornecedorData: any) {
    const fornecedorSemId = {
      nome: fornecedorData.nome,
      cnpjCpf: fornecedorData.cnpjCpf,
      email: fornecedorData.email,
      telefone: fornecedorData.telefone,
      endereco: fornecedorData.endereco
    };
    this.fornecedorService.create(fornecedorSemId).subscribe({
      next: () => {
        this.snackBar.open('Fornecedor salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarFornecedores();
      },
      error: (error) => {
        console.error('Erro ao salvar fornecedor:', error);
        this.snackBar.open('Erro ao salvar fornecedor', 'Fechar', { duration: 3000 });
      }
    });
  }

  editarFornecedor(fornecedor: Fornecedor) {
    this.openDialog(fornecedor);
  }

  deletarFornecedor(fornecedor: Fornecedor) {
    if (confirm(`Tem certeza que deseja excluir o fornecedor "${fornecedor.nome}"?`)) {
      this.fornecedorService.delete(fornecedor.id).subscribe({
        next: () => {
          this.snackBar.open('Fornecedor deletado!', 'Fechar', { duration: 3000 });
          this.carregarFornecedores();
        },
        error: () => {
          this.snackBar.open('Erro ao deletar fornecedor', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  exportarCSV() {
    const csvRows = [
      ['Nome', 'CNPJ/CPF', 'Email', 'Telefone', 'Endereço'],
      ...this.fornecedores.map(f => [f.nome, f.cnpjCpf, f.email, f.telefone, f.endereco])
    ];
    const csvContent = csvRows.map(r => r.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'fornecedores.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  fornecedorFields: FormField[] = [
    { key: 'nome', label: 'Nome', type: 'text', required: true },
    { key: 'cnpjCpf', label: 'CNPJ/CPF', type: 'text', required: true, placeholder: '00.000.000/0000-00' },
    { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'exemplo@email.com' },
    { key: 'telefone', label: 'Telefone', type: 'text', required: true, placeholder: '(00) 00000-0000' },
    { key: 'endereco', label: 'Endereço', type: 'textarea', required: true, placeholder: 'Rua, número - Cidade/UF', rows: 2 }
  ];

  openDialog(fornecedor?: Fornecedor) {
    const dialogRef = this.dialog.open(BaseFormDialogComponent, {
      width: '500px',
      data: {
        title: fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor',
        fields: this.fornecedorFields,
        data: fornecedor ? {
          id: fornecedor.id,
          nome: fornecedor.nome,
          cnpjCpf: fornecedor.cnpjCpf,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          endereco: fornecedor.endereco
        } : {
          nome: '',
          cnpjCpf: '',
          email: '',
          telefone: '',
          endereco: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (fornecedor && fornecedor.id) {
          const { id, ...dadosAtualizacao } = result;
          this.fornecedorService.update(fornecedor.id, dadosAtualizacao).subscribe({
            next: () => {
              this.snackBar.open('Fornecedor atualizado!', 'Fechar', { duration: 3000 });
              this.carregarFornecedores();
            },
            error: () => {
              this.snackBar.open('Erro ao atualizar fornecedor', 'Fechar', { duration: 3000 });
            }
          });
        } else {
          this.salvarFornecedor(result);
        }
      }
    });
  }

}

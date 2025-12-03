import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';

export interface ProdutoData {
  id?: number;
  nome: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  fornecedorId: number;
}

@Component({
  selector: 'app-produto-form.component',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponentComponent {

  constructor(
    public dialogRef: MatDialogRef<ProdutoFormComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProdutoData
  ) { }

  salvar() {
    if (!this.data.nome || !this.data.descricao || !this.data.precoCusto || !this.data.precoVenda || !this.data.fornecedorId) {
      return;
    }
    this.dialogRef.close(this.data);
  }

  cancelar() {
    this.dialogRef.close();
  }


}

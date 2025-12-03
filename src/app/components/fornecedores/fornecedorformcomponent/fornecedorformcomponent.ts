import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface FornecedorData {
  id?: number;
  nome: string;
  cnpjCpf: string;
  email: string;
  telefone: string;
  endereco: string;
}

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  templateUrl: './fornecedorformcomponent.html',
  styleUrls: ['./fornecedorformcomponent.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ]
})
export class FornecedorFormComponent {
  constructor(
    public dialogRef: MatDialogRef<FornecedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FornecedorData
  ) { }


  salvar() {
    if (!this.data.nome || !this.data.cnpjCpf || !this.data.email || !this.data.telefone || !this.data.endereco) {
      return;
    }
    const fornecedorNovo = { ...this.data };
    this.dialogRef.close(fornecedorNovo);
  }

  cancelar() {
    this.dialogRef.close();
  }
}

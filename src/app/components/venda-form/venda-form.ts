import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { Venda } from '../../models/venda';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-venda-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './venda-form.html',
  styleUrls: ['./venda-form.css']
})
export class VendaFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  produtos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Venda,
    private produtoService: ProdutoService
  ) {
    this.isEditMode = !!data.id;
    
    this.form = this.fb.group({
      produtoId: [data.produtoId || '', Validators.required],
      quantidade: [data.quantidade || 1, [Validators.required, Validators.min(1)]],
      data: [data.data ? new Date(data.data) : new Date(), Validators.required],
      fornecedorId: [{ value: data.fornecedorId || '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe((produtos: Produto[]) => {
      this.produtos = produtos;
    });

    this.form.get('produtoId')?.valueChanges.subscribe(produtoIdSelecionado => {
      this.onProdutoChange(produtoIdSelecionado);
    });
  }

  onProdutoChange(produtoId: number) {
    const produto = this.produtos.find(p => p.id === +produtoId);
    if (produto) {
      this.form.patchValue({ fornecedorId: produto.fornecedorId });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      const formattedDate = new Date(rawValue.data).toISOString().split('T')[0];
      
      this.dialogRef.close({ ...rawValue, data: formattedDate });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
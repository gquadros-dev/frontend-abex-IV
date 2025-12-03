import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { VendaService } from '../../services/venda.service';
import { Venda } from '../../models/venda';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendaFormComponent } from '../venda-form/venda-form';
import { ConfirmDialogComponent } from '../confirm-dialog.component/confirm-dialog.component';

@Component({
  selector: 'app-vendas-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatDialogModule, MatSnackBarModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatProgressBarModule, MatTooltipModule
  ],
  templateUrl: './vendas-list.html',
  styleUrls: ['./vendas-list.css']
})
export class VendasListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'produtoId', 'quantidade', 'data', 'acoes'];
  dataSource = new MatTableDataSource<Venda>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vendaService: VendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.carregarVendas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  carregarVendas() {
    this.isLoading = true;
    this.vendaService.getAll().subscribe({
      next: (dados) => {
        this.dataSource.data = dados;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar vendas.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(venda?: Venda): void {
    const dialogRef = this.dialog.open(VendaFormComponent, {
      width: '450px',
      data: venda || {}
    });

    dialogRef.afterClosed().subscribe((result: Venda | undefined) => {
      if (!result) return;

      if (venda && venda.id) {
        const vendaAtualizada: Venda = { ...result, id: venda.id };
        this.vendaService.update(vendaAtualizada).subscribe({
          next: () => {
            this.snackBar.open('Venda atualizada!', 'Fechar', { duration: 3000 });
            this.carregarVendas();
          },
          error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 })
        });
      } else {
        const novaVenda: Venda = { ...result, id: 0 };
        this.vendaService.create(novaVenda).subscribe({
          next: () => {
            this.snackBar.open('Venda criada!', 'Fechar', { duration: 3000 });
            this.carregarVendas();
          },
          error: () => this.snackBar.open('Erro ao criar.', 'Fechar', { duration: 3000 })
        });
      }
    });
  }

  deletarVenda(venda: Venda): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nome: `a venda de ID ${venda.id}` }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado && venda.id) {
        this.vendaService.delete(venda.id).subscribe({
          next: () => {
            this.snackBar.open('Venda deletada!', 'Fechar', { duration: 3000 });
            this.carregarVendas();
          },
          error: () => this.snackBar.open('Erro ao deletar.', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
  
  voltar(): void {
    this.location.back();
  }
}
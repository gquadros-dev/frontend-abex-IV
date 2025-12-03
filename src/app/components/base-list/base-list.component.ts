import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatNoDataRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ColumnDefinition {
    key: string;
    label: string;
    sortable?: boolean;
    pipe?: string; // Para pipes como currency, date, etc
    pipeArgs?: string; // Argumentos do pipe, ex: 'BRL'
}

@Component({
    selector: 'app-base-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        MatTooltipModule,
        MatNoDataRow
    ],
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.css']
})
export class BaseListComponent<T> implements AfterViewInit, OnChanges {
    @Input() title: string = '';
    @Input() searchPlaceholder: string = 'Buscar...';
    @Input() emptyMessage: string = 'Nenhum registro encontrado.';
    @Input() columns: ColumnDefinition[] = [];
    @Input() data: T[] = [];
    @Input() isLoading: boolean = false;
    @Input() showExportButton: boolean = false;
    @Input() pageSize: number = 5;
    @Input() pageSizeOptions: number[] = [5, 10, 20];
    @Input() enableSort: boolean = true;

    // Templates customizados
    @Input() customCellTemplate?: TemplateRef<any>;
    @Input() customActionsTemplate?: TemplateRef<any>;

    // Eventos
    @Output() onNew = new EventEmitter<void>();
    @Output() onEdit = new EventEmitter<T>();
    @Output() onDelete = new EventEmitter<T>();
    @Output() onExport = new EventEmitter<void>();
    @Output() onBack = new EventEmitter<void>();

    dataSource = new MatTableDataSource<T>();
    displayedColumns: string[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private location: Location) { }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        if (this.enableSort) {
            this.dataSource.sort = this.sort;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            this.dataSource.data = this.data;
        }
        if (changes['columns'] && this.columns) {
            this.displayedColumns = this.columns.map(col => col.key);
            if (this.customActionsTemplate || this.onEdit.observed || this.onDelete.observed) {
                this.displayedColumns.push('acoes');
            }
        }
    }

    aplicarFiltro(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    handleEdit(item: T) {
        this.onEdit.emit(item);
    }

    handleDelete(item: T) {
        this.onDelete.emit(item);
    }

    handleNew() {
        this.onNew.emit();
    }

    handleExport() {
        this.onExport.emit();
    }

    handleBack() {
        if (this.onBack.observed) {
            this.onBack.emit();
        } else {
            this.location.back();
        }
    }

    getCellValue(item: T, column: ColumnDefinition): any {
        const keys = column.key.split('.');
        let value: any = item;
        for (const key of keys) {
            value = value?.[key];
        }
        return value;
    }
}


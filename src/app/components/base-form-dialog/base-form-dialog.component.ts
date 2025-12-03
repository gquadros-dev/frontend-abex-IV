import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface FormField {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    options?: { value: any; label: string }[];
}

export interface BaseFormDialogConfig<T = any> {
    title?: string;
    fields?: FormField[];
    data?: T;
    customTemplate?: TemplateRef<any>;
}

@Component({
    selector: 'app-base-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './base-form-dialog.component.html',
    styleUrls: ['./base-form-dialog.component.css']
})
export class BaseFormDialogComponent<T = any> {
    title: string = '';
    fields: FormField[] = [];
    data: T = {} as T;
    customTemplate?: TemplateRef<any>;
    @Output() onSave = new EventEmitter<T>();
    @Output() onCancel = new EventEmitter<void>();

    constructor(
        public dialogRef: MatDialogRef<BaseFormDialogComponent<T>>,
        @Inject(MAT_DIALOG_DATA) public dialogData: BaseFormDialogConfig<T> | T
    ) {
        // Se dialogData é um objeto de configuração
        if (dialogData && typeof dialogData === 'object' && 'fields' in dialogData) {
            const config = dialogData as BaseFormDialogConfig<T>;
            this.title = config.title || '';
            this.fields = config.fields || [];
            this.data = config.data || {} as T;
            this.customTemplate = config.customTemplate;
        } else {
            // Se dialogData é apenas os dados
            this.data = { ...(dialogData as T) };
        }
    }

    salvar() {
        // Validação básica
        if (this.fields.some(field => field.required && !this.getFieldValue(field.key))) {
            return;
        }
        this.onSave.emit(this.data);
        this.dialogRef.close(this.data);
    }

    cancelar() {
        this.onCancel.emit();
        this.dialogRef.close();
    }

    getFieldValue(key: string): any {
        return (this.data as any)[key];
    }

    setFieldValue(key: string, value: any): void {
        (this.data as any)[key] = value;
    }

    isFieldValid(field: FormField): boolean {
        if (!field.required) return true;
        const value = this.getFieldValue(field.key);
        return value !== null && value !== undefined && value !== '';
    }

    isFormValid(): boolean {
        return this.fields.every(field => this.isFieldValid(field));
    }
}


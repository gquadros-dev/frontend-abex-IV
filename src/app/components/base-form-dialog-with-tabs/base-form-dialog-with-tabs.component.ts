import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FormField } from '../base-form-dialog/base-form-dialog.component';

export interface TabConfig {
    label: string;
    fields?: FormField[];
    customTemplate?: TemplateRef<any>;
}

export interface BaseFormDialogWithTabsConfig<T = any> {
    title?: string;
    tabs: TabConfig[];
    data?: T;
}

@Component({
    selector: 'app-base-form-dialog-with-tabs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTabsModule
    ],
    templateUrl: './base-form-dialog-with-tabs.component.html',
    styleUrls: ['./base-form-dialog-with-tabs.component.css']
})
export class BaseFormDialogWithTabsComponent<T = any> {
    title: string = '';
    tabs: TabConfig[] = [];
    data: T = {} as T;
    @Output() onSave = new EventEmitter<T>();
    @Output() onCancel = new EventEmitter<void>();

    constructor(
        public dialogRef: MatDialogRef<BaseFormDialogWithTabsComponent<T>>,
        @Inject(MAT_DIALOG_DATA) public dialogData: BaseFormDialogWithTabsConfig<T> | T
    ) {
        // Se dialogData é um objeto de configuração
        if (dialogData && typeof dialogData === 'object' && 'tabs' in dialogData) {
            const config = dialogData as BaseFormDialogWithTabsConfig<T>;
            this.title = config.title || '';
            this.tabs = config.tabs || [];
            this.data = config.data || {} as T;
        } else {
            // Se dialogData é apenas os dados
            this.data = { ...(dialogData as T) };
        }
    }

    salvar() {
        // Validação básica - verifica campos obrigatórios em todas as tabs
        const allFields = this.tabs.flatMap(tab => tab.fields || []);
        const hasInvalidField = allFields.some(field => {
            if (field.required) {
                const value = this.getFieldValue(field.key);
                return value === null || value === undefined || value === '';
            }
            return false;
        });

        if (hasInvalidField) {
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
        const allFields = this.tabs.flatMap(tab => tab.fields || []);
        return allFields.every(field => this.isFieldValid(field));
    }

    getFieldsForTab(tab: TabConfig): FormField[] {
        return tab.fields || [];
    }
}


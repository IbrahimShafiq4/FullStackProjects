import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export type TCategoryType = 'Expense' | 'Revenue';

export interface ICategory {
    id: number;
    name: string;
    type: TCategoryType;
}

export interface ITransaction {
    id: number;
    amount: number;
    description: string;
    categoryName: string;
    occurredAt: string;
}

export interface IMonthlySummary {
    month: number;
    year: number;
    totalRevenue: number;
    totalExpenses: number;
    netBalance: number;
}

export interface IPaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class LedgerService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE: string = 'https://localhost:7106/api';

    categories: WritableSignal<ICategory[]> = signal<ICategory[]>([]);
    transactions: WritableSignal<ITransaction[]> = signal<ITransaction[]>([]);
    balance: WritableSignal<number> = signal<number>(0);
    monthlyReport: WritableSignal<IMonthlySummary[]> = signal<IMonthlySummary[]>([]);

    loadCategories(): void {
        this._HttpClient.get<ICategory[]>(`${this.BASE}/categories`).subscribe({
            next: (categories: ICategory[]) => this.categories.set(categories),
        });
    }

    loadTransactions(page: number = 1, pageSize: number = 20): void {
        this._HttpClient.get<IPaginatedResult<ITransaction>>(`${this.BASE}/transactions?page=${page}&pageSize=${pageSize}`).subscribe({
            next: (result) => this.transactions.set(result.items),
        });
    }

    loadBalance() {
        this._HttpClient.get<{ balance: number }>(`${this.BASE}/transactions/balance`).subscribe({
            next: (balance) => this.balance.set(balance.balance)
        });
    }

    loadMonthlyReport(year: number): void {
        this._HttpClient.get<IMonthlySummary[]>(`${this.BASE}/reports/monthly/${year}`).subscribe({
            next: (summary: IMonthlySummary[]) => this.monthlyReport.set(summary),
        });
    }

    createCategory(name: string, type: string): Observable<any> {
        return this._HttpClient.post(`${this.BASE}/categories`, { name, type });
    }

    updateCategory(id: number, name: string, type: string): Observable<any> {
        return this._HttpClient.put(`${this.BASE}/categories/${id}`, { name, type });
    }

    deleteCategory(id: number): Observable<any> {
        return this._HttpClient.delete(`${this.BASE}/categories/${id}`);
    }

    recordTransaction(categoryId: number, amount: number, description: string): Observable<any> {
        return this._HttpClient.post(`${this.BASE}/transactions`, { categoryId, amount, description });
    }

    updateTransaction(id: number, categoryId?: number, amount?: number, description?: string, occurredAt?: string): Observable<any> {
        return this._HttpClient.put(`${this.BASE}/transactions/${id}`, { categoryId, amount, description, occurredAt });
    }

    deleteTransaction(id: number): Observable<any> {
        return this._HttpClient.delete(`${this.BASE}/transactions/${id}`);
    }

    exportReport(year: number): Observable<Blob> {
        return this._HttpClient.get(`${this.BASE}/reports/monthly/${year}/export`, { responseType: 'blob' });
    }
}
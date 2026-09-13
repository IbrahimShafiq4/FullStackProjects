import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IGeneralStats {
    totalUsers: number;
    totalTransactions: number;
    totalRevenue: number;
    totalExpenses: number;
}

export interface IPublicTransaction {
    id: number;
    amount: number;
    description: string;
    categoryName: string;
    occurredAt: string;
}

@Injectable({ providedIn: 'root' })
export class LandingService {
    private http = inject(HttpClient);
    private readonly BASE = 'https://localhost:7123/api/landing';

    getStats(): Observable<IGeneralStats> {
        return this.http.get<IGeneralStats>(`${this.BASE}/stats`);
    }

    getRecentTransactions(count: number = 5): Observable<IPublicTransaction[]> {
        return this.http.get<IPublicTransaction[]>(`${this.BASE}/recent-transactions?count=${count}`);
    }
}
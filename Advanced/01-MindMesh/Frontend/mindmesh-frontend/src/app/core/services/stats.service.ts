import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IOverviewStats {
    totalUsers: number;
    totalBoards: number;
    totalCards: number;
    lastUpdated: string;
}

@Service()
export class StatsService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7167/api/stats';

    getOverview(): Observable<IOverviewStats> {
        return this._HttpClient.get<IOverviewStats>(`${this.API_URL}/overview`);
    }
}

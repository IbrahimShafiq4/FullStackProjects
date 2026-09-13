import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class StatsService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE_URL = 'https://localhost:7000/api/v1';

    getTraineeStats(): Observable<any> {
        return this._HttpClient.get(`${this.BASE_URL}/workoutlogs/stats/me`);
    }

    getRecentLogs(take = 10): Observable<any[]> {
        return this._HttpClient.get<any[]>(`${this.BASE_URL}/workoutlogs/recent?take=${take}`);
    }

    getCoachStats(): Observable<any> {
        return this._HttpClient.get(`${this.BASE_URL}/workoutplans/coach-stats`);
    }

    getGlobalStats(): Observable<any> {
        return this._HttpClient.get(`${this.BASE_URL}/stats/global`);
    }
}
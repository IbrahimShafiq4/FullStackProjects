import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';

export interface IDoctorDashboard {
    totalAppointments: number;
    completed: number;
    completeRate: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private readonly _http = inject(HttpClient);
    private readonly API = 'https://localhost:7058/api/analytics';

    dashboard: WritableSignal<IDoctorDashboard | null> = signal<IDoctorDashboard | null>(null);
    loading = signal(false);

    loadDoctorDashboard(): void {
        this.loading.set(true);
        this._http.get<IDoctorDashboard>(`${this.API}/doctor-dashboard`).subscribe({
            next: (d) => {
                this.dashboard.set(d);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }
}
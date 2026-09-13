import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface ICompany {
    id: number;
    name: string;
}

@Service()
export class CompanyService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE: string = "https://localhost:7217/api/companies";

    public company: WritableSignal<ICompany | null> = signal<ICompany | null>(null);

    create(name: string): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(`${this.BASE}`, { name }).pipe(
            tap((res) => this.company.set({ id: res.id, name }))
        );
    }

    loadMine(): Observable<ICompany> {
        return this._HttpClient.get<ICompany>(`${this.BASE}/my`).pipe(
            tap((company) => this.company.set(company))
        );
    }
}
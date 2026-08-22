import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Service()
export class Auth {
    private _HttpClient = inject(HttpClient);
    private _Router = inject(Router);

    private readonly API_URL = 'https://localhost:7038/api/auth';

    currentUser = signal<{ fullName: string } | null>(null);

    register(fullName: string, email: string, password: string): Observable<{ message: string }> {
        return this._HttpClient.post<{ message: string }>(`${this.API_URL}`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<{ message: string, fullName: string }> {
        return this._HttpClient.post<{ message: string, fullName: string }>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout() {
        this._HttpClient.post<{ message: string }>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login'])
        });
    }
}

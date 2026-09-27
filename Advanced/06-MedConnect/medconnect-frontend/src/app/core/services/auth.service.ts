import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type TRole = 'Doctor' | 'Patient';

export interface ILogin {
    message: string;
    fullName: string;
    role: TRole;
    id: string;
}

export interface ICurrentUser {
    fullName: string;
    role: TRole;
    id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _router = inject(Router);
    private readonly API = `${environment.apiBaseUrl}/auth`;

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    registerDoctor(fullName: string, specialty: string, email: string, password: string): Observable<unknown> {
        return this._http.post(`${this.API}/register-doctor`, { fullName, specialty, email, password });
    }

    registerPatient(fullName: string, email: string, password: string): Observable<unknown> {
        return this._http.post(`${this.API}/register-patient`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._http
            .post<ILogin>(`${this.API}/login`, { email, password }, { withCredentials: true })
            .pipe(tap((res) => this.currentUser.set({
                fullName: res.fullName,
                role: res.role,
                id: res.id,
            })));
    }

    logout(): void {
        this._http.post(`${this.API}/logout`, {}, { withCredentials: true }).subscribe({
            next: () => {
                this.currentUser.set(null);
                this._router.navigate(['/']);
            },
            error: () => {
                this.currentUser.set(null);
                this._router.navigate(['/']);
            },
        });
    }
}
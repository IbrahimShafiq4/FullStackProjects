import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export type TRole = 'Employer' | 'Candidate';
export interface IAuth { message: string; }
export interface ICurrentUser { role: TRole; fullName: string; }
export interface ILogin extends IAuth { fullName: string; role: TRole; }

@Service()
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = "https://localhost:7217/api/auth";

    public currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string, role: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password, role });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
            .pipe(tap(user => this.currentUser.set({ fullName: user.fullName, role: user.role })));
    }

    checkAuth(): Observable<ILogin> {
        return this._HttpClient.get<ILogin>(`${this.API_URL}/me`, { withCredentials: true })
            .pipe(tap(user => this.currentUser.set({ fullName: user.fullName, role: user.role })));
    }

    logout(): void {
        this._HttpClient.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        });
    }
}
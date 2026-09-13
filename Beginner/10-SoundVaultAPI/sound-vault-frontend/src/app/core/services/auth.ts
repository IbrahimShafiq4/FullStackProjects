import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface ICurrentUser { fullName: string; }
export interface IAuth { message: string; }
export interface IRegister extends IAuth { }
export interface ILogin extends IAuth, ICurrentUser { }
export interface IRefreshToken { token: string; }

@Service()
export class Auth {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL = 'https://localhost:7135/api/auth';
    currentUser: WritableSignal<ICurrentUser | null> = signal(null);

    register(fullName: string, email: string, password: string): Observable<IRegister> {
        return this._HttpClient.post<IRegister>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
            .pipe(tap(res => this.currentUser.set({ fullName: res.fullName })));
    }

    refreshToken(): Observable<IRefreshToken> {
        return this._HttpClient.post<IRefreshToken>(`${this.API_URL}/refresh`, {}, { withCredentials: true });
    }

    logout(): void {
        this._HttpClient.post<IAuth>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        });
    }
}
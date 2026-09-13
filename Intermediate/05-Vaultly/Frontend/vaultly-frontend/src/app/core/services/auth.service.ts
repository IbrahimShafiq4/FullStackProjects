import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICurrentUser { fullName: string; }
export interface IAuth { message: string; }
export interface ILogin extends ICurrentUser, IAuth { }
export interface ILogout extends IAuth { }

@Service()
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = 'https://localhost:7162/api/auth';
    public currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout() {
        this._HttpClient.post<ILogout>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        })
    }
}

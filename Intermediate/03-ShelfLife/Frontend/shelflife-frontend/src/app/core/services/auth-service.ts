import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ToastService } from './toast-service';

export interface ICurrentUser {
    fullName: string;
    isAdmin: boolean;
}

export interface IAuth { message: string; }
export interface ILogin extends IAuth, ICurrentUser { }

@Service()
export class AuthService {
    private _http = inject(HttpClient);
    private _router = inject(Router);
    private _toast = inject(ToastService);
    private readonly API_URL: string = 'https://localhost:7033/api/auth';

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this._http.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._http.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
            .pipe(tap((user) => this.currentUser.set({
                fullName: user.fullName,
                isAdmin: user.isAdmin
            })));
    }

    checkAuth(): Observable<ICurrentUser> {
        return this._http.get<ICurrentUser>(`${this.API_URL}/me`, { withCredentials: true })
            .pipe(tap((user) => this.currentUser.set({
                fullName: user.fullName,
                isAdmin: user.isAdmin
            })));
    }

    logout(): void {
        this._http.post<IAuth>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe({
            next: (res) => {
                this.currentUser.set(null);
                this._toast.show(res.message, 'success');
                this._router.navigate(['/login']);
            }
        });
    }
}
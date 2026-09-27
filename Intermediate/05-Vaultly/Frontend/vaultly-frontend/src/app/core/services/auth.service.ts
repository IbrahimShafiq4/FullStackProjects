import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICurrentUser { fullName: string; }
export interface IAuth { message: string; }
export interface ILogin extends ICurrentUser, IAuth { }
export interface ILogout extends IAuth { }

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = 'https://localhost:7162/api/auth';
    private readonly STORAGE_KEY: string = 'vaultly.user';

    public currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(this.readStoredUser());

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    setCurrentUser(user: ICurrentUser): void {
        this.currentUser.set(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }

    logout(): void {
        this._HttpClient.post<ILogout>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe({
            next: () => this.clearAndRedirect(),
            error: () => this.clearAndRedirect()
        });
    }

    private clearAndRedirect(): void {
        this.currentUser.set(null);
        localStorage.removeItem(this.STORAGE_KEY);
        this._Router.navigate(['/login']);
    }

    private readStoredUser(): ICurrentUser | null {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return null;
        try { return JSON.parse(raw) as ICurrentUser; } catch { return null; }
    }
}
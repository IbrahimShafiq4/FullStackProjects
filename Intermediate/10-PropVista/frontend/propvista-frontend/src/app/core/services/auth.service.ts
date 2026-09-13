import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export type TRole = 'Owner' | 'Seeker';

export interface ICurrentUser { fullName: string, role: TRole }
export interface IAuth { message: string; }
export interface ILogin extends ICurrentUser, IAuth { }

@Service()
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);

    private readonly API_URL: string = "https://localhost:7123/api/auth";

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string, role: string) {
        return this._HttpClient.post(`${this.API_URL}/register`, { fullName, email, password, role });
    }
    login(email: string, password: string) {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }
    logout() {
        this._HttpClient.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        });
    }
}

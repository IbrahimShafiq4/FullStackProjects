import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICurrentUser {
    fullName: string;
}

export interface IAuthResponse {
    message: string;
}

export interface ILogin extends IAuthResponse {
    fullName: string;
}

@Service()
export class Auth {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);

    private readonly API_URL: string = "https://localhost:7102/api/auth";

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<IAuthResponse> {
        return this._HttpClient.post<IAuthResponse>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout() {
        this._HttpClient.post(`${this.API_URL}/logout`, {}, {withCredentials: true}).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        })
    }
}

import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

export interface ICurrentUser {
    fullName: string;
}

export interface ILoginResponse {
    message: string;
    fullName: string;
}

export interface IRegister {
    message: string;
}

export interface ILogout {
    message: string;
}

@Service()
export class Auth {
    private _HttpClient : HttpClient    = inject(HttpClient);
    private _Router     : Router        = inject(Router);

    /**
     * ? API_URL LINK
     */
    private readonly API_URL            = "https://localhost:7183/api/auth";

    // ! GETTING THE CURRENTUSER
    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    // # 
    register(fullName: string, email: string, password: string): Observable<IRegister> {
        return this._HttpClient.post<IRegister>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILoginResponse> {
        return this._HttpClient.post<ILoginResponse>(`${this.API_URL}/login`, { email, password });
    }

    logout() {
        this._HttpClient.post<ILogout>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        })
    }
}

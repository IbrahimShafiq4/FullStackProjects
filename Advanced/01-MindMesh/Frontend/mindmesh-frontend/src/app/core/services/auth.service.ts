import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface IAuth {
    id      : string;
    fullName: string;
    email   : string;
}

export interface IMessage { message: string; }
export interface IUserDetails {
    id          : string;
    fullName    : string;
    email       : string;
    createdAt   : string;
    boardsCount : number;
    cardsCount  : number;
    lastActivity: string;
    recentBoards: IRecentBoards[];
}

export interface IRecentBoards {
    id          : number;
    title       : string;
    createdAt   : string;
    cardsCount  : number;
}

@Service()
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = "https://localhost:7167/api/auth";

    currentUser: WritableSignal<IAuth | null> = signal<IAuth | null>(null);

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    me(): Observable<IAuth> {
        return this._HttpClient.get<IAuth>(`${this.API_URL}/me`, { withCredentials: true })
    }

    logout(): void {
        this._HttpClient.post<IMessage>(`${this.API_URL}/logout`, {  }, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login'])
        })
    }

    getMeDetails(): Observable<IUserDetails> {
        return this._HttpClient.get<IUserDetails>(`${this.API_URL}/me/details`, { withCredentials: true });
    }
}

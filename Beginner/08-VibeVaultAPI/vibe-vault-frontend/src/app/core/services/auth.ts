import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICurrentUser                               { fullName: string; }
export interface IAuth                                      { message : string; }
export interface ILogin     extends IAuth, ICurrentUser     {                   }
export interface IRegister  extends IAuth                   {                   }

@Service()
export class Auth {
    private _HttpClient : HttpClient    = inject(HttpClient);
    private _Router     : Router        = inject(Router);
    
    // API LINK
    private readonly API_URL: string = `https://localhost:7292/api/auth`;

    // ! ACTIVE CURRENT USER
    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<IRegister> {
        return this._HttpClient.post<IRegister>(`${this.API_URL}/register`, { fullName, email, password }, {withCredentials: true})
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
    }

    logout(): void {
        this._HttpClient.post(`${this.API_URL}/logout`, {}, {withCredentials: true}).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login'])
        })
    }
}

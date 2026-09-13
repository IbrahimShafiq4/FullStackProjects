import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

type UserRole = 'Coach' | 'Trainee';
export interface ICurrentUser                       { fullName: string; role: UserRole; }
export interface IAuth                              { message: string;                  }
export interface ILogin extends ICurrentUser, IAuth {                                   }


@Service()
export class AuthService { 
    private _HttpClient : HttpClient    = inject(HttpClient);
    private _Router     : Router        = inject(Router);

    private readonly API_URL: string = "https://localhost:7000/api/auth";

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null)

    register(fullName: string, email: string, password: string, role: string): Observable<IAuth> {
        return this._HttpClient.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password, role });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClient.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout(): void {
        this._HttpClient.post<IAuth>(`${this.API_URL}/logout`, {  }, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login']);
        })
    }
}

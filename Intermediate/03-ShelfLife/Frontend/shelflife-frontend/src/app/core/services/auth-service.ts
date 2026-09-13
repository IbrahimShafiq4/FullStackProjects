import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from './toast-service';

export interface ICurrentUser { fullName: string; }
export interface IAuth { message: string; }
export interface ILogin extends IAuth, ICurrentUser { }

@Service()
export class AuthService {
    private _HttpClinet: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private _ToastService: ToastService = inject(ToastService);
    private readonly API_URL: string = "https://localhost:7033/api/auth"

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this._HttpClinet.post<IAuth>(`${this.API_URL}/register`, { fullName, email, password });
    }

    login(email: string, password: string): Observable<ILogin> {
        return this._HttpClinet.post<ILogin>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout(): void {
        this._HttpClinet.post<IAuth>(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe((logout: IAuth) => {
            this.currentUser.set(null);
            this._ToastService.show(logout.message as string, 'success')
            this._Router.navigate(['/login'])
        })
    }

}

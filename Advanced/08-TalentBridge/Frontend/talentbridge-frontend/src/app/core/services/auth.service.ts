import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private _HttpClinet     : HttpClient        = inject(HttpClient);
    private _Router         : Router            = inject(Router);
    private readonly API_URL: string            = 'https://localhost:7123/api/auth'; 
    currentUser: WritableSignal<
        { 
            fullName: string, 
            role: string 
        } | null> 
    = signal<
        { 
            fullName: string, 
            role: string 
        } | null>(null);

    register(fullName: string, email: string, password: string, role: string) {
        return this._HttpClinet.post(`${this.API_URL}/register`, { fullName, email, password, role });
    }

    login(email: string, password: string) {
        return this._HttpClinet.post(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
    }

    logout(): void {
        this._HttpClinet.post(`${this.API_URL}/logout`, {  }, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this._Router.navigate(['/login'])
        })
    }
}
import { Service, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface CurrentUser { fullName: string; role: 'Customer' | 'Agent'; }
interface LoginResponse { message: string; fullName: string; role: 'Customer' | 'Agent'; }

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly API_URL = 'https://localhost:7150/api/auth';

    currentUser = signal<CurrentUser | null>(null);

    register(fullName: string, email: string, password: string, role: string) {
        return this.http.post(`${this.API_URL}/register`, { fullName, email, password, role });
    }

    login(email: string, password: string) {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password }, { withCredentials: true });
    }

    logout() {
        this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
            this.currentUser.set(null);
            this.router.navigate(['/login']);
        });
    }
}
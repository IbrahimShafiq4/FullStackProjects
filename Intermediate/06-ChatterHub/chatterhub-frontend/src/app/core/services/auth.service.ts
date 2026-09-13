import { Service, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    currentUser = signal<{ email: string } | null>(null);

    register(fullName: string, email: string, password: string) { return this.http.post(' https://localhost:7128/api/auth/register', { email, password }); }
    login(email: string, password: string): Observable<any> { return this.http.post(' https://localhost:7128/api/auth/login', { email, password }, { withCredentials: true }); }
    logout() { this.http.post(' https://localhost:7128/api/auth/logout', {}, { withCredentials: true }).subscribe(() => { this.currentUser.set(null); this.router.navigate(['/login']); }); }
}
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
    userId: string;
    fullName: string;
    email: string;
}

const API = 'https://localhost:7128/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    currentUser = signal<AuthUser | null>(null);

    register(fullName: string, email: string, password: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${API}/register`,
            { fullName, email, password },
            { withCredentials: true }
        );
    }

    login(email: string, password: string): Observable<{ message: string; userId: string; fullName: string }> {
        return this.http
            .post<{ message: string; userId: string; fullName: string }>(
                `${API}/login`,
                { email, password },
                { withCredentials: true }
            )
            .pipe(
                tap((res) => {
                    const user: AuthUser = { userId: res.userId, fullName: res.fullName, email };
                    this.currentUser.set(user);
                    sessionStorage.setItem('ch_user', JSON.stringify(user));
                })
            );
    }

    logout(): void {
        this.http.post(`${API}/logout`, {}, { withCredentials: true }).subscribe({
            next: () => this.clearAndLeave(),
            error: () => this.clearAndLeave(),
        });
    }

    hydrate(): void {
        const raw = sessionStorage.getItem('ch_user');
        if (!raw) return;
        try { this.currentUser.set(JSON.parse(raw) as AuthUser); }
        catch { sessionStorage.removeItem('ch_user'); }
    }

    private clearAndLeave(): void {
        sessionStorage.removeItem('ch_user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }
}
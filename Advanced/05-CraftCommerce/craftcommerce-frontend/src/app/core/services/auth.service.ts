import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface ICurrentUser {
    storeName: string;
    email?: string;
    role?: string;
}

@Service()
export class AuthService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = 'https://localhost:7245/api/auth';

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
    readonly isOrganizer = computed(() => {
        const r = this.currentUser()?.role;
        return r === 'Organizer' || r === 'Artisan';
    });
    readonly isAuthenticated = computed(() => !!this.currentUser());

    register(storeName: string, email: string, password: string): Observable<{ message: string }> {
        return this._HttpClient.post<{ message: string }>(
            `${this.API_URL}/register`,
            { storeName, email, password },
        );
    }

    login(email: string, password: string): Observable<{ message: string; storeName: string }> {
        return this._HttpClient
            .post<{ message: string; storeName: string }>(
                `${this.API_URL}/login`,
                { email, password },
                { withCredentials: true },
            )
            .pipe(tap((res) => this.currentUser.set({ storeName: res.storeName, email })));
    }

    loadCurrentUser(): void {
        this._HttpClient
            .get<ICurrentUser>(`${this.API_URL}/me`, { withCredentials: true })
            .subscribe({
                next: (u) => this.currentUser.set(u),
                error: () => this.currentUser.set(null),
            });
    }

    logout(): void {
        this._HttpClient
            .post<{ message: string }>(`${this.API_URL}/logout`, {}, { withCredentials: true })
            .subscribe({
                next: () => {
                    this.currentUser.set(null);
                    this._Router.navigate(['/login']);
                },
                error: () => {
                    this.currentUser.set(null);
                    this._Router.navigate(['/login']);
                },
            });
    }
}
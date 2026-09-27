import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export type TUserRole = 'Admin' | 'Organizer' | 'Attendee';

export interface IAuthResponse {
    message: string;
    fullName: string;
    email: string;
    role: string;
}

export interface ICurrentUser {
    fullName: string;
    email: string;
    role: string;
}

@Service()
export class AuthService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _Router: Router = inject(Router);
    private readonly API_URL: string = 'https://localhost:7133/api/auth';

    currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    readonly role = computed(() => this.currentUser()?.role ?? null);
    readonly isAdmin = computed(() => this.role() === 'Admin');
    readonly isOrganizer = computed(() => this.role() === 'Organizer' || this.isAdmin());
    readonly isLoggedIn = computed(() => this.currentUser() !== null);

    register(fullName: string, email: string, password: string): Observable<{ message: string }> {
        return this._HttpClient.post<{ message: string }>(
            `${this.API_URL}/register`,
            { fullName, email, password }
        );
    }

    login(email: string, password: string): Observable<IAuthResponse> {
        return this._HttpClient
            .post<IAuthResponse>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
            .pipe(
                tap((res) => {
                    this.currentUser.set({
                        fullName: res.fullName,
                        email: res.email,
                        role: res.role,
                    });
                })
            );
    }

    loadCurrentUser(): Observable<any> {
        return this._HttpClient
            .get<any>(`${this.API_URL}/me`, { withCredentials: true })
            .pipe(
                tap((res) => {
                    const role = Array.isArray(res.roles) && res.roles.length > 0 ? res.roles[0] : 'Attendee';
                    this.currentUser.set({
                        fullName: res.fullName,
                        email: res.email,
                        role,
                    });
                })
            );
    }

    logout(): void {
        this._HttpClient
            .post(`${this.API_URL}/logout`, {}, { withCredentials: true })
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
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export type Role = 'Candidate' | 'Employer';

export interface CurrentUser {
    id: string;
    fullName: string;
    email: string;
    role: Role;
}

interface LoginResponse {
    message: string;
    fullName: string;
    role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly API = 'https://localhost:7067/api/auth';

    private _currentUser = signal<CurrentUser | null>(null);
    readonly currentUser = this._currentUser.asReadonly();

    readonly isCandidate = computed(() => this._currentUser()?.role === 'Candidate');
    readonly isEmployer = computed(() => this._currentUser()?.role === 'Employer');

    async bootstrap(): Promise<void> {
        try {
            const me = await firstValueFrom(
                this.http.get<CurrentUser>(`${this.API}/me`)
            );
            this._currentUser.set(me);
        } catch {
            this._currentUser.set(null);
        }
    }

    register(fullName: string, email: string, password: string, role: Role) {
        return this.http.post<{ message: string }>(
            `${this.API}/register`,
            { fullName, email, password, role }
        );
    }

    async login(email: string, password: string): Promise<CurrentUser> {
        await firstValueFrom(
            this.http.post<LoginResponse>(`${this.API}/login`, { email, password }, { withCredentials: true })
        );
        const me = await firstValueFrom(
            this.http.get<CurrentUser>(`${this.API}/me`, { withCredentials: true })
        );
        this._currentUser.set(me);
        return me;
    }

    async logout(): Promise<void> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/logout`, {}, { withCredentials: true }));
        } finally {
            this._currentUser.set(null);
            this.router.navigate(['/']);
        }
    }

    homeFor(role: Role): string {
        return role === 'Employer' ? '/employer/dashboard' : '/candidate/dashboard';
    }
}
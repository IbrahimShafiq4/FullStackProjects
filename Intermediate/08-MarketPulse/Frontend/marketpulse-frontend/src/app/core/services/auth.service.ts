import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';

export interface ICurrentUser {
    userId: string;
    fullName: string;
    email?: string;
    avatarUrl?: string | null;
}

export interface IAuth { message: string; }
export interface ILogin extends IAuth {
    fullName: string;
    userId: string;
    avatarUrl?: string | null;
}

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly API = 'https://localhost:7071/api/auth';

    currentUser = signal<ICurrentUser | null>(null);
    ready = signal(false);

    register(fullName: string, email: string, password: string): Observable<IAuth> {
        return this.http.post<IAuth>(
            `${this.API}/register`,
            { fullName, email, password },
            { withCredentials: true }
        );
    }

    login(email: string, password: string): Observable<ILogin> {
        return this.http.post<ILogin>(
            `${this.API}/login`,
            { email, password },
            { withCredentials: true }
        ).pipe(tap(res => {
            this.currentUser.set({
                userId: res.userId,
                fullName: res.fullName,
                avatarUrl: res.avatarUrl ?? null
            });
            this.ready.set(true);
        }));
    }

    async hydrate(): Promise<void> {
        if (this.ready()) return;

        const user = await firstValueFrom(
            this.http
                .get<ICurrentUser>(`${this.API}/me`, { withCredentials: true })
                .pipe(catchError(() => of(null)))
        );

        this.currentUser.set(user);
        this.ready.set(true);
    }

    logout(): void {
        this.http
            .post<IAuth>(`${this.API}/logout`, {}, { withCredentials: true })
            .subscribe({
                next: () => this.finishLogout(),
                error: () => this.finishLogout()
            });
    }

    private finishLogout() {
        this.currentUser.set(null);
        this.ready.set(true);
        this.router.navigate(['/login']);
    }
}
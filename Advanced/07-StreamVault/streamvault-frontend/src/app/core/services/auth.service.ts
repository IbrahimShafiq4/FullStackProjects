import { HttpClient } from '@angular/common/http';
import { Service, signal, inject, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { ICurrentUser, ILoginResponse, IMessageResponse, IRegisterResponse } from '../models';
import { environment } from '../../src/environments';

@Service()
export class AuthService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _Router: Router = inject(Router);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/auth`;

    public currentUser: WritableSignal<ICurrentUser | null> = signal<ICurrentUser | null>(null);

    public register(fullName: string, email: string, password: string): Observable<IRegisterResponse> {
        return this._HttpClient.post<IRegisterResponse>(
            `${this._ApiUrl}/register`,
            { fullName, email, password },
            { withCredentials: true }
        );
    }

    public registerTeacher(fullName: string, email: string, password: string, inviteCode: string): Observable<IRegisterResponse> {
        return this._HttpClient.post<IRegisterResponse>(
            `${this._ApiUrl}/register-teacher`,
            { fullName, email, password, inviteCode },
            { withCredentials: true }
        );
    }

    public login(email: string, password: string): Observable<ILoginResponse> {
        return this._HttpClient.post<ILoginResponse>(
            `${this._ApiUrl}/login`,
            { email, password },
            { withCredentials: true }
        ).pipe(
            tap((response: ILoginResponse) => {
                this.currentUser.set({
                    id: '',
                    fullName: response.fullName,
                    email: email,
                    role: response.role
                });
            })
        );
    }

    public loadCurrentUser(): Observable<ICurrentUser | null> {
        return this._HttpClient.get<ICurrentUser>(
            `${this._ApiUrl}/me`,
            { withCredentials: true }
        ).pipe(
            tap((user: ICurrentUser) => this.currentUser.set(user)),
            catchError(() => {
                this.currentUser.set(null);
                return of(null);
            })
        );
    }

    public logout(): Observable<IMessageResponse> {
        return this._HttpClient.post<IMessageResponse>(
            `${this._ApiUrl}/logout`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(() => this.clearSession())
        );
    }

    public clearSession(): void {
        this.currentUser.set(null);
    }

    public isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }

    public isInstructor(): boolean {
        return this.currentUser()?.role === 'Instructor';
    }

    public isStudent(): boolean {
        return this.currentUser()?.role === 'Student';
    }
}
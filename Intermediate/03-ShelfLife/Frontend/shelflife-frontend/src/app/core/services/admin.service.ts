import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    isCurrentUser: boolean;
}

export interface IMessage {
    message: string;
}

@Service()
export class AdminService {
    private _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/admin';

    users: WritableSignal<IUser[]> = signal<IUser[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);

    loadUsers(): void {
        this.loading.set(true);

        this._http.get<IUser[]>(`${this.API_URL}/users`, { withCredentials: true }).subscribe({
            next: (users) => {
                this.users.set(users);
                this.loading.set(false);
            },
            error: () => {
                this.users.set([]);
                this.loading.set(false);
            }
        });
    }

    promote(userId: string): Observable<IMessage> {
        return this._http.post<IMessage>(
            `${this.API_URL}/promote/${userId}`,
            {},
            { withCredentials: true }
        );
    }

    demote(userId: string): Observable<IMessage> {
        return this._http.post<IMessage>(
            `${this.API_URL}/demote/${userId}`,
            {},
            { withCredentials: true }
        );
    }
}
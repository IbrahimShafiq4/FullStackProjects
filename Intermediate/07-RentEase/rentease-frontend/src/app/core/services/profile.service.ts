import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    equipmentCount: number;
    activeRentalsCount: number;
    completedRentalsCount: number;
}

export interface IUpdateProfile {
    fullName: string;
    phoneNumber: string | null;
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

@Service()
export class ProfileService {
    private readonly _http = inject(HttpClient);
    private readonly API = 'https://localhost:7108/api/profile';

    profile: WritableSignal<IProfile | null> = signal<IProfile | null>(null);

    load(): void {
        this._http.get<IProfile>(this.API).subscribe({
            next: (p) => this.profile.set(p),
            error: () => this.profile.set(null),
        });
    }

    update(dto: IUpdateProfile): Observable<{ message: string }> {
        return this._http.put<{ message: string }>(this.API, dto);
    }

    changePassword(dto: IChangePassword): Observable<{ message: string }> {
        return this._http.put<{ message: string }>(`${this.API}/password`, dto);
    }
}
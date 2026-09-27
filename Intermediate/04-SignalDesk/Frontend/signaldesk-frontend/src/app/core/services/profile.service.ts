import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../models/ticket';

@Service()
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7150/api/profile';

    profile = signal<IProfile | null>(null);

    load() {
        return this.http.get<IProfile>(this.API_URL, { withCredentials: true });
    }

    update(fullName: string) {
        return this.http.put<IProfile>(this.API_URL, { fullName }, { withCredentials: true });
    }

    changePassword(currentPassword: string, newPassword: string) {
        return this.http.post(`${this.API_URL}/change-password`, { currentPassword, newPassword }, { withCredentials: true });
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface CandidateProfile {
    userId: string;
    fullName: string;
    bio: string;
    skills: string[];
}

export interface UpdateProfilePayload {
    bio: string;
    skills: string[];
}

@Injectable({ providedIn: 'root' })
export class CandidatesService {
    private http = inject(HttpClient);
    private readonly API = 'https://localhost:7067/api/candidates';

    private _profile = signal<CandidateProfile | null>(null);
    readonly profile = this._profile.asReadonly();

    async loadProfile(): Promise<CandidateProfile | null> {
        try {
            const p = await firstValueFrom(
                this.http.get<CandidateProfile>(`${this.API}/profile`, { withCredentials: true })
            );
            this._profile.set(p);
            return p;
        } catch {
            this._profile.set(null);
            return null;
        }
    }

    async updateProfile(payload: UpdateProfilePayload): Promise<void> {
        await firstValueFrom(this.http.put(`${this.API}/profile`, payload, { withCredentials: true }));
        this._profile.set({
            userId: this._profile()?.userId ?? '',
            fullName: this._profile()?.fullName ?? '',
            bio: payload.bio,
            skills: payload.skills,
        });
    }
}
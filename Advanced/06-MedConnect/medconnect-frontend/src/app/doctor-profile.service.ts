import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from './environments/environment';

export interface IAchievement {
    title: string;
    year: string;
    description: string;
}

export interface ICertificate {
    title: string;
    issuer: string;
    year: string;
}

export interface IDoctorProfile {
    doctorId: string;
    fullName: string;
    specialty: string;
    photoUrl: string;
    bio: string;
    yearsOfExperience: number;
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicHours: string;
    examinationFee: number;
    consultationFee: number;
    currency: string;
    achievements: IAchievement[];
    certificates: ICertificate[];
    languages: string[];
}

export interface IUpdateDoctorProfile {
    photoUrl?: string;
    bio?: string;
    yearsOfExperience?: number;
    clinicName?: string;
    clinicAddress?: string;
    clinicPhone?: string;
    clinicHours?: string;
    examinationFee?: number;
    consultationFee?: number;
    currency?: string;
    achievements?: IAchievement[];
    certificates?: ICertificate[];
    languages?: string[];
}

@Injectable({ providedIn: 'root' })
export class DoctorProfileService {
    private readonly _http = inject(HttpClient);
    private readonly API = `${environment.apiBaseUrl}/doctorprofile`;

    myProfile: WritableSignal<IDoctorProfile | null> = signal(null);
    loading = signal(false);

    getProfile(doctorId: string): Observable<IDoctorProfile> {
        return this._http.get<IDoctorProfile>(`${this.API}/${doctorId}`);
    }

    loadMine(): void {
        this.loading.set(true);
        this._http.get<IDoctorProfile>(`${this.API}/me`).subscribe({
            next: (p) => { this.myProfile.set(p); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    updateMine(dto: IUpdateDoctorProfile): Observable<unknown> {
        return this._http.put(`${this.API}/me`, dto).pipe(tap(() => this.loadMine()));
    }

    uploadPhoto(file: File): Observable<{ url: string }> {
        const fd = new FormData();
        fd.append('file', file);
        return this._http.post<{ url: string }>(`${this.API}/me/photo`, fd);
    }

    resolveUrl(path: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${environment.serverOrigin}${path}`;
    }
}
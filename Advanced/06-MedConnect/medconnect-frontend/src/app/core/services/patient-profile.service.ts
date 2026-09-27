import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IPatientProfile {
    patientId: number;
    fullName: string;
    photoUrl: string;
    bloodType: string;
    dateOfBirth: string | null;
    gender: string;
    phone: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    chronicDiseases: string[];
    allergies: string[];
    currentMedications: string[];
}

export interface IUpdatePatientProfile {
    photoUrl?: string;
    bloodType?: string;
    dateOfBirth?: string | null;
    gender?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    chronicDiseases?: string[];
    allergies?: string[];
    currentMedications?: string[];
}

@Injectable({ providedIn: 'root' })
export class PatientProfileService {
    private readonly _http = inject(HttpClient);
    private readonly API = `${environment.apiBaseUrl}/patientprofile`;

    myProfile: WritableSignal<IPatientProfile | null> = signal(null);

    getMine(): Observable<IPatientProfile> {
        return this._http.get<IPatientProfile>(`${this.API}/me`).pipe(tap((p) => this.myProfile.set(p)));
    }

    getById(patientId: number): Observable<IPatientProfile> {
        return this._http.get<IPatientProfile>(`${this.API}/${patientId}`);
    }

    updateMine(dto: IUpdatePatientProfile): Observable<unknown> {
        return this._http.put(`${this.API}/me`, dto).pipe(tap(() => this.getMine().subscribe()));
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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface IFeaturedDoctor {
    id: string;
    fullName: string;
    specialty: string;
    photoUrl: string;
    yearsOfExperience: number;
    examinationFee: number;
    currency: string;
    averageRating: number;
    totalReviews: number;
}

@Injectable({ providedIn: 'root' })
export class FeaturedDoctorsService {
    private readonly _http = inject(HttpClient);
    private readonly API = `${environment.apiBaseUrl}/doctors/featured`;

    doctors: WritableSignal<IFeaturedDoctor[]> = signal([]);
    loading = signal(false);

    load(take = 6): void {
        this.loading.set(true);
        this._http.get<IFeaturedDoctor[]>(`${this.API}?take=${take}`).subscribe({
            next: (d) => { this.doctors.set(d); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    resolveUrl(path: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${environment.serverOrigin}${path}`;
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface Applicant {
    id: number;
    candidateId: string;
    candidateName: string;
    candidateBio: string;
    candidateSkills: string[];
    matchScore: number;
    status: string;
    appliedAt: string;
}

export interface ApplyResult {
    id: number;
    matchScore: number;
}

export interface MyApplication {
    id: number;
    jobId: number;
    jobTitle: string;
    employerName: string;
    matchScore: number;
    status: string;
    appliedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
    private http = inject(HttpClient);
    private readonly API = 'https://localhost:7067/api/applications';

    // ── Employer side: applicants for a job ──────────────────────────
    private _applicants = signal<Applicant[]>([]);
    readonly applicants = this._applicants.asReadonly();

    private _loading = signal(false);
    readonly loading = this._loading.asReadonly();

    private _error = signal<string | null>(null);
    readonly error = this._error.asReadonly();

    // ── Candidate side: my applications ──────────────────────────────
    private _mine = signal<MyApplication[]>([]);
    readonly mine = this._mine.asReadonly();

    private _mineLoading = signal(false);
    readonly mineLoading = this._mineLoading.asReadonly();

    // ── Candidate: apply to a job ────────────────────────────────────
    async apply(jobId: number): Promise<ApplyResult> {
        return firstValueFrom(
            this.http.post<ApplyResult>(`${this.API}/job/${jobId}`, {}, { withCredentials: true })
        );
    }

    // ── Employer: load applicants for a job ──────────────────────────
    async loadApplicants(jobId: number): Promise<void> {
        this._loading.set(true);
        this._error.set(null);
        try {
            const list = await firstValueFrom(
                this.http.get<Applicant[]>(`${this.API}/job/${jobId}`, { withCredentials: true })
            );
            this._applicants.set(list);
        } catch {
            this._error.set('تعذّر تحميل المتقدمين.');
        } finally {
            this._loading.set(false);
        }
    }

    // ── Candidate: load my applications ──────────────────────────────
    async loadMine(): Promise<void> {
        this._mineLoading.set(true);
        try {
            const list = await firstValueFrom(
                this.http.get<MyApplication[]>(`${this.API}/my`, { withCredentials: true })
            );
            this._mine.set(list);
        } catch {
            this._mine.set([]);
        } finally {
            this._mineLoading.set(false);
        }
    }

    // ── Employer: change application status ──────────────────────────
    async updateStatus(applicationId: number, status: string): Promise<void> {
        await firstValueFrom(
            this.http.patch(`${this.API}/${applicationId}/status`, { status }, { withCredentials: true })
        );
        this._applicants.update((list) =>
            list.map((a) => (a.id === applicationId ? { ...a, status } : a))
        );
    }
}
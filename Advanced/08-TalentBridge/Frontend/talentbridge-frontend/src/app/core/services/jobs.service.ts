import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type WorkMode = 'OnSite' | 'Hybrid' | 'Remote';

export interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    workMode: WorkMode;
    salaryMin: number | null;
    salaryMax: number | null;
    employerName: string;
    employerId: string;
    createdAt: string;
    mustHaveSkills: string[];
    niceToHaveSkills: string[];
}

export interface CreateJobPayload {
    title: string;
    description: string;
    location: string;
    workMode: WorkMode;
    salaryMin: number | null;
    salaryMax: number | null;
    requiredSkills: { skillName: string; importance: 'MustHave' | 'NiceToHave' }[];
}

@Injectable({ providedIn: 'root' })
export class JobsService {
    private http = inject(HttpClient);
    private readonly API = 'https://localhost:7067/api/jobs';

    private _jobs = signal<Job[]>([]);
    readonly jobs = this._jobs.asReadonly();

    private _loading = signal(false);
    readonly loading = this._loading.asReadonly();

    private _error = signal<string | null>(null);
    readonly error = this._error.asReadonly();

    async load(): Promise<void> {
        this._loading.set(true);
        this._error.set(null);
        try {
            const jobs = await firstValueFrom(this.http.get<Job[]>(this.API, { withCredentials: true }));
            this._jobs.set(jobs);
        } catch {
            this._error.set('تعذّر تحميل الوجهات.');
        } finally {
            this._loading.set(false);
        }
    }

    async loadOne(id: number): Promise<Job | null> {
        try {
            const job = await firstValueFrom(this.http.get<Job>(`${this.API}/${id}`, { withCredentials: true }));
            this._jobs.update((list) => {
                const idx = list.findIndex((j) => j.id === id);
                if (idx === -1) return [...list, job];
                const copy = [...list];
                copy[idx] = job;
                return copy;
            });
            return job;
        } catch {
            return this.findById(id) ?? null;
        }
    }

    async create(payload: CreateJobPayload): Promise<number> {
        const res = await firstValueFrom(
            this.http.post<{ id: number }>(this.API, payload, { withCredentials: true })
        );
        await this.load();
        return res.id;
    }

    async remove(id: number): Promise<void> {
        await firstValueFrom(this.http.delete(`${this.API}/${id}`, { withCredentials: true }));
        this._jobs.update((list) => list.filter((j) => j.id !== id));
    }

    findById(id: number): Job | undefined {
        return this._jobs().find((j) => j.id === id);
    }

    updateProfile(bio: string, skills: string[]) {
        return this.http.put('https://localhost:7067/api/candidates/profile', { bio, skills }, { withCredentials: true });
    }
}
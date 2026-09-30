import { HttpClient } from '@angular/common/http';
import { inject, Inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
export interface IJob {
    id              : number;
    title           : string;
    description     : string;
    employerName    : string;
    mustHaveSkills  : string[];
    niceToHaveSkills: string[];
}

export interface IApplicant {
    id          : number;
    candidateId : string;
    matchScore  : number;
    status      : string;
    appliedAt   : string;
}

@Service()
export class JobsService { 
    private _HttpClient     : HttpClient                    = inject(HttpClient);
    private readonly BASE   : string                        = 'https://localhost:7123/api';
    jobs                    : WritableSignal<IJob[]>        = signal<IJob[]>([]);
    applicants              : WritableSignal<IApplicant[]>  = signal<IApplicant[]>([]);

    loadJob(): void {
        this._HttpClient.get<IJob[]>(`${this.BASE}/jobs`).subscribe({
            next: (jobs: IJob[]) => this.jobs.set(jobs),
        });
    }

    createJob(title: string, description: string, requiredSkills: any[]): Observable<{ id: number }> {
        return this._HttpClient.post<{id: number}>(`${this.BASE}/jobs`, { title: description, requiredSkills });
    }

    deleteJob(id: number) {
        return this._HttpClient.delete(`${this.BASE}/jobs/${id}`);
    }

    apply(jobId: number): Observable<{ matchScore: number }> {
        return this._HttpClient.post<{ matchScore: number }>(`${this.BASE}/applications/job/${jobId}`, {})
    }

    loadApplicants(jobId: number): void {
        this._HttpClient.get<IApplicant[]>(`${this.BASE}/applications/job/${jobId}`).subscribe({
            next: (applicants: IApplicant[]) => this.applicants.set(applicants),
        })
    }

    updateProfile(bio: string, skills: string[]) {
        return this._HttpClient.put(`${this.BASE}/candidates/profile`, { bio, skills })
    }
}

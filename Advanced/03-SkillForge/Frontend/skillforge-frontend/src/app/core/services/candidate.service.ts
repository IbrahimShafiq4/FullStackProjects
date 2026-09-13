import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface ICandidate {
    id: number;
    fullName: string;
    email: string;
}

@Service()
export class CandidateService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE: string = "https://localhost:7217/api/candidates";

    public candidate: WritableSignal<ICandidate | null> = signal<ICandidate | null>(null);

    loadMe(): Observable<ICandidate> {
        return this._HttpClient.get<ICandidate>(`${this.BASE}/me`).pipe(
            tap((c) => this.candidate.set(c))
        );
    }
}
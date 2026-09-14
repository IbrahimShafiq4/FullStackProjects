import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IChallenge {
    id: number;
    title: string;
    description: string;
    reward: string;
    days: number;
    target: number;
    isActive: boolean;
    createdAt: string;
}

export interface ICreateChallenge {
    title: string;
    description: string;
    reward: string;
    days: number;
    target: number;
}

export interface IParticipation {
    id: number;
    challengeId: number;
    challengeTitle: string;
    userId: string;
    userName: string;
    photoUrl: string;
    caption: string;
    submittedAt: string;
    rank: number | null;
}

@Service()
export class ChallengeService {
    private _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/challenges';
    private readonly PART_API = 'https://localhost:7033/api/challengeparticipations';
    private readonly SERVER_ROOT = 'https://localhost:7033';

    active: WritableSignal<IChallenge | null> = signal<IChallenge | null>(null);
    all: WritableSignal<IChallenge[]> = signal<IChallenge[]>([]);

    myParticipation: WritableSignal<IParticipation | null> = signal<IParticipation | null>(null);
    submissions: WritableSignal<IParticipation[]> = signal<IParticipation[]>([]);
    winners: WritableSignal<IParticipation[]> = signal<IParticipation[]>([]);

    loadActive(): void {
        this._http.get<IChallenge | null>(`${this.API_URL}/active`).subscribe({
            next: (challenge) => {
                this.active.set(challenge);

                if (challenge) {
                    this.loadWinners(challenge.id);
                } else {
                    this.winners.set([]);
                }
            },
            error: () => {
                this.active.set(null);
                this.winners.set([]);
            }
        });
    }

    loadAll(): void {
        this._http.get<IChallenge[]>(this.API_URL, { withCredentials: true }).subscribe({
            next: (list) => this.all.set(list),
            error: () => this.all.set([])
        });
    }

    create(dto: ICreateChallenge): Observable<{ id: number; message: string }> {
        return this._http.post<{ id: number; message: string }>(this.API_URL, dto, { withCredentials: true });
    }

    activate(id: number): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(`${this.API_URL}/${id}/activate`, {}, { withCredentials: true });
    }

    delete(id: number): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    loadMyParticipation(challengeId: number): void {
        this._http.get<IParticipation | null>(`${this.PART_API}/my/${challengeId}`, { withCredentials: true }).subscribe({
            next: (p) => this.myParticipation.set(p),
            error: () => this.myParticipation.set(null)
        });
    }

    submitParticipation(challengeId: number, caption: string, photo: File): Observable<{ id: number; message: string }> {
        const formData = new FormData();
        formData.append('challengeId', challengeId.toString());
        formData.append('caption', caption);
        formData.append('photo', photo, photo.name);

        return this._http.post<{ id: number; message: string }>(this.PART_API, formData, { withCredentials: true });
    }

    deleteMyParticipation(participationId: number): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(`${this.PART_API}/${participationId}`, { withCredentials: true });
    }

    loadSubmissions(challengeId: number): void {
        this._http.get<IParticipation[]>(`${this.PART_API}/challenge/${challengeId}`, { withCredentials: true }).subscribe({
            next: (list) => this.submissions.set(list),
            error: () => this.submissions.set([])
        });
    }

    setRank(participationId: number, rank: number | null): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(
            `${this.PART_API}/${participationId}/rank`,
            { rank },
            { withCredentials: true }
        );
    }

    loadWinners(challengeId: number): void {
        this._http.get<IParticipation[]>(`${this.PART_API}/challenge/${challengeId}/winners`).subscribe({
            next: (list) => this.winners.set(list),
            error: () => this.winners.set([])
        });
    }

    getFullUrl(relativeUrl: string | null): string {
        if (!relativeUrl) return '';
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }
}
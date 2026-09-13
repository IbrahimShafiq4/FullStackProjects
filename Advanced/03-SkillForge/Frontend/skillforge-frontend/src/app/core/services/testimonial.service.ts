import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ITestimonial {
    id: number;
    authorName: string;
    authorRole: string;
    message: string;
    rating: number;
    createdAt: string;
    companyName: string | null;
}

export interface ICreateTestimonial {
    authorName: string;
    authorRole: string;
    message: string;
    rating: number;
}

@Service()
export class TestimonialService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE: string = "https://localhost:7217/api/testimonials";

    published: WritableSignal<ITestimonial[]> = signal<ITestimonial[]>([]);
    mine: WritableSignal<ITestimonial[]> = signal<ITestimonial[]>([]);

    loadPublished(take: number = 12): void {
        this._HttpClient.get<ITestimonial[]>(`${this.BASE}?take=${take}`).subscribe({
            next: (items) => this.published.set(items)
        });
    }

    loadMine(): void {
        this._HttpClient.get<ITestimonial[]>(`${this.BASE}/mine`).subscribe({
            next: (items) => this.mine.set(items)
        });
    }

    create(payload: ICreateTestimonial): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(`${this.BASE}`, payload);
    }

    delete(id: number): Observable<void> {
        return this._HttpClient.delete<void>(`${this.BASE}/${id}`);
    }
}
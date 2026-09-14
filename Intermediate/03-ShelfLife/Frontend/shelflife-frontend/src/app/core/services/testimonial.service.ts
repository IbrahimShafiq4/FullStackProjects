import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ITestimonial {
    id: number;
    name: string;
    role: string;
    city: string;
    quote: string;
    initials: string;
    rating: number;
    isApproved: boolean;
    createdAt: string;
}

export interface ICreateTestimonial {
    name: string;
    role: string;
    city: string;
    quote: string;
    rating: number;
}

@Service()
export class TestimonialService {
    private _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/testimonials';

    approved: WritableSignal<ITestimonial[]> = signal<ITestimonial[]>([]);
    pending: WritableSignal<ITestimonial[]> = signal<ITestimonial[]>([]);
    mySubmissions: WritableSignal<ITestimonial[]> = signal<ITestimonial[]>([]);

    loadApproved(): void {
        this._http.get<ITestimonial[]>(this.API_URL).subscribe({
            next: (items) => this.approved.set(items),
            error: () => this.approved.set([])
        });
    }

    loadPending(): void {
        this._http.get<ITestimonial[]>(`${this.API_URL}/pending`, { withCredentials: true }).subscribe({
            next: (items) => this.pending.set(items),
            error: () => this.pending.set([])
        });
    }

    loadMine(): void {
        this._http.get<ITestimonial[]>(`${this.API_URL}/mine`, { withCredentials: true }).subscribe({
            next: (items) => this.mySubmissions.set(items),
            error: () => this.mySubmissions.set([])
        });
    }

    create(dto: ICreateTestimonial): Observable<{ id: number; message: string }> {
        return this._http.post<{ id: number; message: string }>(
            this.API_URL,
            dto,
            { withCredentials: true }
        );
    }

    approve(id: number): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(
            `${this.API_URL}/${id}/approve`,
            {},
            { withCredentials: true }
        );
    }

    delete(id: number): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(
            `${this.API_URL}/${id}`,
            { withCredentials: true }
        );
    }
}
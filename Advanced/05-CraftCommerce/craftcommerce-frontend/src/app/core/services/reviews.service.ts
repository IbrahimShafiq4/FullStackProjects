import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IReview {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    productId: number;
    productName: string;
    buyerId: string;
}

@Service()
export class ReviewsService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/reviews';

    myReviews: WritableSignal<IReview[]> = signal<IReview[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    addReview(productId: number, rating: number, comment: string): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(
            `${this.API_URL}/product/${productId}`,
            { rating, comment },
        );
    }

    getProductReviews(productId: number): Observable<IReview[]> {
        return this._HttpClient.get<IReview[]>(`${this.API_URL}/product/${productId}`);
    }

    loadMyReviews(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<IReview[]>(`${this.API_URL}/my-reviews`).subscribe({
            next: (list) => { this.myReviews.set(list); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    updateReview(productId: number, reviewId: number, rating: number, comment: string): Observable<{ message: string }> {
        return this._HttpClient.put<{ message: string }>(
            `${this.API_URL}/update/${productId}/${reviewId}`,
            { rating, comment },
        );
    }

    deleteReview(productId: number, reviewId: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${productId}/${reviewId}`);
    }
}
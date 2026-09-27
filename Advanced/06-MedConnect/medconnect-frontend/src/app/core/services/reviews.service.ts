import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IReview {
  id: number;
  doctorId: string;
  doctorName: string;
  patientId: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IReviewSummary {
  doctorId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly _http = inject(HttpClient);
  private readonly API = `${environment.apiBaseUrl}/reviews`;

  myReviews: WritableSignal<IReview[]> = signal([]);

  getByDoctor(doctorId: string): Observable<IReview[]> {
    return this._http.get<IReview[]>(`${this.API}/doctor/${doctorId}`);
  }

  getSummary(doctorId: string): Observable<IReviewSummary> {
    return this._http.get<IReviewSummary>(`${this.API}/doctor/${doctorId}/summary`);
  }

  loadMine(): void {
    this._http.get<IReview[]>(`${this.API}/my`).subscribe({
      next: (r) => this.myReviews.set(r),
    });
  }

  create(dto: { doctorId: string; appointmentId?: number; rating: number; comment: string }): Observable<{ id: number }> {
    return this._http.post<{ id: number }>(this.API, dto);
  }

  delete(id: number): Observable<unknown> {
    return this._http.delete(`${this.API}/${id}`);
  }
}
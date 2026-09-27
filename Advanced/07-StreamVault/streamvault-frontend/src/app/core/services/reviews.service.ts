import { HttpClient, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICanReviewResponse, ICreateReview, IRatingSummary, IReview } from '../models';
import { environment } from '../../src/environments';

@Service()
export class ReviewsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/reviews`;

    public createReview(dto: ICreateReview): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(this._ApiUrl, dto, { withCredentials: true });
    }

    public getReviewsForTarget(targetType: number, targetId: number): Observable<IReview[]> {
        const params: HttpParams = new HttpParams()
            .set('targetType', targetType.toString())
            .set('targetId', targetId.toString());
        return this._HttpClient.get<IReview[]>(`${this._ApiUrl}/target`, { params, withCredentials: true });
    }

    public getRatingSummary(targetType: number, targetId: number): Observable<IRatingSummary> {
        const params: HttpParams = new HttpParams()
            .set('targetType', targetType.toString())
            .set('targetId', targetId.toString());
        return this._HttpClient.get<IRatingSummary>(`${this._ApiUrl}/summary`, { params, withCredentials: true });
    }

    public canReview(targetType: number, targetId: number): Observable<ICanReviewResponse> {
        const params: HttpParams = new HttpParams()
            .set('targetType', targetType.toString())
            .set('targetId', targetId.toString());
        return this._HttpClient.get<ICanReviewResponse>(`${this._ApiUrl}/can-review`, { params, withCredentials: true });
    }
}
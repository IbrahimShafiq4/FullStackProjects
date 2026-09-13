import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface ICoachRatingDto {
    coachId: string;
    coachName: string;
    averageRating: number;
    ratingCount: number;
}

export interface IRatingResponse {
    averageRating: number;
    ratingCount: number;
    ratings: {
        id: number;
        rating: number;
        comment: string;
        ratedAt: string;
        traineeName: string;
    }[];
}

@Service()
export class RatingService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7000/api/v1/ratings';

    addRating(coachId: string, rating: number, comment: string, workoutPlanId?: number): Observable<{ message: string; ratingId: number }> {
        return this._HttpClient.post<{ message: string; ratingId: number }>(this.API_URL, {
            coachId,
            rating,
            comment,
            workoutPlanId
        });
    }

    getCoachRatings(coachId: string): Observable<IRatingResponse> {
        return this._HttpClient.get<IRatingResponse>(`${this.API_URL}/coach/${coachId}`);
    }

    hasRated(coachId: string): Observable<{ hasRated: boolean }> {
        return this._HttpClient.get<{ hasRated: boolean }>(`${this.API_URL}/check/${coachId}`);
    }

    getTopCoaches(take = 5): Observable<ICoachRatingDto[]> {
        return this._HttpClient.get<ICoachRatingDto[]>(`${this.API_URL}/top-coaches?take=${take}`);
    }
}
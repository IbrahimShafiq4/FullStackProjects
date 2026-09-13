import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvent } from './event';

export interface ILandingStats {
    totalEvents: number;
    totalAttendees: number;
    totalOrganizers: number;
    totalCities: number;
    upcomingEvents: number;
    totalRsvps: number;
}

export interface ITestimonial {
    name: string;
    role: string;
    message: string;
    avatar: string;
    rating: number;
}

export interface ICategory {
    name: string;
    icon: string;
    description: string;
    eventCount: number;
}

@Service()
export class LandingService {
    private readonly _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7297/api/landing';

    getStats(): Observable<ILandingStats> {
        return this._http.get<ILandingStats>(`${this.API_URL}/stats`);
    }

    getFeatured(count: number = 6): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this.API_URL}/featured?count=${count}`);
    }

    getTestimonials(): Observable<ITestimonial[]> {
        return this._http.get<ITestimonial[]>(`${this.API_URL}/testimonials`);
    }

    getCategories(): Observable<ICategory[]> {
        return this._http.get<ICategory[]>(`${this.API_URL}/categories`);
    }
}
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface ILandingStats {
    totalEvents: number;
    totalVenues: number;
    totalBookings: number;
    totalAttendees: number;
    totalRevenue: number;
    upcomingEvents: number;
}

export interface IFeaturedEvent {
    id: number;
    title: string;
    eventDate: string;
    basePrice: number;
    venueName: string;
    venueAddress: string;
    totalSeats: number;
    bookedSeats: number;
    availableSeats: number;
    organizerName: string;
}

export interface IVenueCard {
    id: number;
    name: string;
    address: string;
    totalRows: number;
    seatsPerRow: number;
    totalCapacity: number;
    totalEvents: number;
}

export interface ICategory {
    key: string;
    name: string;
    hieroglyph: string;
    description: string;
    eventCount: number;
}

export interface IActivity {
    userName: string;
    userInitial: string;
    action: string;
    city: string;
    timeAgo: string;
    hieroglyph: string;
}

export interface ITestimonial {
    id: number;
    name: string;
    role: string;
    city: string;
    message: string;
    hieroglyph: string;
    rating: number;
}

export interface IPricingRule {
    key: string;
    name: string;
    hieroglyph: string;
    description: string;
    effect: string;
}

@Service()
export class LandingService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly BASE: string = 'https://localhost:7133/api/landing';

    getStats(): Observable<ILandingStats> {
        return this._http.get<ILandingStats>(`${this.BASE}/stats`);
    }

    getFeaturedEvents(take: number = 6): Observable<IFeaturedEvent[]> {
        return this._http.get<IFeaturedEvent[]>(`${this.BASE}/featured-events?take=${take}`);
    }

    getVenues(take: number = 6): Observable<IVenueCard[]> {
        return this._http.get<IVenueCard[]>(`${this.BASE}/venues?take=${take}`);
    }

    getCategories(): Observable<ICategory[]> {
        return this._http.get<ICategory[]>(`${this.BASE}/categories`);
    }

    getActivity(take: number = 8): Observable<IActivity[]> {
        return this._http.get<IActivity[]>(`${this.BASE}/activity?take=${take}`);
    }

    getTestimonials(take: number = 6): Observable<ITestimonial[]> {
        return this._http.get<ITestimonial[]>(`${this.BASE}/testimonials?take=${take}`);
    }

    getPricingRules(): Observable<IPricingRule[]> {
        return this._http.get<IPricingRule[]>(`${this.BASE}/pricing-rules`);
    }
}
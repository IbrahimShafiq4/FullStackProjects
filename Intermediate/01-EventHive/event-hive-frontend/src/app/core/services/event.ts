import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IEvent {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    capcity: number;
    availableSpots: number;
    location?: string;
    organizerName: string;
    isActive: boolean;
    rsvps: IRsvp[]
}

export interface IRsvp {
    attendeeId: string;
    attendeeName: string;
    createdAt: string;
    isConfirmed: boolean;
}

export interface IEventResponse { message: string; }

@Service()
export class EventSerivce {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = "https://localhost:7297/api/events";

    events: WritableSignal<IEvent[]> = signal<IEvent[]>([]);

    loadEvents(upcoming: boolean = false): void {
        const url: string = upcoming ? `${this.API_URL}?upcoming=true` : this.API_URL;
        this._HttpClient.get<IEvent[]>(url, { withCredentials: true }).subscribe({
            next: (events: IEvent[]) => this.events.set(events),
        });
    }

    getEventById(id: number): Observable<IEvent> {
        return this._HttpClient.get<IEvent>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    createEvent(formData: any): Observable<IEvent> {
        return this._HttpClient.post<IEvent>(`${this.API_URL}`, formData, { withCredentials: true });
    }

    updateEvent(id: number, formData: any): Observable<IEvent> {
        return this._HttpClient.put<IEvent>(`${this.API_URL}/${id}`, formData, { withCredentials: true });
    }

    deleteEvent(id: number): Observable<IEventResponse> {
        return this._HttpClient.delete<IEventResponse>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    rsvp(eventId: number): Observable<IEventResponse> {
        return this._HttpClient.post<IEventResponse>(`${this.API_URL}/${eventId}/rsvp`, {}, { withCredentials: true });
    }

    cancelRsvp(eventId: number): Observable<IEventResponse> {
        return this._HttpClient.delete<IEventResponse>(`${this.API_URL}/${eventId}/rsvp`, { withCredentials: true });
    }

    getMyEvents(): Observable<IEvent[]> {
        return this._HttpClient.get<IEvent[]>(`${this.API_URL}/organizer`, { withCredentials: true });
    }
}

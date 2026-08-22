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
        this._HttpClient.get<IEvent[]>(url).subscribe({
            next: (events: IEvent[]) => this.events.set(events),
        });
    }

    getEventById(id: number): Observable<IEvent> {
        return this._HttpClient.get<IEvent>(`${this.API_URL}/${id}`);
    }

    createEvent(formData: any): Observable<IEvent> {
        return this._HttpClient.post<IEvent>(`${this.API_URL}`, formData);
    }

    updateEvent(id: number, formData: any): Observable<IEvent> {
        return this._HttpClient.put<IEvent>(`${this.API_URL}/${id}`, formData);
    }

    deleteEvent(id: number): Observable<IEventResponse> {
        return this._HttpClient.delete<IEventResponse>(`${this.API_URL}/${id}`)
    }

    rsvp(eventId: number): Observable<IEventResponse> {
        return this._HttpClient.post<IEventResponse>(`${this.API_URL}/${eventId}/rsvp`, {})
    }

    cancelRsvp(eventId: number): Observable<IEventResponse> {
        return this._HttpClient.delete<IEventResponse>(`${this.API_URL}/${eventId}/rsvp`);
    }

    getMyEvents(): Observable<IEvent[]> {
        return this._HttpClient.get<IEvent[]>(`${this.API_URL}/organizer`);
    }
}

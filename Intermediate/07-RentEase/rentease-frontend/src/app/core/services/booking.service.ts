import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export type TBookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';

export interface IBooking {
    id: number;
    startDate: string;
    endDate: string;
    days: number;
    totalPrice: number;
    status: TBookingStatus;

    equipmentId: number;
    equipmentName: string;
    equipmentCategory: string;
    equipmentImageUrl: string | null;

    renterId: string;
    renterName: string;
    ownerId: string;
    ownerName: string;

    createdAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
    rejectionReason: string | null;
}

export interface ICreateBookingResponse {
    message: string;
    bookingId: number;
}

@Service()
export class BookingService {
    private readonly _http = inject(HttpClient);
    private readonly API = 'https://localhost:7108/api/bookings';

    myRentals: WritableSignal<IBooking[]> = signal<IBooking[]>([]);
    incoming: WritableSignal<IBooking[]> = signal<IBooking[]>([]);
    loadingMine: WritableSignal<boolean> = signal(false);
    loadingIncoming: WritableSignal<boolean> = signal(false);

    // ─── READ ────────────────────────────────────────────
    loadMine(): void {
        this.loadingMine.set(true);
        this._http.get<IBooking[]>(`${this.API}/mine`).subscribe({
            next: (list) => { this.myRentals.set(list); this.loadingMine.set(false); },
            error: () => this.loadingMine.set(false),
        });
    }

    loadIncoming(): void {
        this.loadingIncoming.set(true);
        this._http.get<IBooking[]>(`${this.API}/incoming`).subscribe({
            next: (list) => { this.incoming.set(list); this.loadingIncoming.set(false); },
            error: () => this.loadingIncoming.set(false),
        });
    }

    getById(id: number): Observable<IBooking> {
        return this._http.get<IBooking>(`${this.API}/${id}`);
    }

    // ─── CREATE ──────────────────────────────────────────
    create(equipmentId: number, startDate: string, endDate: string): Observable<ICreateBookingResponse> {
        return this._http.post<ICreateBookingResponse>(
            `${this.API}/equipment/${equipmentId}`,
            { startDate, endDate }
        );
    }

    // ─── STATE TRANSITIONS ───────────────────────────────
    confirm(id: number): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(`${this.API}/${id}/confirm`, {});
    }

    reject(id: number, reason?: string): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(`${this.API}/${id}/reject`, { reason });
    }

    cancel(id: number): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(`${this.API}/${id}/cancel`, {});
    }

    // ─── DELETE ──────────────────────────────────────────
    delete(id: number): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(`${this.API}/${id}`);
    }
}
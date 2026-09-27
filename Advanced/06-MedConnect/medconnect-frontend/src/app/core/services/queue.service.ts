import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { IAppointment } from './appointments.service';
import { environment } from '../../environments/environment';

export interface IQueueTicket {
    id: number;
    ticketNumber: number;
    status: string;
    issuedAt: string;
    calledAt: string | null;
    patientId: number;
    patientName: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    appointmentId: number | null;
}

export interface IQueueStatus {
    doctorId: string;
    totalWaiting: number;
    currentTicketNumber: number;
    currentlyServing: IQueueTicket | null;
    waiting: IQueueTicket[];
    todayAll: IQueueTicket[];
    todayAppointments: IAppointment[];
}

export interface IMyQueueStatus {
    hasTicket: boolean;
    ticketNumber?: number;
    status?: string;
    waitingBefore?: number;
    issuedAt?: string;
    calledAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class QueueService {
    private readonly _http = inject(HttpClient);
    private readonly API = `${environment.apiBaseUrl}/queue`;

    private hub: signalR.HubConnection | null = null;

    queue: WritableSignal<IQueueStatus | null> = signal(null);
    myStatus: WritableSignal<IMyQueueStatus | null> = signal(null);
    connected = signal(false);
    loading = signal(false);

    loadQueue(doctorId: string): void {
        this.loading.set(true);
        this._http.get<IQueueStatus>(`${this.API}/doctor/${doctorId}`).subscribe({
            next: (q) => {
                this.queue.set(q);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    loadMyStatus(doctorId: string): void {
        this._http.get<IMyQueueStatus>(`${this.API}/my-status/${doctorId}`).subscribe({
            next: (s) => this.myStatus.set(s),
            error: () => this.myStatus.set({ hasTicket: false }),
        });
    }

    join(doctorId: string, appointmentId?: number): Observable<IQueueTicket> {
        const url = appointmentId
            ? `${this.API}/join/${doctorId}?appointmentId=${appointmentId}`
            : `${this.API}/join/${doctorId}`;
        return this._http
            .post<IQueueTicket>(url, {})
            .pipe(tap(() => this.loadMyStatus(doctorId)));
    }

    callNext(doctorId: string): Observable<unknown> {
        return this._http.post(`${this.API}/call-next/${doctorId}`, {});
    }

    callTicket(ticketId: number): Observable<unknown> {
        return this._http.post(`${this.API}/call/${ticketId}`, {});
    }

    complete(ticketId: number): Observable<unknown> {
        return this._http.post(`${this.API}/complete/${ticketId}`, {});
    }

    async connect(doctorId: string, patientId?: string): Promise<void> {
        if (this.hub?.state === signalR.HubConnectionState.Connected) return;
        if (this.hub) {
            await this.hub.stop();
            this.hub = null;
        }

        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubBaseUrl}/queue`, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        this.hub.on('QueueUpdated', (status: IQueueStatus) => {
            this.queue.set(status);
            if (patientId) this.loadMyStatus(doctorId);
        });

        this.hub.onreconnecting(() => this.connected.set(false));
        this.hub.onreconnected(async () => {
            try {
                await this.hub!.invoke('JoinDoctorQueue', doctorId);
                if (patientId) await this.hub!.invoke('JoinPatientChannel', patientId);
            } catch { }
            this.connected.set(true);
        });
        this.hub.onclose(() => this.connected.set(false));

        try {
            await this.hub.start();
            await this.hub.invoke('JoinDoctorQueue', doctorId);
            if (patientId) await this.hub.invoke('JoinPatientChannel', patientId);
            this.connected.set(true);
        } catch {
            this.connected.set(false);
        }
    }

    async disconnect(doctorId: string): Promise<void> {
        if (!this.hub) return;
        try {
            await this.hub.invoke('LeaveDoctorQueue', doctorId);
        } catch { }
        await this.hub.stop();
        this.hub = null;
        this.connected.set(false);
    }
}
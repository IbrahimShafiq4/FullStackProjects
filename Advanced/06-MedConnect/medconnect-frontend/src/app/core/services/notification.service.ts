import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { NotificationSoundService, TSoundType } from './notification-sound.service';
import { environment } from '../../environments/environment';

export interface INotification {
    id: number;
    type: string;
    title: string;
    body: string;
    link: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly _http = inject(HttpClient);
    private readonly _sound = inject(NotificationSoundService);
    private readonly API = `${environment.apiBaseUrl}/notifications`;

    private hub: signalR.HubConnection | null = null;
    private connecting = false;

    notifications: WritableSignal<INotification[]> = signal([]);
    unreadCount: WritableSignal<number> = signal(0);
    connected = signal(false);
    lastArrived = signal<INotification | null>(null);

    constructor() {
        this.setupAudioUnlock();
    }

    private setupAudioUnlock(): void {
        const unlock = (): void => {
            this._sound.unlock();
            if (this._sound.isUnlocked()) {
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
                document.removeEventListener('touchstart', unlock);
            }
        };
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
        document.addEventListener('touchstart', unlock);
    }

    load(): void {
        this._http.get<INotification[]>(this.API).subscribe({
            next: (list) => {
                this.notifications.set(list);
                this.unreadCount.set(list.filter((n) => !n.isRead).length);
            },
        });
    }

    markRead(id: number): Observable<unknown> {
        return this._http.post(`${this.API}/${id}/read`, {}).pipe(
            tap(() => {
                this.notifications.update((list) =>
                    list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
                );
                this.unreadCount.update((c) => Math.max(0, c - 1));
            }),
        );
    }

    markAllRead(): Observable<unknown> {
        return this._http.post(`${this.API}/read-all`, {}).pipe(
            tap(() => {
                this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
                this.unreadCount.set(0);
            }),
        );
    }

    async connect(userId: string): Promise<void> {
        if (this.hub || this.connecting) return;
        this.connecting = true;

        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubBaseUrl}/notifications`, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        this.hub.on('ReceiveNotification', (n: INotification) => {
            this.notifications.update((list) => [n, ...list]);
            this.unreadCount.update((c) => c + 1);
            this.lastArrived.set(n);
            this._sound.play(this.soundTypeFor(n.type));
        });

        this.hub.onreconnected(async () => {
            try { await this.hub!.invoke('JoinUserChannel', userId); } catch { }
            this.connected.set(true);
        });
        this.hub.onclose(() => this.connected.set(false));

        try {
            await this.hub.start();
            await this.hub.invoke('JoinUserChannel', userId);
            this.connected.set(true);
        } catch {
            this.connected.set(false);
        } finally {
            this.connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.hub) return;
        await this.hub.stop();
        this.hub = null;
        this.connected.set(false);
    }

    private soundTypeFor(type: string): TSoundType {
        switch (type) {
            case 'QueueCalled': return 'urgent';
            case 'QueueNext': return 'info';
            case 'PaymentSuccess': return 'success';
            case 'PaymentFailed': return 'error';
            case 'InvoiceIssued': return 'info';
            case 'RadiologyReady': return 'info';
            case 'TreatmentStage': return 'info';
            case 'AppointmentNew': return 'info';
            case 'AppointmentSoon': return 'urgent';
            default: return 'info';
        }
    }
}
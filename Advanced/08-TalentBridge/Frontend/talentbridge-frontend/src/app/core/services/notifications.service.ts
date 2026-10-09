import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AppNotification {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private http = inject(HttpClient);
    private readonly API = 'https://localhost:7067/api/notifications';

    private _items = signal<AppNotification[]>([]);
    readonly items = this._items.asReadonly();

    private _loading = signal(false);
    readonly loading = this._loading.asReadonly();

    private _error = signal<string | null>(null);
    readonly error = this._error.asReadonly();

    readonly unreadCount = computed(
        () => this._items().filter((n) => !n.isRead).length
    );

    readonly hasUnread = computed(() => this.unreadCount() > 0);

    private pollHandle: ReturnType<typeof setInterval> | null = null;

    async load(silent = false): Promise<void> {
        if (!silent) {
            this._loading.set(true);
            this._error.set(null);
        }
        try {
            const list = await firstValueFrom(
                this.http.get<AppNotification[]>(this.API, { withCredentials: true })
            );
            this._items.set(list);
        } catch {
            if (!silent) this._error.set('تعذّر تحميل الإشعارات.');
        } finally {
            if (!silent) this._loading.set(false);
        }
    }

    async markAsRead(id: number): Promise<void> {
        await firstValueFrom(this.http.patch(`${this.API}/${id}/read`, {}, { withCredentials: true }));
        this._items.update((list) =>
            list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    }

    async markAllAsRead(): Promise<void> {
        const unread = this._items().filter((n) => !n.isRead);
        await Promise.all(
            unread.map((n) =>
                firstValueFrom(this.http.patch(`${this.API}/${n.id}/read`, {}, { withCredentials: true })).catch(() => null)
            )
        );
        this._items.update((list) => list.map((n) => ({ ...n, isRead: true })));
    }

    startPolling(intervalMs = 60_000): void {
        if (this.pollHandle) return;
        this.pollHandle = setInterval(() => this.load(true), intervalMs);
    }

    stopPolling(): void {
        if (this.pollHandle) {
            clearInterval(this.pollHandle);
            this.pollHandle = null;
        }
    }
}
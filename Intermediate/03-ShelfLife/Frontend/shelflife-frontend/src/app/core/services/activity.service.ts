import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';

export interface IActivityItem {
    id: number;
    userName: string;
    userInitial: string;
    action: string;
    city: string;
    createdAt: string;
    timeAgo: string;
}

@Service()
export class ActivityService {
    private _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/activity';

    recent: WritableSignal<IActivityItem[]> = signal<IActivityItem[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);

    loadRecent(take: number = 12): void {
        this.loading.set(true);

        this._http.get<IActivityItem[]>(`${this.API_URL}/recent?take=${take}`).subscribe({
            next: (items) => {
                this.recent.set(items);
                this.loading.set(false);
            },
            error: () => {
                this.recent.set([]);
                this.loading.set(false);
            }
        });
    }

    duplicated(): IActivityItem[] {
        const items = this.recent();
        return items.length > 0 ? [...items, ...items] : [];
    }
}
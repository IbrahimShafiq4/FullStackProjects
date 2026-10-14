import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAuction {
    id: number;
    title: string;
    startingPrice: number;
    currentHighestBid: number;
    endsAt: string;
    status: string;
    sellerName: string;
    coverUrl?: string | null;
    bidCount: number;
}

export interface Paged<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

@Service()
export class AuctionsService {
    private http = inject(HttpClient);
    private readonly API = 'https://localhost:7071/api/auctions';

    auctions = signal<IAuction[]>([]);
    popular = signal<IAuction[]>([]);
    loading = signal(false);

    load(): void {
        this.loading.set(true);
        this.http.get<Paged<IAuction>>(`${this.API}?page=1&pageSize=50`).subscribe({
            next: res => {
                this.auctions.set(res.items ?? []);
                this.loading.set(false);
            },
            error: () => {
                this.auctions.set([]);
                this.loading.set(false);
            }
        });
    }

    loadPopular(): void {
        this.http.get<IAuction[]>(`${this.API}/popular`).subscribe({
            next: data => this.popular.set(data ?? [])
        });
    }

    create(fd: FormData): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(this.API, fd);
    }

    detail(id: number): Observable<any> {
        return this.http.get(`${this.API}/${id}`);
    }

    bids(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/${id}/bids`);
    }

    profile(userId: string): Observable<any> {
        return this.http.get(`${this.API}/user/${userId}`);
    }

    uploadAvatar(file: File): Observable<{ url: string }> {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.post<{ url: string }>(`${this.API}/user/avatar`, fd);
    }

    placeBid(auctionId: number, amount: number): Observable<any> {
        return this.http.post(`${this.API}/${auctionId}/bid`, { amount });
    }
}
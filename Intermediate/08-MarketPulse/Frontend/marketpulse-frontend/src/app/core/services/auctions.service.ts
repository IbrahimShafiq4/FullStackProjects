import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAuction {
    id: number;
    title: string;
    startingPrice: number;
    currentHighestBid: number;
    endsAt: string;
    status: string;
    sellerName: string;
}

@Service()
export class AuctionsService {
    private _HttpClient = inject(HttpClient);
    private readonly API_URL = "https://localhost:7071/api/auctions";

    auctions = signal<IAuction[]>([]);
    popularAuctions = signal<any[]>([]);

    loadAuctions(): void {
        this._HttpClient.get<IAuction[]>(this.API_URL).subscribe({
            next: (data) => this.auctions.set(data)
        });
    }

    loadPopular(): void {
        this._HttpClient.get<any[]>(`${this.API_URL}/popular`).subscribe({
            next: (data) => this.popularAuctions.set(data)
        });
    }

    createAuction(formData: FormData): Observable<any> {
        return this._HttpClient.post(this.API_URL, formData);
    }

    getAuctionDetail(id: number): Observable<any> {
        return this._HttpClient.get(`${this.API_URL}/${id}`);
    }

    getBidHistory(id: number): Observable<any[]> {
        return this._HttpClient.get<any[]>(`${this.API_URL}/${id}/bids`);
    }

    getUserProfile(userId: string): Observable<any> {
        return this._HttpClient.get(`${this.API_URL}/user/${userId}`);
    }

    uploadAvatar(file: File): Observable<any> {
        const fd = new FormData();
        fd.append('file', file);
        return this._HttpClient.post(`${this.API_URL}/user/avatar`, fd);
    }

    placeBid(auctionId: number, amount: number): Observable<any> {
        return this._HttpClient.post(`${this.API_URL}/${auctionId}/bid`, { amount });
    }
}
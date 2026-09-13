import { Service, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface LiveBid { amount: number; bidderName: string; placedAt: string; bidderAvatarUrl: string; }
export interface AuctionClosedData { winnerId: string; winnerName: string; }

@Service()
export class AuctionSignalRService {
    private hubConnection: signalR.HubConnection | null = null;
    latestBid = signal<LiveBid | null>(null);
    auctionClosed = signal<AuctionClosedData | null>(null);

    async connect(auctionId: number) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:7071/hubs/auctions?auctionId=${auctionId}`, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('NewBid', (bid: LiveBid) => this.latestBid.set(bid));
        this.hubConnection.on('AuctionClosed', (data: AuctionClosedData) => this.auctionClosed.set(data));

        await this.hubConnection.start();
    }

    async disconnect() {
        await this.hubConnection?.stop();
    }
}
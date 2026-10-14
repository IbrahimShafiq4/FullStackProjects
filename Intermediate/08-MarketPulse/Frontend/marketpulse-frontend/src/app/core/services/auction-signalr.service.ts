import { Service, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface LiveBid {
    amount: number;
    bidderName: string;
    placedAt: string;
    bidderAvatarUrl?: string | null;
}

export interface AuctionClosedData {
    id: number;
    winnerId: string | null;
    winnerName: string;
}

@Service()
export class AuctionSignalRService {
    private hub: signalR.HubConnection | null = null;

    latestBid = signal<LiveBid | null>(null);
    auctionClosed = signal<AuctionClosedData | null>(null);
    state = signal<'offline' | 'connecting' | 'online' | 'reconnecting'>('offline');

    async connect(auctionId: number) {
        if (this.hub) await this.disconnect();
        this.state.set('connecting');

        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:7071/hubs/auctions?auctionId=${auctionId}`, { withCredentials: true })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.hub.on('NewBid', (bid: LiveBid) => this.latestBid.set(bid));
        this.hub.on('AuctionClosed', (data: AuctionClosedData) => this.auctionClosed.set(data));

        this.hub.onreconnecting(() => this.state.set('reconnecting'));
        this.hub.onreconnected(() => this.state.set('online'));
        this.hub.onclose(() => this.state.set('offline'));

        await this.hub.start();
        this.state.set('online');
    }

    async disconnect() {
        try { await this.hub?.stop(); } catch { }
        this.hub = null;
        this.state.set('offline');
    }
}
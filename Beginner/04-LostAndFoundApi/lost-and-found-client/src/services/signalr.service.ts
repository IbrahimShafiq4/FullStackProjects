import { Injectable, signal } from "@angular/core";
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | null = null;
    connectionState = signal<'disconnected' | 'connected'>('disconnected');

    connect(): void {
        if (this.hubConnection) return;

        this.hubConnection = new signalR.HubConnectionBuilder()
                                        .withUrl('https://localhost:7072/hubs/lostandfound', {
                                            withCredentials: true
                                        })
                                        .withAutomaticReconnect()
                                        .build();

        this.hubConnection.start().then(() => {
            this.connectionState.set('connected');
        });

        this.hubConnection.onreconnected(() => this.connectionState.set('connected'));
        this.hubConnection.onreconnecting(() => this.connectionState.set('disconnected'));
    }

    joinItem(itemId: number): void {
        this.hubConnection?.invoke('JoinItem', itemId);
    }

    leaveItem(itemId: number): void {
        this.hubConnection?.invoke('LeaveItem', itemId);
    }

    onItemUpdated(callback: (data: { status: string }) => void): void {
        this.hubConnection?.on('ItemUpdated', callback);
    }
}
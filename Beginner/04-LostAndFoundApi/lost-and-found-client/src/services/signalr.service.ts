import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | null = null;
    private currentItemId: number | null = null;

    connectionState = signal<'disconnected' | 'connected'>('disconnected');

    async connect(): Promise<void> {
        if (!this.hubConnection) {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:7072/hubs/lostandfound', {
                    withCredentials: true
                })
                .withAutomaticReconnect()
                .build();

            this.hubConnection.onreconnecting(() => {
                this.connectionState.set('disconnected');
            });

            this.hubConnection.onreconnected(async () => {
                this.connectionState.set('connected');

                if (this.currentItemId !== null) {
                    await this.hubConnection?.invoke(
                        'JoinItem',
                        this.currentItemId
                    );
                }
            });

            this.hubConnection.onclose(() => {
                this.connectionState.set('disconnected');
            });
        }

        if (
            this.hubConnection.state ===
            signalR.HubConnectionState.Disconnected
        ) {
            await this.hubConnection.start();
            this.connectionState.set('connected');
        }
    }

    async joinItem(itemId: number): Promise<void> {
        await this.connect();

        this.currentItemId = itemId;

        if (
            this.hubConnection?.state ===
            signalR.HubConnectionState.Connected
        ) {
            await this.hubConnection.invoke(
                'JoinItem',
                itemId
            );
        }
    }

    async leaveItem(itemId: number): Promise<void> {
        if (
            this.hubConnection?.state ===
            signalR.HubConnectionState.Connected
        ) {
            await this.hubConnection.invoke(
                'LeaveItem',
                itemId
            );
        }

        if (this.currentItemId === itemId) {
            this.currentItemId = null;
        }
    }

    onItemUpdated(
        callback: (data: { status: string }) => void
    ): void {
        if (!this.hubConnection) {
            return;
        }

        this.hubConnection.off('ItemUpdated');
        this.hubConnection.on('ItemUpdated', callback);
    }
}
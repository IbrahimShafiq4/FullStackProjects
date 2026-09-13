import { Service, signal, WritableSignal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface ILiveMessage {
    id: number;
    content: string;
    sentAt: string;
    isRead: boolean;
    senderName: string;
    attachmentUrl: string | null;
}

@Service()
export class SignalrService {
    private HubConnection: signalR.HubConnection | null = null;

    incomingMessage: WritableSignal<ILiveMessage | null> = signal<ILiveMessage | null>(null);
    readReceipt: WritableSignal<number | null> = signal<number | null>(null);
    isConnected: WritableSignal<boolean> = signal<boolean>(false);

    async connect(ticketId: number) {
        this.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:7150/hubs/tickets?ticketId=${ticketId}`, {
                withCredentials: true
            })
            .withAutomaticReconnect().build();

        this.HubConnection.on('ReceiveMessage', (message: ILiveMessage) => {
            this.incomingMessage.set(message);
        });

        this.HubConnection.on('MessageRead', (messageId: number) => {
            this.readReceipt.set(messageId);
        });

        try {
            await this.HubConnection.start();
            this.isConnected.set(true);
        } catch {
            this.isConnected.set(false);
        }
    }

    async disconnect() {
        await this.HubConnection?.stop();
        this.isConnected.set(false);
    }
}

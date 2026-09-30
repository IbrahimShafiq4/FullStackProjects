import { Injectable, signal, WritableSignal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface ILiveMessage {
    id: number;
    content: string;
    sentAt: string;
    senderId: string;
    senderName: string;
    attachmentUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class SignalrChatService {
    private hub: signalR.HubConnection | null = null;

    incomingMessage: WritableSignal<ILiveMessage | null> = signal(null);
    roomUsers: WritableSignal<string[]> = signal<string[]>([]);
    typingUser: WritableSignal<string | null> = signal<string | null>(null);

    private typingTimer: ReturnType<typeof setTimeout> | null = null;

    get connection(): signalR.HubConnection | null {
        return this.hub;
    }

    async connect(roomId: number): Promise<void> {
        this.hub = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7128/hubs/rooms', { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        this.hub.on('ReceiveMessage', (message: ILiveMessage) => {
            this.incomingMessage.set(message);
        });

        this.hub.on('RoomUsers', (users: string[]) => {
            this.roomUsers.set(users);
        });

        this.hub.on('UserJoined', (connectionId: string) => {
            this.roomUsers.update((users) =>
                users.includes(connectionId) ? users : [...users, connectionId]
            );
        });

        this.hub.on('UserLeft', (connectionId: string) => {
            this.roomUsers.update((users) => users.filter((id) => id !== connectionId));
        });

        this.hub.on('UserTyping', (connectionId: string) => {
            this.typingUser.set(connectionId);
            if (this.typingTimer) clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => this.typingUser.set(null), 2400);
        });

        await this.hub.start();
        await this.hub.invoke('JoinRoom', roomId.toString());
    }

    async sendTyping(roomId: number): Promise<void> {
        if (!this.hub) return;
        await this.hub.invoke('SendTyping', roomId.toString());
    }

    async disconnect(): Promise<void> {
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
            this.typingTimer = null;
        }
        await this.hub?.stop();
        this.hub = null;
        this.roomUsers.set([]);
        this.incomingMessage.set(null);
        this.typingUser.set(null);
    }
}
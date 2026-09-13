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

@Injectable({
    providedIn: 'root'
})
export class SignalrChatService {
    _HubConnection: signalR.HubConnection | null = null;

    incomingMessage: WritableSignal<ILiveMessage | null> =
        signal<ILiveMessage | null>(null);

    roomUsers: WritableSignal<string[]> =
        signal<string[]>([]);

    async connect(roomId: number): Promise<void> {
        this._HubConnection = new signalR.HubConnectionBuilder()
            .withUrl(
                'https://localhost:7128/hubs/rooms',
                {
                    withCredentials: true
                }
            )
            .withAutomaticReconnect()
            .build();

        this._HubConnection.on(
            'ReceiveMessage',
            (message: ILiveMessage) => {
                this.incomingMessage.set(message);
            }
        );

        this._HubConnection.on(
            'RoomUsers',
            (users: string[]) => {
                this.roomUsers.set(users);
            }
        );

        this._HubConnection.on(
            'UserJoined',
            (connectionId: string) => {
                this.roomUsers.update(users => {
                    if (users.includes(connectionId)) {
                        return users;
                    }

                    return [...users, connectionId];
                });
            }
        );

        this._HubConnection.on(
            'UserLeft',
            (connectionId: string) => {
                this.roomUsers.update(users =>
                    users.filter(id => id !== connectionId)
                );
            }
        );

        await this._HubConnection.start();

        console.log(
            'SignalR connected:',
            this._HubConnection.connectionId
        );

        await this._HubConnection.invoke(
            'JoinRoom',
            roomId.toString()
        );
    }

    async disconnect(): Promise<void> {
        await this._HubConnection?.stop();

        this._HubConnection = null;
        this.roomUsers.set([]);
        this.incomingMessage.set(null);
    }
}
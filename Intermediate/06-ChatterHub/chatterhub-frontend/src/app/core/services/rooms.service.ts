import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IRoom {
    id: number;
    name: string;
    topic: string;
    lastActivityAt: string;
    messageCount: number;
}

export interface IRoomMessage {
    id: number;
    content: string;
    sentAt: string;
    senderId: string;
    senderName: string;
    attachmentUrl: string | null;
}

export interface IRoomDetails {
    id: number;
    name: string;
    topic: string;
    createdAt: string;
    messages: IRoomMessage[];
}

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7128/api/rooms';
    private readonly MESSAGES_URL = 'https://localhost:7128/api/messages';

    rooms: WritableSignal<IRoom[]> = signal<IRoom[]>([]);

    loadRooms(): void {
        this.http.get<IRoom[]>(
            this.API_URL,
            { withCredentials: true }
        ).subscribe({
            next: rooms => this.rooms.set(rooms)
        });
    }

    getRoomDetails(id: number): Observable<IRoomDetails> {
        return this.http.get<IRoomDetails>(
            `${this.API_URL}/${id}`,
            { withCredentials: true }
        );
    }

    createRoom(
        name: string,
        topic: string
    ): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(
            this.API_URL,
            { name, topic },
            { withCredentials: true }
        );
    }

    deleteRoom(
        id: number
    ): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${this.API_URL}/${id}`,
            { withCredentials: true }
        );
    }

    sendMessage(
        roomId: number,
        formData: FormData
    ): Observable<IRoomMessage> {
        return this.http.post<IRoomMessage>(
            `${this.MESSAGES_URL}/room/${roomId}`,
            formData,
            { withCredentials: true }
        );
    }
}
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IRoom {
    id: number;
    name: string;
    topic: string;
    lastActivityAt: string;
    messagesCount: number;
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

const API_URL = 'https://localhost:7128/api/rooms';
const MESSAGES_URL = 'https://localhost:7128/api/messages';

@Injectable({ providedIn: 'root' })
export class RoomsService {
    private readonly http = inject(HttpClient);

    rooms: WritableSignal<IRoom[]> = signal<IRoom[]>([]);
    loading: WritableSignal<boolean> = signal(false);

    loadRooms(): void {
        this.loading.set(true);
        this.http
            .get<IRoom[]>(API_URL, { withCredentials: true })
            .subscribe({
                next: (rooms) => {
                    this.rooms.set(rooms);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false),
            });
    }

    getRoomDetails(id: number): Observable<IRoomDetails> {
        return this.http.get<IRoomDetails>(`${API_URL}/${id}`, { withCredentials: true });
    }

    createRoom(name: string, topic: string): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(API_URL, { name, topic }, { withCredentials: true });
    }

    deleteRoom(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${API_URL}/${id}`, { withCredentials: true });
    }

    sendMessage(roomId: number, formData: FormData): Observable<IRoomMessage> {
        return this.http.post<IRoomMessage>(`${MESSAGES_URL}/room/${roomId}`, formData, {
            withCredentials: true,
        });
    }
}
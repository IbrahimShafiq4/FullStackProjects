import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IBoard {
    id          : number;
    title       : string;
    createdAt   : string;
    cardsCount  : number;
}

export interface IBoardAnalythics {
    totalCards      : number;
    totalConnections: number;
    mostUsedColor   : string;
    lastActivity    : string;
}

@Injectable({ providedIn: 'root' })
export class BoardsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL    : string     = "https://localhost:7167/api/boards";

    boards          : WritableSignal<IBoard[]>                  = signal<IBoard[]>([]);
    currentAnalytics: WritableSignal<IBoardAnalythics | null>   = signal<IBoardAnalythics | null>(null);
    currentBoard    : WritableSignal<any>                       = signal<any>(null); // لإستخدامه في التفاصيل والحذف

    loadBoards(): void {
        this._HttpClient.get<IBoard[]>(this.API_URL).subscribe((boards: IBoard[]) => {
            this.boards.set(boards);
        });
    }

    createBoard(title: string): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(
            this.API_URL,
            JSON.stringify(title),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    getBoard(id: number) {
        return this._HttpClient.get<any>(`${this.API_URL}/${id}`);
    }

    loadAnalytics(id: number) {
        this._HttpClient.get<IBoardAnalythics>(`${this.API_URL}/${id}/analytics`).subscribe({
            next: (board: IBoardAnalythics) => {
                this.currentAnalytics.set(board);
            }
        });
    }

    deleteBoard(id: number) {
        return this._HttpClient.delete(`${this.API_URL}/${id}`);
    }
}
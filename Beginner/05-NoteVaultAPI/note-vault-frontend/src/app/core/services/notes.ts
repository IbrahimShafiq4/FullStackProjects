import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface INote {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

@Service()
export class Notes {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7038/api/notes';

    notes = signal<INote[]>([]);

    loadNotes() {
        this._HttpClient.get<INote[]>(this.API_URL).subscribe({
            next: (data: INote[]) => this.notes.set(data)
        })
    }

    addNote(title: string, content: string): Observable<INote> {
        return this._HttpClient.post<INote>(this.API_URL, {title, content});
    }

    deleteNote(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }
}

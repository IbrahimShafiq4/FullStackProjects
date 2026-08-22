import { Service, signal, inject, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

export type TMediaType = 'Image' | 'Video'; 

export interface IMemory {
    id: number;
    title: string;
    description: string | null;
    mediaUrl: string;
    mediaType: TMediaType;
    memoryDate: string;
}

@Service()
export class Memories {
    private _HttpClient:            HttpClient  = inject(HttpClient);
    private readonly API_URL:       string      = "https://localhost:7183/api/memories"
    private readonly SERVER_ROOT:   string      = "https://localhost:7183"

    memories: WritableSignal<IMemory[]> = signal<IMemory[]>([]);

    loadMemories(): Subscription {
        return this._HttpClient.get<IMemory[]>(this.API_URL).subscribe({
            next: (res: IMemory[]) => this.memories.set(res)
        });
    }

    addMemory(formdata: FormData): Observable<IMemory> {
        return this._HttpClient.post<IMemory>(this.API_URL, formdata);
    }

    deleteMemory(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    getFullMediaUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }
}

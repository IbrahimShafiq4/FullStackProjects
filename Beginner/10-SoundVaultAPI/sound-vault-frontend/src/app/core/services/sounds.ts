import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ISound {
    id: number;
    title: string;
    description?: string;
    mediaUrl: string;
    mediaType: string;
    category: string;
    categoryEmoji: string;
    capturedAt: string;
}

export interface IDelete { message: string; }

@Service()
export class Sounds {
    private _HttpClient:        HttpClient  = inject(HttpClient);
    
    private readonly API_URL:   string      = "https://localhost:7135/api/sounds";
    readonly SERVER_ROOT:       string      = "https://localhost:7135";

    sounds: WritableSignal<ISound[]>        = signal<ISound[]>([]);

    loadSounds(category?: string, search?: string): void {
        let params = new HttpParams();

        if (category) params = params.set('category', category  );
        if (search  ) params = params.set('search', search      );

        this._HttpClient.get<ISound[]>(`${this.API_URL}`, { params }).subscribe({
            next: (res: ISound[]) => this.sounds.set(res),
        })
    }

    getById(id: number): Observable<ISound> {
        return this._HttpClient.get<ISound>(`${this.API_URL}/${id}`);
    }

    create(formData: FormData): Observable<ISound> {
        return this._HttpClient.post<ISound>(`${this.API_URL}`, formData);
    }

    update(id: number, formData: FormData): Observable<ISound> {
        return this._HttpClient.put<ISound>(`${this.API_URL}/${id}`, formData);
    }

    delete(id: number): Observable<IDelete> {
        return this._HttpClient.delete<IDelete>(`${this.API_URL}/${id}`);
    }

    getFullMediaUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}/${relativeUrl}`;
    }
}

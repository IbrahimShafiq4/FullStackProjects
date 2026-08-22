import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ISnippet {
    id: number;
    title: string;
    code: string;
    language: string;
    screenshotUrl: string | null;
    createdAt: string;
}

export interface IDelete { message: string; }

@Service()
export class Snippets {
    private _HttpClient: HttpClient = inject(HttpClient);

    private readonly API_URL: string = 'https://localhost:7189/api/snippets'

    readonly SERVER_ROOT: string = 'https://localhost:7189/';

    snippets: WritableSignal<ISnippet[]> = signal<ISnippet[]>([]);

    loadSnippets(language?: string, search?: string): void {
        let params = new HttpParams();

        if(language ) params = params.set('language', language);
        if(search   ) params = params.set('search', search);

        this._HttpClient.get<ISnippet[]>(this.API_URL, { params }).subscribe({
            next: (res: ISnippet[]) => this.snippets.set(res),
        })
    }

    getById(id: number): Observable<ISnippet> {
        return this._HttpClient.get<ISnippet>(`${this.API_URL}/${id}`);
    }

    create(formData: FormData): Observable<ISnippet> {
        return this._HttpClient.post<ISnippet>(`${this.API_URL}`, formData);
    }

    update(id: number, formData: FormData): Observable<ISnippet> {
        return this._HttpClient.put<ISnippet>(`${this.API_URL}/${id}`, { formData });
    }

    delete(id: number): Observable<IDelete> {
        return this._HttpClient.delete<IDelete>(`${this.API_URL}/${id}`);
    }

    getFullScreenshotUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}${relativeUrl}`
    }
}

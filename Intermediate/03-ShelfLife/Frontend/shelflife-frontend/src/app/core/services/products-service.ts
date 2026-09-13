import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export type TFreshness = 'Fresh' | 'ExpiringSoon' | 'Expired';

export interface IProduct {
    id: number;
    name: string;
    quantity: number;
    expiryDate: string;
    freshness: TFreshness;
    photoUrl: string | null;
    voiceNoteUrl: string | null;
}

export interface IMessage {
    message: string;
}

export interface ICreateProductResponse extends IMessage {
    id: number;
    name: string;
    quantity: number;
    expiryDate: string;
    photoUrl: string | null;
    voiceNoteUrl: string | null;
}

export interface IVoiceNoteUrl {
    voiceNoteUrl: string;
}

@Service()
export class ProductsService {
    private _HttpClient = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/products';
    private readonly SERVER_ROOT = 'https://localhost:7033';
    products: WritableSignal<IProduct[]> = signal<IProduct[]>([]);

    loadProducts(): void {
        this._HttpClient.get<IProduct[]>(this.API_URL, { withCredentials: true }).subscribe({
            next: (products: IProduct[]) => {
                this.products.set(products);
            },
            error: (error) => {
                console.error('Load products error:', error);
            }
        });
    }

    createProduct(formData: FormData): Observable<ICreateProductResponse> {
        return this._HttpClient.post<ICreateProductResponse>(this.API_URL, formData, { withCredentials: true });
    }

    uploadVoiceNote(productId: number, blob: Blob): Observable<IVoiceNoteUrl> {
        const formData = new FormData();
        formData.append('voiceNote', blob, 'voice-note.webm');
        console.log('Uploading voice:', blob);
        return this._HttpClient.post<IVoiceNoteUrl>(`${this.API_URL}/${productId}/voice-note`, formData, { withCredentials: true });
    }

    deleteProduct(id: number): Observable<IMessage> {
        return this._HttpClient.delete<IMessage>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    getFullUrl(relativeUrl: string): string {
        if (!relativeUrl) return '';
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }
}
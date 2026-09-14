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
    thumbnailUrl: string | null;
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
    thumbnailUrl: string | null;
    voiceNoteUrl: string | null;
}

export interface IVoiceNoteUrl {
    voiceNoteUrl: string;
}

@Service()
export class ProductsService {
    private _http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7033/api/products';
    private readonly SERVER_ROOT = 'https://localhost:7033';

    products: WritableSignal<IProduct[]> = signal<IProduct[]>([]);
    selectedProduct: WritableSignal<IProduct | null> = signal<IProduct | null>(null);
    loading: WritableSignal<boolean> = signal<boolean>(false);

    loadProducts(): void {
        this.loading.set(true);

        this._http.get<IProduct[]>(this.API_URL, { withCredentials: true }).subscribe({
            next: (products) => {
                this.products.set(products);
                this.loading.set(false);
            },
            error: () => {
                this.products.set([]);
                this.loading.set(false);
            }
        });
    }

    loadProductById(id: number): void {
        this.loading.set(true);
        this.selectedProduct.set(null);

        this._http.get<IProduct>(`${this.API_URL}/${id}`, { withCredentials: true }).subscribe({
            next: (product) => {
                this.selectedProduct.set(product);
                this.loading.set(false);
            },
            error: () => {
                this.selectedProduct.set(null);
                this.loading.set(false);
            }
        });
    }

    getProductById(id: number): Observable<IProduct> {
        return this._http.get<IProduct>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    createProduct(formData: FormData): Observable<ICreateProductResponse> {
        return this._http.post<ICreateProductResponse>(this.API_URL, formData, { withCredentials: true });
    }

    uploadVoiceNote(productId: number, blob: Blob): Observable<IVoiceNoteUrl> {
        const formData = new FormData();
        formData.append('voiceNote', blob, 'voice-note.webm');
        return this._http.post<IVoiceNoteUrl>(
            `${this.API_URL}/${productId}/voice-note`,
            formData,
            { withCredentials: true }
        );
    }

    deleteProduct(id: number): Observable<IMessage> {
        return this._http.delete<IMessage>(`${this.API_URL}/${id}`, { withCredentials: true });
    }

    getFullUrl(relativeUrl: string | null): string {
        if (!relativeUrl) return '';
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }

    clearSelected(): void {
        this.selectedProduct.set(null);
    }
}
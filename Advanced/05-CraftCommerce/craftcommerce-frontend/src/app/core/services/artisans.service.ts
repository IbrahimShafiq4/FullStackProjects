import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IArtisanProduct {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}

@Service()
export class ArtisansService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/artisans';

    myProducts: WritableSignal<IArtisanProduct[]> = signal<IArtisanProduct[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    loadMyProducts(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<IArtisanProduct[]>(`${this.API_URL}/my-products`).subscribe({
            next: (list) => { this.myProducts.set(list); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    getMyProduct(id: number): Observable<IArtisanProduct> {
        return this._HttpClient.get<IArtisanProduct>(`${this.API_URL}/my-products/${id}`);
    }
}
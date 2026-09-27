import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IProductImage { id: number; url: string; }

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryName: string;
    artisanName: string;
    avgRating: number;
    images: IProductImage[];
}

@Service()
export class ProductsService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/products';
    readonly SERVER_ROOT: string = 'https://localhost:7245';

    products: WritableSignal<IProduct[]> = signal<IProduct[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    loadProducts(categoryId?: number, search?: string): void {
        this.loading.set(true);
        this.error.set(false);

        let params = new HttpParams();
        if (categoryId) params = params.set('categoryId', categoryId.toString());
        if (search) params = params.set('search', search);

        this._HttpClient.get<IProduct[]>(this.API_URL, { params }).subscribe({
            next: (products) => { this.products.set(products); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    getDetails(id: number): Observable<IProduct> {
        return this._HttpClient.get<IProduct>(`${this.API_URL}/${id}`);
    }

    createProduct(formData: FormData): Observable<{ productId: number; message: string }> {
        return this._HttpClient.post<{ productId: number; message: string }>(this.API_URL, formData);
    }

    deleteProduct(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}/${relativeUrl}`;
    }
}
import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal, computed } from '@angular/core';
import { Observable } from 'rxjs';

export interface ICartItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    lineTotal: number;
}

@Service()
export class CartService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/cart';

    items: WritableSignal<ICartItem[]> = signal<ICartItem[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    readonly itemCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
    readonly subtotal = computed(() => this.items().reduce((sum, i) => sum + i.lineTotal, 0));

    loadCart(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<ICartItem[]>(this.API_URL).subscribe({
            next: (cartItems) => { this.items.set(cartItems); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    addToCart(productId: number, quantity: number): Observable<{ message: string }> {
        return this._HttpClient.post<{ message: string }>(this.API_URL, { productId, quantity });
    }

    removeFromCart(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    getTotal(): number {
        return this.subtotal();
    }
}
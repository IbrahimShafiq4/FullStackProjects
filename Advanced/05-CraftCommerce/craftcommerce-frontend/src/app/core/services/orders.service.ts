import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface IOrderSummary {
    id: number;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    createdAt: string;
    items?: IOrderItem[];
}

@Service()
export class OrdersService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/orders';

    orders: WritableSignal<IOrderSummary[]> = signal<IOrderSummary[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    loadMyOrders(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<IOrderSummary[]>(`${this.API_URL}/my`).subscribe({
            next: (orders) => { this.orders.set(orders); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    getOrderDetails(id: number): Observable<IOrderSummary> {
        return this._HttpClient.get<IOrderSummary>(`${this.API_URL}/${id}/details`);
    }

    checkout(addressId: number): Observable<{ orderId: number }> {
        return this._HttpClient.post<{ orderId: number }>(`${this.API_URL}/checkout/${addressId}`, {});
    }
}
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private readonly apiUrl = 'https://localhost:7072/api/items';

    items = signal<Item[]>([]);
    isLoading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    loadItems(search?: string, category?: string, type?: string): void {
        this.isLoading.set(true);

        let url = this.apiUrl;
        const params: string[] = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (type) params.push(`type=${type}`);
        if (params.length) url += `?${params.join('&')}`;

        this.http.get<Item[]>(url, { withCredentials: true }).subscribe({
            next: (data) => {
                this.items.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }
}
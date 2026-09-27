import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ICategory { id: number; name: string; }

@Service()
export class CategoriesService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/categories';

    categories: WritableSignal<ICategory[]> = signal<ICategory[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    loadCategories(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<ICategory[]>(this.API_URL).subscribe({
            next: (list) => { this.categories.set(list); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    createCategory(name: string): Observable<{ id: number }> {
        const fd = new FormData();
        fd.append('name', name);
        return this._HttpClient.post<{ id: number }>(this.API_URL, fd);
    }

    updateCategory(id: number, name: string): Observable<{ message: string; categoryName: string }> {
        const fd = new FormData();
        fd.append('name', name);
        return this._HttpClient.put<{ message: string; categoryName: string }>(`${this.API_URL}/${id}`, fd);
    }

    deleteCategory(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }
}
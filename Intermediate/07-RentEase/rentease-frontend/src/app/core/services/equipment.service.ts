import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IEquipment {
    id: number;
    name: string;
    category: string;
    pricePerDay: number;
    isAvailable: boolean;
    imageUrl: string | null;
    ownerName: string;
}

export interface ICreate {
    name: string;
    category: string;
    pricePerDay: number;
    imageUrl: string;
    ownerId: string;
}

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private _HttpClient = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7108/api/equipment';
    private readonly SERVER_ROOT = 'https://localhost:7108';

    equipmentList: WritableSignal<IEquipment[]> = signal<IEquipment[]>([]);

    loadEquipments(maxPrice?: number, category?: string): void {
        let params = new HttpParams();

        if (maxPrice) {
            params = params.set('maxPrice', maxPrice.toString());
        }

        if (category) {
            params = params.set('category', category);
        }

        this._HttpClient.get<IEquipment[]>(this.API_URL, { params }).subscribe({
            next: (equipment: IEquipment[]) => {
                this.equipmentList.set(equipment);
            },
            error: (err) => {
                console.error('Load Equipments Error:', err);
            }
        });
    }

    getDetails(id: number): Observable<IEquipment> {
        return this._HttpClient.get<IEquipment>(`${this.API_URL}/${id}`);
    }

    createEquipment(formData: FormData): Observable<ICreate> {
        return this._HttpClient.post<ICreate>(this.API_URL, formData);
    }

    deleteEquipment(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}/${relativeUrl}`;
    }
}
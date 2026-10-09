import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
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

export interface ICreateEquipment {
    name: string;
    category: string;
    pricePerDay: number;
    imageUrl: string;
    ownerId: string;
}

export interface IUpdateEquipment {
    name: string;
    category: string;
    pricePerDay: number;
}

@Service()
export class EquipmentService {
    private readonly _http = inject(HttpClient);
    private readonly API = 'https://localhost:7108/api/equipment';
    private readonly ROOT = 'https://localhost:7108';

    equipmentList: WritableSignal<IEquipment[]> = signal<IEquipment[]>([]);
    myEquipment: WritableSignal<IEquipment[]> = signal<IEquipment[]>([]);

    // ─── READ ────────────────────────────────────────────
    loadEquipments(maxPrice?: number, category?: string): void {
        let params = new HttpParams();
        if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
        if (category) params = params.set('category', category);

        this._http.get<IEquipment[]>(this.API, { params }).subscribe({
            next: (list) => this.equipmentList.set(list),
            error: (err) => console.error('Load Equipments Error:', err),
        });
    }

    loadMyEquipment(): void {
        this._http.get<IEquipment[]>(`${this.API}/mine`).subscribe({
            next: (list) => this.myEquipment.set(list),
            error: (err) => console.error('Load My Equipment Error:', err),
        });
    }

    getDetails(id: number): Observable<IEquipment> {
        return this._http.get<IEquipment>(`${this.API}/${id}`);
    }

    // ─── CREATE ──────────────────────────────────────────
    createEquipment(formData: FormData): Observable<ICreateEquipment> {
        return this._http.post<ICreateEquipment>(this.API, formData);
    }

    // ─── UPDATE ──────────────────────────────────────────
    updateEquipment(id: number, dto: IUpdateEquipment): Observable<{ message: string }> {
        return this._http.put<{ message: string }>(`${this.API}/${id}`, dto);
    }

    setAvailability(id: number, isAvailable: boolean): Observable<{ message: string }> {
        return this._http.patch<{ message: string }>(`${this.API}/${id}/availability`, { isAvailable });
    }

    // ─── DELETE ──────────────────────────────────────────
    deleteEquipment(id: number): Observable<{ message: string }> {
        return this._http.delete<{ message: string }>(`${this.API}/${id}`);
    }

    // ─── HELPERS ─────────────────────────────────────────
    getFullUrl(relativeUrl: string): string {
        return `${this.ROOT}/${relativeUrl}`;
    }
}
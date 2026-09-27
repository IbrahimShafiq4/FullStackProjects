import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAddress {
    id: number;
    city: string;
    country: string;
    fullAddress: string;
    zone: string;
}

@Service()
export class AddressesService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly API_URL: string = 'https://localhost:7245/api/addresses';

    addresses: WritableSignal<IAddress[]> = signal<IAddress[]>([]);
    loading: WritableSignal<boolean> = signal<boolean>(false);
    error: WritableSignal<boolean> = signal<boolean>(false);

    loadAddresses(): void {
        this.loading.set(true);
        this.error.set(false);
        this._HttpClient.get<IAddress[]>(this.API_URL).subscribe({
            next: (list) => { this.addresses.set(list); this.loading.set(false); },
            error: () => { this.loading.set(false); this.error.set(true); },
        });
    }

    createAddress(city: string, country: string, fullAddress: string, zone: string): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(this.API_URL, { city, country, fullAddress, zone });
    }

    updateAddress(id: number, dto: IAddress): Observable<{ message: string; addressId: number }> {
        return this._HttpClient.put<{ message: string; addressId: number }>(`${this.API_URL}/${id}`, dto);
    }

    deleteAddress(id: number): Observable<{ message: string }> {
        return this._HttpClient.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }
}
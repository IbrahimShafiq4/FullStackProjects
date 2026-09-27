import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessageResponse, ISaveTeacherWallet, ITeacherWallet } from '../models';
import { environment } from '../../src/environments';

@Service()
export class WalletsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/wallets`;

    public getMyWallets(): Observable<ITeacherWallet[]> {
        return this._HttpClient.get<ITeacherWallet[]>(`${this._ApiUrl}/my`, { withCredentials: true });
    }

    public addWallet(dto: ISaveTeacherWallet): Observable<{ id: number; message: string }> {
        return this._HttpClient.post<{ id: number; message: string }>(`${this._ApiUrl}/my`, dto, { withCredentials: true });
    }

    public updateWallet(id: number, dto: ISaveTeacherWallet): Observable<IMessageResponse> {
        return this._HttpClient.put<IMessageResponse>(`${this._ApiUrl}/my/${id}`, dto, { withCredentials: true });
    }

    public deleteWallet(id: number): Observable<IMessageResponse> {
        return this._HttpClient.delete<IMessageResponse>(`${this._ApiUrl}/my/${id}`, { withCredentials: true });
    }

    public getTeacherWallets(teacherId: string): Observable<ITeacherWallet[]> {
        return this._HttpClient.get<ITeacherWallet[]>(`${this._ApiUrl}/teacher/${teacherId}`, { withCredentials: true });
    }
}
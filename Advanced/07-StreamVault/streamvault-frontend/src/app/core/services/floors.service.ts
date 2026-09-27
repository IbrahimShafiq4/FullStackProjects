import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IFloor, IFloorWithClassrooms } from '../models';
import { environment } from '../../src/environments';

@Service()
export class FloorsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/floors`;

    public getFloors(): Observable<IFloor[]> {
        return this._HttpClient.get<IFloor[]>(this._ApiUrl, { withCredentials: true });
    }

    public getFloor(floorId: number): Observable<IFloorWithClassrooms> {
        return this._HttpClient.get<IFloorWithClassrooms>(`${this._ApiUrl}/${floorId}`, { withCredentials: true });
    }
}
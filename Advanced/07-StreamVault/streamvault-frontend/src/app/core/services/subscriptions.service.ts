import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscriptionStatus } from '../models';
import { environment } from '../../src/environments';

@Service()
export class SubscriptionsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/subscriptions`;

    public getStatus(): Observable<ISubscriptionStatus> {
        return this._HttpClient.get<ISubscriptionStatus>(`${this._ApiUrl}/status`, { withCredentials: true });
    }
}
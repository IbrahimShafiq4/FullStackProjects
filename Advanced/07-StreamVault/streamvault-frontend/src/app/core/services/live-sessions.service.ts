import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateLiveSession, ILiveSession, ILiveSessionDetail, IMessageResponse } from '../models';
import { environment } from '../../src/environments';

@Service()
export class LiveSessionsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/livesessions`;

    public createSession(dto: ICreateLiveSession): Observable<{ id: number; courseId: number }> {
        return this._HttpClient.post<{ id: number; courseId: number }>(this._ApiUrl, dto, { withCredentials: true });
    }

    public getSession(sessionId: number): Observable<ILiveSessionDetail> {
        return this._HttpClient.get<ILiveSessionDetail>(`${this._ApiUrl}/${sessionId}`, { withCredentials: true });
    }

    public endSession(sessionId: number): Observable<IMessageResponse> {
        return this._HttpClient.patch<IMessageResponse>(`${this._ApiUrl}/${sessionId}/end`, {}, { withCredentials: true });
    }

    public getCourseSessions(courseId: number): Observable<ILiveSession[]> {
        return this._HttpClient.get<ILiveSession[]>(`${this._ApiUrl}/course/${courseId}`, { withCredentials: true });
    }
}
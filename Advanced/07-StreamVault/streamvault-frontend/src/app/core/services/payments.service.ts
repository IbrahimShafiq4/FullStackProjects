import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ICanReviewResponse,
    ICheckPurchaseResponse,
    ICheckoutRequest,
    ICheckoutResponse,
    IConfirmResponse,
    IPayment,
    IPaymentDetail,
    ITeacherStatistics
} from '../models';
import { environment } from '../../src/environments';

@Service()
export class PaymentsService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/payments`;

    public checkout(dto: ICheckoutRequest): Observable<ICheckoutResponse> {
        return this._HttpClient.post<ICheckoutResponse>(`${this._ApiUrl}/checkout`, dto, { withCredentials: true });
    }

    public confirm(paymentId: number): Observable<IConfirmResponse> {
        return this._HttpClient.post<IConfirmResponse>(`${this._ApiUrl}/${paymentId}/confirm`, {}, { withCredentials: true });
    }

    public getPayment(paymentId: number): Observable<IPaymentDetail> {
        return this._HttpClient.get<IPaymentDetail>(`${this._ApiUrl}/${paymentId}`, { withCredentials: true });
    }

    public checkCoursePurchase(courseId: number): Observable<ICheckPurchaseResponse> {
        return this._HttpClient.get<ICheckPurchaseResponse>(`${this._ApiUrl}/check/course/${courseId}`, { withCredentials: true });
    }

    public checkStudyFilePurchase(studyFileId: number): Observable<ICheckPurchaseResponse> {
        return this._HttpClient.get<ICheckPurchaseResponse>(`${this._ApiUrl}/check/studyfile/${studyFileId}`, { withCredentials: true });
    }

    public getMyPayments(): Observable<IPayment[]> {
        return this._HttpClient.get<IPayment[]>(`${this._ApiUrl}/my`, { withCredentials: true });
    }

    public getReceivedPayments(): Observable<IPayment[]> {
        return this._HttpClient.get<IPayment[]>(`${this._ApiUrl}/received`, { withCredentials: true });
    }

    public getTeacherStatistics(): Observable<ITeacherStatistics> {
        return this._HttpClient.get<ITeacherStatistics>(`${this._ApiUrl}/statistics`, { withCredentials: true });
    }
}
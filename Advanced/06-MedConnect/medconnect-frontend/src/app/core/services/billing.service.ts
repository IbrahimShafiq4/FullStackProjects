import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IPayment {
  id: number;
  invoiceId: number;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionRef: string;
  notes: string;
  createdAt: string;
  completedAt: string | null;
}

export interface IInvoice {
  id: number;
  appointmentId: number;
  appointmentDate: string;
  doctorName: string;
  patientName: string;
  examinationFee: number;
  consultationFee: number;
  otherFees: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  status: string;
  notes: string;
  issuedAt: string;
  paidAt: string | null;
  payments: IPayment[];
}

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly _http = inject(HttpClient);
  private readonly API = `${environment.apiBaseUrl}`;

  myInvoices: WritableSignal<IInvoice[]> = signal([]);
  loading = signal(false);

  loadMyInvoices(): void {
    this.loading.set(true);
    this._http.get<IInvoice[]>(`${this.API}/invoices/my`).subscribe({
      next: (i) => { this.myInvoices.set(i); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  getInvoice(id: number): Observable<IInvoice> {
    return this._http.get<IInvoice>(`${this.API}/invoices/${id}`);
  }

  createInvoice(dto: {
    appointmentId: number;
    examinationFee: number;
    consultationFee: number;
    otherFees: number;
    discount: number;
    notes?: string;
  }): Observable<{ id: number }> {
    return this._http.post<{ id: number }>(`${this.API}/invoices`, dto);
  }

  pay(dto: { invoiceId: number; amount: number; method: string; transactionRef?: string; notes?: string }): Observable<{ id: number; transactionRef: string; status: string }> {
    return this._http.post<{ id: number; transactionRef: string; status: string }>(`${this.API}/payments/pay`, dto);
  }
}
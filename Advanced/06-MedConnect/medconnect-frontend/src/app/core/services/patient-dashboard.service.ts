import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IInvoice } from './billing.service';
import { IReview } from './reviews.service';
import { IRadiologyUpload } from './radiology.service';
import { IAppointment } from './appointments.service';
import { environment } from '../../environments/environment';

export interface IDoctorVisitSummary {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhotoUrl: string;
  totalVisits: number;
  totalPaid: number;
  lastVisitAt: string;
  myRating: number | null;
  hasReview: boolean;
}

export interface IPatientDashboard {
  totalVisits: number;
  totalPaid: number;
  doctorsVisited: number;
  pendingInvoices: number;
  recentVisits: IDoctorVisitSummary[];
  recentInvoices: IInvoice[];
  myReviews: IReview[];
  recentUploads: IRadiologyUpload[];
  upcomingAppointments: IAppointment[];
}

@Injectable({ providedIn: 'root' })
export class PatientDashboardService {
  private readonly _http = inject(HttpClient);
  private readonly API = `${environment.apiBaseUrl}/patientdashboard`;

  dashboard: WritableSignal<IPatientDashboard | null> = signal(null);
  loading = signal(false);

  load(): void {
    this.loading.set(true);
    this._http.get<IPatientDashboard>(`${this.API}/me`).subscribe({
      next: (d) => { this.dashboard.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
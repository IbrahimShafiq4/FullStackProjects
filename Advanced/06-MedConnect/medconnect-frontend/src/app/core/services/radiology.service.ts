import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IRadiologyRequest {
  id: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  scanType: string;
  bodyPart: string;
  instructions: string;
  status: string;
  requestedAt: string;
  fulfilledAt: string | null;
}

export interface IRadiologyUpload {
  id: number;
  radiologyRequestId: number | null;
  patientId: number;
  patientName: string;
  doctorId: string;
  doctorName: string;
  category: string;
  title: string;
  scanType: string;
  bodyPart: string;
  notes: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  isExternal: boolean;
  uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RadiologyService {
  private readonly _http = inject(HttpClient);
  private readonly API = `${environment.apiBaseUrl}/radiology`;

  patientUploads: WritableSignal<IRadiologyUpload[]> = signal([]);
  patientRequests: WritableSignal<IRadiologyRequest[]> = signal([]);
  loading = signal(false);

  getRequestsByAppointment(appointmentId: number): Observable<IRadiologyRequest[]> {
    return this._http.get<IRadiologyRequest[]>(`${this.API}/requests/appointment/${appointmentId}`);
  }

  loadRequestsByPatient(patientId: number): void {
    this._http.get<IRadiologyRequest[]>(`${this.API}/requests/patient/${patientId}`).subscribe({
      next: (r) => this.patientRequests.set(r),
    });
  }

  createRequest(dto: {
    appointmentId: number;
    scanType: string;
    bodyPart: string;
    instructions: string;
  }): Observable<{ id: number }> {
    return this._http.post<{ id: number }>(`${this.API}/requests`, dto);
  }

  cancelRequest(id: number): Observable<unknown> {
    return this._http.post(`${this.API}/requests/${id}/cancel`, {});
  }

  loadUploadsByPatient(patientId: number): void {
    this.loading.set(true);
    this._http.get<IRadiologyUpload[]>(`${this.API}/uploads/patient/${patientId}`).subscribe({
      next: (u) => {
        this.patientUploads.set(u);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getUploadsByDoctor(doctorId: string): Observable<IRadiologyUpload[]> {
    return this._http.get<IRadiologyUpload[]>(`${this.API}/uploads/doctor/${doctorId}`);
  }

  uploadFile(
    doctorId: string,
    radiologyRequestId: number | null,
    category: string,
    title: string,
    scanType: string,
    bodyPart: string,
    notes: string,
    isExternal: boolean,
    file: File,
  ): Observable<{ id: number; fileUrl: string }> {
    const fd = new FormData();
    fd.append('doctorId', doctorId);
    if (radiologyRequestId) fd.append('radiologyRequestId', String(radiologyRequestId));
    fd.append('category', category);
    fd.append('title', title);
    fd.append('scanType', scanType);
    fd.append('bodyPart', bodyPart);
    fd.append('notes', notes);
    fd.append('isExternal', String(isExternal));
    fd.append('file', file);
    return this._http.post<{ id: number; fileUrl: string }>(`${this.API}/uploads`, fd);
  }

  resolveUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.serverOrigin}${path}`;
  }
}
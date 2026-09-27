import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ITreatmentStage {
    id: number;
    order: number;
    title: string;
    description: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    notes: string;
}

export interface IMedicalRecord {
    id: number;
    appointmentId: number;
    scheduledAt: string;
    patientName: string;
    doctorName: string;
    chiefComplaint: string;
    diagnosis: string;
    examinationNotes: string;
    treatmentPlan: string;
    followUpNotes: string;
    vitals: Record<string, string>;
    stages: ITreatmentStage[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreateMedicalRecord {
    appointmentId: number;
    chiefComplaint: string;
    diagnosis: string;
    examinationNotes: string;
    treatmentPlan: string;
    followUpNotes: string;
    vitals?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
    private readonly _http = inject(HttpClient);
    private readonly API = `${environment.apiBaseUrl}/medicalrecords`;

    patientRecords: WritableSignal<IMedicalRecord[]> = signal([]);
    currentRecord: WritableSignal<IMedicalRecord | null> = signal(null);
    loading = signal(false);

    getByAppointment(appointmentId: number): Observable<IMedicalRecord> {
        return this._http.get<IMedicalRecord>(`${this.API}/appointment/${appointmentId}`);
    }

    loadByPatient(patientId: number): void {
        this.loading.set(true);
        this._http.get<IMedicalRecord[]>(`${this.API}/patient/${patientId}`).subscribe({
            next: (r) => { this.patientRecords.set(r); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    create(dto: ICreateMedicalRecord): Observable<{ id: number }> {
        return this._http.post<{ id: number }>(this.API, dto);
    }

    update(id: number, dto: Partial<ICreateMedicalRecord>): Observable<unknown> {
        return this._http.put(`${this.API}/${id}`, dto);
    }

    addStage(recordId: number, dto: { title: string; description: string; startDate?: string | null; endDate?: string | null; notes: string }): Observable<{ id: number }> {
        return this._http.post<{ id: number }>(`${this.API}/${recordId}/stages`, dto);
    }

    updateStage(stageId: number, dto: { title?: string; description?: string; status?: string; startDate?: string | null; endDate?: string | null; notes?: string }): Observable<unknown> {
        return this._http.put(`${this.API}/stages/${stageId}`, dto);
    }

    deleteStage(stageId: number): Observable<unknown> {
        return this._http.delete(`${this.API}/stages/${stageId}`);
    }
}
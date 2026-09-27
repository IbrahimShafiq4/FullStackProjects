import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IDoctor {
    id: string;
    fullName: string;
    specialty: string;
}

export interface IAppointment {
    id: number;
    scheduledAt: string;
    status: string;
    doctorId: string;
    doctorName: string;
    patientName: string;
    patientComplaint: string;
}

export interface IAvailabilitySlot {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface IBookedSlot {
    id: number;
    scheduledAt: string;
}

export interface IPrescriptionMedication {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    notes: string;
}

export interface IPendingUpload {
    file: File;
    category: string;
    title: string;
    notes: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
    private readonly _http = inject(HttpClient);
    private readonly API = environment.apiBaseUrl;

    doctors: WritableSignal<IDoctor[]> = signal<IDoctor[]>([]);
    appointments: WritableSignal<IAppointment[]> = signal<IAppointment[]>([]);
    doctorSlots: WritableSignal<IAvailabilitySlot[]> = signal<IAvailabilitySlot[]>([]);
    mySlots: WritableSignal<IAvailabilitySlot[]> = signal<IAvailabilitySlot[]>([]);
    bookedSlots: WritableSignal<IBookedSlot[]> = signal<IBookedSlot[]>([]);
    loadingDoctors = signal(false);
    loadingAppointments = signal(false);
    loadingSlots = signal(false);
    loadingMySlots = signal(false);
    loadingBooked = signal(false);

    loadDoctors(specialty?: string): void {
        const url = specialty
            ? `${this.API}/doctors?specialty=${encodeURIComponent(specialty)}`
            : `${this.API}/doctors`;
        this.loadingDoctors.set(true);
        this._http.get<IDoctor[]>(url).subscribe({
            next: (d) => {
                this.doctors.set(d);
                this.loadingDoctors.set(false);
            },
            error: () => this.loadingDoctors.set(false),
        });
    }

    loadMyAppointments(): void {
        this.loadingAppointments.set(true);
        this._http.get<IAppointment[]>(`${this.API}/appointments/my`).subscribe({
            next: (a) => {
                this.appointments.set(a);
                this.loadingAppointments.set(false);
            },
            error: () => this.loadingAppointments.set(false),
        });
    }

    loadDoctorSlots(doctorId: string): void {
        this.loadingSlots.set(true);
        this._http.get<IAvailabilitySlot[]>(`${this.API}/availability/doctor/${doctorId}`).subscribe({
            next: (slots) => {
                this.doctorSlots.set(slots);
                this.loadingSlots.set(false);
            },
            error: () => {
                this.doctorSlots.set([]);
                this.loadingSlots.set(false);
            },
        });
    }

    loadBookedSlots(doctorId: string): void {
        this.loadingBooked.set(true);
        this._http.get<IBookedSlot[]>(`${this.API}/appointments/doctor/${doctorId}`).subscribe({
            next: (slots) => {
                this.bookedSlots.set(slots);
                this.loadingBooked.set(false);
            },
            error: () => {
                this.bookedSlots.set([]);
                this.loadingBooked.set(false);
            },
        });
    }

    clearDoctorSlots(): void {
        this.doctorSlots.set([]);
        this.bookedSlots.set([]);
    }

    loadMySlots(doctorId: string): void {
        this.loadingMySlots.set(true);
        this._http.get<IAvailabilitySlot[]>(`${this.API}/availability/doctor/${doctorId}`).subscribe({
            next: (slots) => {
                this.mySlots.set(slots);
                this.loadingMySlots.set(false);
            },
            error: () => {
                this.mySlots.set([]);
                this.loadingMySlots.set(false);
            },
        });
    }

    bookAppointment(
        doctorId: string,
        scheduledAt: string,
        patientComplaint: string = '',
        paymentMethod: string | null = null,
        payOnline: boolean = false,
    ): Observable<{
        id: number;
        invoiceId: number;
        invoiceStatus: string;
        total: number;
        currency: string;
    }> {
        return this._http.post<{
            id: number;
            invoiceId: number;
            invoiceStatus: string;
            total: number;
            currency: string;
        }>(`${this.API}/appointments`, {
            doctorId,
            scheduledAt,
            patientComplaint,
            paymentMethod,
            payOnline,
        });
    }

    issuePrescription(
        appointmentId: number,
        medications: IPrescriptionMedication[],
        notes: string,
    ): Observable<{ pdfUrl: string }> {
        return this._http.post<{ pdfUrl: string }>(
            `${this.API}/prescriptions/appointment/${appointmentId}`,
            { medications, notes },
        );
    }

    addSlot(dayOfWeek: number, startTime: string, endTime: string): Observable<{ id: number }> {
        return this._http.post<{ id: number }>(`${this.API}/availability`, { dayOfWeek, startTime, endTime });
    }
}
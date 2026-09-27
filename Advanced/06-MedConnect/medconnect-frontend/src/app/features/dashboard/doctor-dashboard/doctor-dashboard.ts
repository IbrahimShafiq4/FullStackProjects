import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../core/services/analytics.service';
import {
  AppointmentsService,
  IAppointment,
  IPrescriptionMedication,
} from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PopupService } from '../../../shared/services/popup.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  readonly _analytics = inject(AnalyticsService);
  readonly _appointments = inject(AppointmentsService);
  readonly _auth = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _popup = inject(PopupService);
  private readonly _router = inject(Router);

  readonly dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  readonly dayShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  editingId = signal<number | null>(null);
  notes = signal('');
  medications = signal<IPrescriptionMedication[]>([this.emptyMedication()]);

  newDay = signal<number>(1);
  newStart = signal('09:00');
  newEnd = signal('12:00');
  addingSlot = signal(false);

  readonly upcoming = computed(() =>
    this._appointments.appointments().filter((a) => a.status === 'Booked'),
  );

  readonly completed = computed(() =>
    this._appointments.appointments().filter((a) => a.status === 'Completed'),
  );

  readonly completeRate = computed(() => {
    const d = this._analytics.dashboard();
    if (!d) return 0;
    return Math.round(d.completeRate);
  });

  readonly slotsByDay = computed(() => {
    const slots = this._appointments.mySlots();
    return this.dayNames
      .map((name, dow) => ({
        dow,
        name,
        short: this.dayShort[dow],
        slots: slots
          .filter((s) => s.dayOfWeek === dow)
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }))
      .filter((g) => g.slots.length > 0);
  });

  readonly hasSlots = computed(() => this._appointments.mySlots().length > 0);

  ngOnInit(): void {
    this._analytics.loadDoctorDashboard();
    this._appointments.loadMyAppointments();
    const user = this._auth.currentUser();
    if (user) this._appointments.loadMySlots(user.id);
  }

  private emptyMedication(): IPrescriptionMedication {
    return { name: '', dose: '', frequency: '', duration: '', notes: '' };
  }

  addMedication(): void {
    this.medications.update((m) => [...m, this.emptyMedication()]);
  }

  removeMedication(index: number): void {
    this.medications.update((m) => {
      if (m.length <= 1) return m;
      return m.filter((_, i) => i !== index);
    });
  }

  updateMedication(index: number, field: keyof IPrescriptionMedication, value: string): void {
    this.medications.update((list) =>
      list.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.notes.set('');
    this.medications.set([this.emptyMedication()]);
  }

  onAddSlot(): void {
    const start = this.newStart();
    const end = this.newEnd();
    if (!start || !end) {
      this._toast.show('حدد وقت البداية والنهاية', 'error');
      return;
    }
    if (start >= end) {
      this._toast.show('وقت النهاية يجب أن يكون بعد البداية', 'error');
      return;
    }

    this.addingSlot.set(true);
    this._appointments.addSlot(this.newDay(), `${start}:00`, `${end}:00`).subscribe({
      next: () => {
        this._toast.show('تمت إضافة الفترة بنجاح', 'success');
        const user = this._auth.currentUser();
        if (user) this._appointments.loadMySlots(user.id);
        this.addingSlot.set(false);
      },
      error: () => {
        this._toast.show('تعذر إضافة الفترة', 'error');
        this.addingSlot.set(false);
      },
    });
  }

  formatTime(t: string): string {
    const parts = t.split(':');
    const h = Number(parts[0] ?? 0);
    const m = Number(parts[1] ?? 0);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}`;
  }

  parseHours(t: string): number {
    const parts = t.split(':');
    const h = Number(parts[0] ?? 0);
    const m = Number(parts[1] ?? 0);
    return h + m / 60;
  }

  slotDuration(start: string, end: string): number {
    return this.parseHours(end) - this.parseHours(start);
  }

  openVideo(a: IAppointment): void {
    this._router.navigate(['/call', a.id]);
  }

  openQueue(): void {
    const user = this._auth.currentUser();
    if (user) this._router.navigate(['/queue', user.id]);
  }

  startPrescription(a: IAppointment): void {
    this.editingId.set(a.id);
    this.notes.set('');
    this.medications.set([this.emptyMedication()]);
  }

  cancelPrescription(): void {
    this.resetForm();
  }

  private validMedications(): IPrescriptionMedication[] {
    return this.medications()
      .filter((m) => m.name.trim() !== '')
      .map((m) => ({
        name: m.name.trim(),
        dose: m.dose.trim(),
        frequency: m.frequency.trim(),
        duration: m.duration.trim(),
        notes: m.notes.trim(),
      }));
  }

  async confirmPrescription(a: IAppointment): Promise<void> {
    const meds = this.validMedications();
    if (meds.length === 0) {
      this._toast.show('أضف دواءً واحداً على الأقل', 'error');
      return;
    }

    const ok = await this._popup.confirm({
      title: 'إصدار روشتة',
      message: `سيتم إنشاء روشتة PDF بـ ${meds.length} دواء للمريض ${a.patientName} وإنهاء الموعد.`,
      type: 'confirm',
      confirmLabel: 'إصدار',
    });
    if (!ok) return;

    this._appointments.issuePrescription(a.id, meds, this.notes()).subscribe({
      next: (res) => {
        this._toast.show('تم إصدار الروشتة بنجاح', 'success');
        this._appointments.loadMyAppointments();
        this._analytics.loadDoctorDashboard();
        this.resetForm();
        window.open(`${environment.serverOrigin}${res.pdfUrl}`, '_blank');
      },
      error: () => this._toast.show('تعذر إصدار الروشتة', 'error'),
    });
  }
}
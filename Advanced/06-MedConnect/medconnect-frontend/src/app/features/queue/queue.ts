import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from '../../core/services/queue.service';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.html',
  styleUrl: './queue.css',
})
export class QueuePage implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  readonly _queue = inject(QueueService);
  readonly _auth = inject(AuthService);
  private readonly _appointments = inject(AppointmentsService);
  private readonly _toast = inject(ToastService);

  doctorId = '';
  private autoJoinAttempted = false;

  readonly isDoctor = computed(() => this._auth.currentUser()?.role === 'Doctor');
  readonly isPatient = computed(() => this._auth.currentUser()?.role === 'Patient');

  readonly todayAppointments = computed(() => this._queue.queue()?.todayAppointments ?? []);

  readonly todayWaiting = computed(() =>
    this._queue.queue()?.todayAll?.filter((t) => t.status === 'Waiting') ?? [],
  );

  readonly todayCalled = computed(() =>
    this._queue.queue()?.todayAll?.filter((t) => t.status === 'Called') ?? [],
  );

  readonly todayDone = computed(() =>
    this._queue.queue()?.todayAll?.filter(
      (t) => t.status === 'Completed' || t.status === 'Skipped' || t.status === 'Cancelled',
    ) ?? [],
  );

  readonly waitingBeforeCount = computed(() => this._queue.myStatus()?.waitingBefore ?? 0);

  constructor() {
    effect(() => {
      if (!this.isPatient() || this.autoJoinAttempted) return;

      const status = this._queue.myStatus();
      const apts = this._appointments.appointments();

      if (status === null) return;

      if (status.hasTicket) {
        this.autoJoinAttempted = true;
        return;
      }

      const hasBooked = apts.some(
        (a) => a.doctorId === this.doctorId && a.status === 'Booked',
      );
      if (!hasBooked) return;

      this.autoJoinAttempted = true;
      this._queue.join(this.doctorId).subscribe({
        next: (t) => {
          this._toast.show(`تم تسجيلك في الدور — رقمك ${t.ticketNumber}`, 'success');
        },
        error: () => {},
      });
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('doctorId');
    if (!id) return;
    this.doctorId = id;

    this._queue.loadQueue(id);
    this._queue.connect(id, this._auth.currentUser()?.id);

    if (this.isPatient()) {
      this._queue.loadMyStatus(id);
      this._appointments.loadMyAppointments();
    }
  }

  ngOnDestroy(): void {
    this._queue.disconnect(this.doctorId);
  }

  onCallNext(): void {
    this._queue.callNext(this.doctorId).subscribe({
      next: () => this._toast.show('تم استدعاء المريض التالي', 'success'),
      error: () => this._toast.show('تعذر الاستدعاء', 'error'),
    });
  }

  onCall(ticketId: number): void {
    this._queue.callTicket(ticketId).subscribe({
      next: () => this._toast.show('تم الاستدعاء', 'success'),
      error: () => this._toast.show('تعذر الاستدعاء', 'error'),
    });
  }

  onComplete(ticketId: number): void {
    this._queue.complete(ticketId).subscribe({
      next: () => this._toast.show('تم إنهاء الجلسة', 'success'),
      error: () => this._toast.show('تعذر الإنهاء', 'error'),
    });
  }

  onJoinQueue(): void {
    this._queue.join(this.doctorId).subscribe({
      next: (t) => this._toast.show(`تم الانضمام — رقمك ${t.ticketNumber}`, 'success'),
      error: () => this._toast.show('تعذر الانضمام للدور', 'error'),
    });
  }

  onAddAppointmentToQueue(appointmentId: number): void {
    this._queue.join(this.doctorId, appointmentId).subscribe({
      next: (t) => this._toast.show(`تم إضافة المريض للدور — رقم ${t.ticketNumber}`, 'success'),
      error: () => this._toast.show('تعذر الإضافة', 'error'),
    });
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Waiting':    return 'في الانتظار';
      case 'Called':     return 'يستقبل الآن';
      case 'InProgress': return 'جاري';
      case 'Completed':  return 'مكتمل';
      case 'Skipped':    return 'تخطي';
      case 'Cancelled':  return 'ملغي';
      default:           return s;
    }
  }

  statusColor(s: string): string {
    switch (s) {
      case 'Waiting':    return 'orange';
      case 'Called':     return 'green';
      case 'Completed':  return 'blue';
      case 'Cancelled':  return 'red';
      default:           return 'blue';
    }
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  estimatedMinutes(count: number): number {
    return Math.max(0, count) * 15;
  }
}
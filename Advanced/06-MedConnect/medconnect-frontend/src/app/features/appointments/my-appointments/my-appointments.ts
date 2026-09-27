import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentsService, IAppointment } from '../../../core/services/appointments.service';

@Component({
  selector: 'app-my-appointments',
  imports: [RouterLink, DatePipe],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit {
  readonly _appointments = inject(AppointmentsService);
  private readonly _router = inject(Router);

  readonly upcoming = computed(() =>
    this._appointments.appointments()
      .filter((a) => a.status === 'Booked')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
  );

  readonly past = computed(() =>
    this._appointments.appointments()
      .filter((a) => a.status !== 'Booked')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
  );

  readonly totalCount = computed(() => this._appointments.appointments().length);

  ngOnInit(): void {
    this._appointments.loadMyAppointments();
  }

  isLive(a: IAppointment): boolean {
    const t = new Date(a.scheduledAt).getTime();
    const now = Date.now();
    const diff = t - now;
    return diff <= 5 * 60 * 1000 && diff >= -60 * 60 * 1000;
  }

  isFuture(a: IAppointment): boolean {
    return new Date(a.scheduledAt).getTime() > Date.now() + 5 * 60 * 1000;
  }

  join(a: IAppointment): void {
    this._router.navigate(['/call', a.id]);
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Booked': return 'محجوز';
      case 'Completed': return 'مكتمل';
      case 'Cancelled': return 'ملغي';
      default: return s;
    }
  }

  statusColor(s: string): string {
    switch (s) {
      case 'Booked': return 'orange';
      case 'Completed': return 'green';
      case 'Cancelled': return 'red';
      default: return 'blue';
    }
  }
}
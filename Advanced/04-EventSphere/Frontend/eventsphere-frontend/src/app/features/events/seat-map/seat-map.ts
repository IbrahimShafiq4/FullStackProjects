import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { animate } from 'motion';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';

interface ISeat {
  id: number;
  row: number;
  number: number;
  status: string;
  calculatedPrice: number;
}

@Component({
  selector: 'app-seat-map',
  imports: [RouterLink],
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.css',
})
export class SeatMap implements OnInit {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  private readonly API = 'https://localhost:7133/api';

  readonly year = new Date().getFullYear();

  seats = signal<ISeat[]>([]);
  selectedSeatId = signal<number | null>(null);
  eventId!: number;

  ngOnInit(): void {
    this.eventId = Number(this._route.snapshot.paramMap.get('id'));
    this.loadSeats();
  }

  loadSeats(): void {
    this._http
      .get<ISeat[]>(`${this.API}/seats/event/${this.eventId}`, { withCredentials: true })
      .subscribe({
        next: (data) => this.seats.set(data),
        error: () => this._toast.show('تعذّر تحميل المقاعد.', 'error'),
      });
  }

  onSeatClick(seat: ISeat, event: MouseEvent): void {
    if (seat.status !== 'Available') {
      this._toast.show('هذا المقعد غير متاح.', 'error');
      return;
    }

    const target = event.currentTarget as HTMLElement;
    animate(target, { scale: [1, 1.12, 1.05] }, { type: 'spring', stiffness: 320, damping: 18 });

    this.selectedSeatId.set(seat.id);

    this._http
      .post(`${this.API}/seats/${seat.id}/lock`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this._toast.show(`تم حجز المقعد ${seat.row}-${seat.number} لمدة دقيقتين.`, 'success');
          this.loadSeats();
        },
        error: () => {
          this.selectedSeatId.set(null);
          animate(target, { x: [-6, 6, -4, 0] }, { duration: 0.35 });
          this._toast.show('حد سبقك لهذا المقعد.', 'error');
          this.loadSeats();
        },
      });
  }

  async onConfirm(): Promise<void> {
    const seatId = this.selectedSeatId();
    if (!seatId) return;

    const confirmed = await this._popup.confirm({
      title: 'تأكيد الحجز',
      message: 'هل تريد تأكيد هذا الحجز؟',
      confirmLabel: 'تأكيد',
      cancelLabel: 'إلغاء',
    });
    if (!confirmed) return;

    this._http
      .post(`${this.API}/bookings/confirm/${seatId}`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this._toast.show('تم تأكيد الحجز.', 'success');
          this.selectedSeatId.set(null);
          this.loadSeats();
        },
        error: () => this._toast.show('تعذّر تأكيد الحجز.', 'error'),
      });
  }

  getRows(): number[] {
    return [...new Set(this.seats().map((s) => s.row))].sort((a, b) => a - b);
  }

  getSeatsInRow(row: number): ISeat[] {
    return this.seats().filter((s) => s.row === row).sort((a, b) => a.number - b.number);
  }

  availableCount(): number {
    return this.seats().filter((s) => s.status === 'Available').length;
  }

  bookedCount(): number {
    return this.seats().filter((s) => s.status === 'Booked').length;
  }
}
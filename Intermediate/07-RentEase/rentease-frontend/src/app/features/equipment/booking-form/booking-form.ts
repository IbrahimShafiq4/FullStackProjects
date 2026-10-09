import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-booking-form',
  templateUrl: './booking-form.html',
})
export class BookingForm {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _ToastService = inject(ToastService);

  equipmentId: InputSignal<number> = input.required<number>();
  pricePerDay: InputSignal<number> = input.required<number>();

  startDate: WritableSignal<string> = signal('');
  endDate: WritableSignal<string> = signal('');
  isSubmitting: WritableSignal<boolean> = signal(false);

  protected readonly today = this.localToday();

  protected durationDays = computed(() => {
    const s = this.startDate();
    const e = this.endDate();
    if (!s || !e) return 0;
    const days = (new Date(e).getTime() - new Date(s).getTime()) / 86_400_000;
    return days > 0 ? Math.ceil(days) : 0;
  });

  protected totalPrice = computed(() => this.durationDays() * this.pricePerDay());

  onSubmit(): void {
    if (!this.startDate() || !this.endDate()) {
      this._ToastService.show('Select a start and end date.', 'error');
      return;
    }
    if (this.durationDays() <= 0) {
      this._ToastService.show('End date must be after the start date.', 'error');
      return;
    }

    this.isSubmitting.set(true);
    this._HttpClient.post(
      `https://localhost:7108/api/bookings/equipment/${this.equipmentId()}`,
      { startDate: this.startDate(), endDate: this.endDate() }
    ).subscribe({
      next: () => {
        this._ToastService.show('Booking confirmed. Your rental period is reserved.', 'success');
        this.isSubmitting.set(false);
        this.startDate.set('');
        this.endDate.set('');
      },
      error: (err: HttpErrorResponse) => {
        this._ToastService.show(
          typeof err.error === 'string' ? err.error : 'This asset is unavailable for that period.',
          'error'
        );
        this.isSubmitting.set(false);
      },
    });
  }

  private localToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  protected progressWidth(): number {
    return this.durationDays() > 0
      ? Math.min(this.durationDays() * 8, 100)
      : 0;
  }
}
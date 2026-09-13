import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-booking-form',
  templateUrl: './booking-form.html',
})
export class BookingForm {
  private _HttpClient: HttpClient = inject(HttpClient);
  private _ToastService: ToastService = inject(ToastService);

  equipmentId: InputSignal<number> = input.required<number>();
  startDate: WritableSignal<string> = signal<string>('');
  endDate: WritableSignal<string> = signal<string>('');
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onSubmit(): void {
    if (!this.startDate() || !this.endDate()) { this._ToastService.show('اختر تاريخ البدارية والنهاية', 'error'); return; }

    this._HttpClient.post(`https://localhost:7108/api/bookings/equipment/${this.equipmentId()}`,
      { startDate: this.startDate(), endDate: this.endDate() })
      .subscribe({
        next: (booking) => {
          this._ToastService.show('تم إرسال طلب الحجز بنجاح', 'success');
          this.isSubmitting.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this._ToastService.show(error.error ?? 'فشل الحجز', 'error');
          this.isSubmitting.set(false);
        }
      })
  }
}
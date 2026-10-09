import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService, IBooking } from '../../core/services/booking.service';
import { EquipmentService } from '../../core/services/equipment.service';
import { PopupService } from '../../shared/services/popup.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../shared/components/equipment-illustration/equipment-illustration';

type TFilter = 'pending' | 'confirmed' | 'closed' | 'all';

@Component({
  selector: 'app-requests',
  imports: [RouterLink, EquipmentIllustration],
  templateUrl: './requests.html',
})
export class Requests implements OnInit {
  protected readonly bookings = inject(BookingService);
  protected readonly equipment = inject(EquipmentService);
  private readonly _popup = inject(PopupService);
  private readonly _toast = inject(ToastService);

  protected readonly illustrationFor = illustrationFor;
  protected readonly filter: WritableSignal<TFilter> = signal('pending');
  protected readonly busyId: WritableSignal<number | null> = signal(null);

  protected readonly filtered = computed(() => {
    const list = this.bookings.incoming();
    const f = this.filter();
    if (f === 'all') return list;
    if (f === 'pending') return list.filter(b => b.status === 'Pending');
    if (f === 'confirmed') return list.filter(b => b.status === 'Confirmed');
    return list.filter(b => b.status === 'Rejected' || b.status === 'Cancelled' || b.status === 'Completed');
  });

  protected readonly counts = computed(() => {
    const list = this.bookings.incoming();
    return {
      pending: list.filter(b => b.status === 'Pending').length,
      confirmed: list.filter(b => b.status === 'Confirmed').length,
      closed: list.filter(b => b.status === 'Rejected' || b.status === 'Cancelled' || b.status === 'Completed').length,
      all: list.length,
    };
  });

  ngOnInit(): void {
    this.bookings.loadIncoming();
  }

  protected setFilter(f: TFilter): void { this.filter.set(f); }

  protected getImageUrl(url: string | null): string | null {
    return url ? this.equipment.getFullUrl(url) : null;
  }

  protected formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }

  protected onConfirm(b: IBooking): void {
    this.busyId.set(b.id);
    this.bookings.confirm(b.id).subscribe({
      next: () => {
        this._toast.show('Booking confirmed.', 'success');
        this.bookings.loadIncoming();
        this.busyId.set(null);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to confirm.', 'error');
        this.busyId.set(null);
      },
    });
  }

  protected async onReject(b: IBooking): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'REJECT BOOKING',
      message: `Reject the request from ${b.renterName}?`,
      type: 'danger',
      confirmLabel: 'Reject',
      cancelLabel: 'Keep it',
    });
    if (!confirmed) return;

    this.busyId.set(b.id);
    this.bookings.reject(b.id, 'Rejected by owner').subscribe({
      next: () => {
        this._toast.show('Booking rejected.', 'success');
        this.bookings.loadIncoming();
        this.busyId.set(null);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to reject.', 'error');
        this.busyId.set(null);
      },
    });
  }

  protected statusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-available';
      case 'Pending': return 'status-booked';
      case 'Completed': return 'status-available';
      default: return 'status-unavailable';
    }
  }
}
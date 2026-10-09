import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService, IBooking, TBookingStatus } from '../../core/services/booking.service';
import { EquipmentService } from '../../core/services/equipment.service';
import { PopupService } from '../../shared/services/popup.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../shared/components/equipment-illustration/equipment-illustration';

type TFilter = 'all' | 'active' | 'pending' | 'completed' | 'closed';

@Component({
  selector: 'app-my-rentals',
  imports: [RouterLink, EquipmentIllustration],
  templateUrl: './my-rentals.html',
})
export class MyRentals implements OnInit {
  protected readonly bookings = inject(BookingService);
  protected readonly equipment = inject(EquipmentService);
  private readonly _popup = inject(PopupService);
  private readonly _toast = inject(ToastService);

  protected readonly illustrationFor = illustrationFor;
  protected readonly filter: WritableSignal<TFilter> = signal('all');
  protected readonly busyId: WritableSignal<number | null> = signal(null);

  protected readonly filtered = computed(() => {
    const list = this.bookings.myRentals();
    const f = this.filter();
    if (f === 'all') return list;

    return list.filter((b) => {
      switch (f) {
        case 'active': return b.status === 'Confirmed';
        case 'pending': return b.status === 'Pending';
        case 'completed': return b.status === 'Completed';
        case 'closed': return b.status === 'Cancelled' || b.status === 'Rejected';
      }
    });
  });

  protected readonly counts = computed(() => {
    const list = this.bookings.myRentals();
    return {
      all: list.length,
      active: list.filter(b => b.status === 'Confirmed').length,
      pending: list.filter(b => b.status === 'Pending').length,
      completed: list.filter(b => b.status === 'Completed').length,
      closed: list.filter(b => b.status === 'Cancelled' || b.status === 'Rejected').length,
    };
  });

  ngOnInit(): void {
    this.bookings.loadMine();
  }

  protected setFilter(f: TFilter): void { this.filter.set(f); }

  protected getImageUrl(imageUrl: string | null): string | null {
    return imageUrl ? this.equipment.getFullUrl(imageUrl) : null;
  }

  protected formatDate(d: string): string {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }

  protected statusLabel(s: TBookingStatus): string {
    return s;
  }

  protected statusClass(s: TBookingStatus): string {
    switch (s) {
      case 'Confirmed': return 'status-available';
      case 'Pending': return 'status-booked';
      case 'Completed': return 'status-available';
      case 'Rejected':
      case 'Cancelled': return 'status-unavailable';
    }
  }

  protected canCancel(b: IBooking): boolean {
    return b.status === 'Pending' || b.status === 'Confirmed';
  }

  protected canDelete(b: IBooking): boolean {
    return b.status === 'Cancelled' || b.status === 'Rejected' || b.status === 'Completed';
  }

  protected async onCancel(b: IBooking): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'CANCEL BOOKING',
      message: `Cancel your reservation for "${b.equipmentName}"?`,
      type: 'danger',
      confirmLabel: 'Cancel booking',
      cancelLabel: 'Keep it',
    });
    if (!confirmed) return;

    this.busyId.set(b.id);
    this.bookings.cancel(b.id).subscribe({
      next: () => {
        this._toast.show('Booking cancelled.', 'success');
        this.bookings.loadMine();
        this.busyId.set(null);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to cancel.', 'error');
        this.busyId.set(null);
      },
    });
  }

  protected async onDelete(b: IBooking): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'DELETE BOOKING',
      message: 'Remove this booking from your history?',
      type: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep it',
    });
    if (!confirmed) return;

    this.bookings.delete(b.id).subscribe({
      next: () => {
        this._toast.show('Booking removed.', 'success');
        this.bookings.loadMine();
      },
      error: (err) => this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to delete.', 'error'),
    });
  }
}
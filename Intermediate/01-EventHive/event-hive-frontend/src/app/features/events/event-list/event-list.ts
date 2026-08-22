import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { EventCard } from '../event-card/event-card';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventSerivce, IEventResponse } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { AuthService } from '../../../core/services/auth';

@Component({
  imports: [EventCard, RouterLink, FormsModule],
  selector: 'app-event-list',
  styles: ``,
  templateUrl: './event-list.html',
})
export class EventList implements OnInit {
  public _EventService: EventSerivce = inject(EventSerivce);
  private _Toast: Toast = inject(Toast);
  private _Auth: AuthService = inject(AuthService);

  showUpcoming: WritableSignal<boolean> = signal<boolean>(false);
  isOrganizer: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.loadEvents();

    const user = this._Auth.currentUser();
    this.isOrganizer.set(user?.fullName?.includes('Admin') || false);
  }

  loadEvents(): void {
    this._EventService.loadEvents(this.showUpcoming());
  }

  toggleUpcoming(): void {
    this.showUpcoming.update(v => !v);
    this.loadEvents();
  }

  onRsvp(eventId: number): void {
    this._EventService.rsvp(eventId).subscribe({
      next: () => {
        this._Toast.show('تم الحجز بنجاح ✅', 'success');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الحجز', 'error')
    })
  }

  onCancelRsvp(eventId: number): void {
    this._EventService.cancelRsvp(eventId).subscribe({
      next: (rsvp: IEventResponse) => {
        this._Toast.show('تم إلغاء الحجز', 'info');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الإلغاء', 'error')
    })
  }

  onDelete(eventId: number): void {
    if (!confirm('هل أنت متأكد من حذف هذه الفعالية ؟')) return;

    this._EventService.deleteEvent(eventId).subscribe({
      next: (event: IEventResponse) => {
        this._Toast.show('تم الحذف', 'success');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الحذف', 'error')
    })
  }
}

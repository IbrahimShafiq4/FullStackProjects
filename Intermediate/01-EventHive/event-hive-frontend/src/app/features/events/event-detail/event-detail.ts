import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { EventSerivce } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-event-detail',
  styles: ``,
  templateUrl: './event-detail.html',
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventSerivce);
  private toast = inject(Toast);
  private auth = inject(AuthService);

  event = signal<any>(null);
  isOrganizer = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        const user = this.auth.currentUser();
        this.isOrganizer.set(user?.fullName?.includes('Admin') || false);
      },
      error: () => this.toast.show('فشل تحميل التفاصيل', 'error')
    });
  }

  onRsvp() {
    const eventId = this.event().id;
    this.eventService.rsvp(eventId).subscribe({
      next: () => {
        this.toast.show('تم الحجز ✅', 'success');
        this.ngOnInit();
      },
      error: () => this.toast.show('فشل الحجز', 'error')
    });
  }

  onCancelRsvp() {
    const eventId = this.event().id;
    this.eventService.cancelRsvp(eventId).subscribe({
      next: () => {
        this.toast.show('تم الإلغاء', 'info');
        this.ngOnInit();
      },
      error: () => this.toast.show('فشل الإلغاء', 'error')
    });
  }

  onDelete() {
    if (!confirm('حذف الفعالية؟')) return;
    const eventId = this.event().id;
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.toast.show('تم الحذف', 'success');
        this.router.navigate(['/events']);
      },
      error: () => this.toast.show('فشل الحذف', 'error')
    });
  }
}
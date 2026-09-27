import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../shared/services/toast.service';

interface IVenue {
  id: number;
  name: string;
  address: string;
  totalRows: number;
  seatsPerRow: number;
}

interface IEventInput {
  title: string;
  eventDate: string;
  basePrice: number;
  venueId: number;
}

@Component({
  selector: 'app-event-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.css',
})
export class EventCreate implements OnInit {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  private readonly API = 'https://localhost:7133/api';

  readonly year = new Date().getFullYear();

  venues = signal<IVenue[]>([]);
  saving = signal(false);

  form: IEventInput = {
    title: '',
    eventDate: '',
    basePrice: 100,
    venueId: 0,
  };

  ngOnInit(): void {
    this._http.get<IVenue[]>(`${this.API}/venues`, { withCredentials: true }).subscribe({
      next: (d) => {
        this.venues.set(d);
        if (d.length > 0) this.form.venueId = d[0].id;
      },
      error: () => this._toast.show('تعذّر تحميل الأماكن.', 'error'),
    });
  }

  save(): void {
    if (!this.form.title || !this.form.eventDate || !this.form.venueId) {
      this._toast.show('املأ كل الحقول.', 'error');
      return;
    }

    if (this.form.basePrice < 0) {
      this._toast.show('السعر لازم يكون 0 أو أكثر.', 'error');
      return;
    }

    const selectedVenue = this.venues().find((v) => v.id === Number(this.form.venueId));
    if (!selectedVenue) {
      this._toast.show('اختر مكاناً صحيحاً.', 'error');
      return;
    }

    this.saving.set(true);

    const payload = {
      title: this.form.title,
      eventDate: new Date(this.form.eventDate).toISOString(),
      basePrice: Number(this.form.basePrice),
      venueId: Number(this.form.venueId),
    };

    this._http.post<{ id: number }>(`${this.API}/events`, payload, { withCredentials: true }).subscribe({
      next: (res) => {
        this.saving.set(false);
        this._toast.show(`تم إنشاء الفعالية #${res.id}.`, 'success');
        this._router.navigate(['/events', res.id, 'seats']);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = typeof err.error === 'string' ? err.error : 'تعذّر إنشاء الفعالية.';
        this._toast.show(msg, 'error');
      },
    });
  }

  get selectedVenue(): IVenue | null {
    return this.venues().find((v) => v.id === Number(this.form.venueId)) ?? null;
  }

  get totalSeats(): number {
    const v = this.selectedVenue;
    return v ? v.totalRows * v.seatsPerRow : 0;
  }
}
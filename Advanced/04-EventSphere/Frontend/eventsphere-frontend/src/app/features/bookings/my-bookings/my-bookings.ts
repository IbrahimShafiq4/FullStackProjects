import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

interface IMyBooking {
  id: number;
  finalPrice: number;
  bookedAt: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  seatRow: number;
  seatNumber: number;
}

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe],
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  private _http = inject(HttpClient);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  private readonly API = 'https://localhost:7133/api';

  readonly year = new Date().getFullYear();

  bookings = signal<IMyBooking[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this._http
      .get<IMyBooking[]>(`${this.API}/bookings/my`, { withCredentials: true })
      .subscribe({
        next: (d) => {
          this.bookings.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  totalSpent(): number {
    return this.bookings().reduce((s, b) => s + b.finalPrice, 0);
  }
}
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private _http = inject(HttpClient);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  readonly year = new Date().getFullYear();

  testimonials = signal<any[]>([]);
  venues = signal<any[]>([]);
  events = signal<any[]>([]);

  ngOnInit(): void {
    this._http
      .get<any[]>('https://localhost:7133/api/testimonials?onlyPublished=false', { withCredentials: true })
      .subscribe({ next: (d) => this.testimonials.set(d) });

    this._http
      .get<any[]>('https://localhost:7133/api/venues', { withCredentials: true })
      .subscribe({ next: (d) => this.venues.set(d) });

    this._http
      .get<any[]>('https://localhost:7133/api/events', { withCredentials: true })
      .subscribe({ next: (d) => this.events.set(d) });
  }
}
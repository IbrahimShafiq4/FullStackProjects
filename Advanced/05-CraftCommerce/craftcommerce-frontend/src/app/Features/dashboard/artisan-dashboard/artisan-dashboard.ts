import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

interface IStats {
  totalProducts: number;
  totalRevenue: number;
  totalSold: number;
  avgRating: number;
}

@Component({
  imports: [DecimalPipe, RouterLink, AppShell, CaseStrip],
  selector: 'app-artisan-dashboard',
  templateUrl: './artisan-dashboard.html',
  styleUrl: './artisan-dashboard.css',
})
export class ArtisanDashboard implements OnInit {
  private _http = inject(HttpClient);

  stats: WritableSignal<IStats | null> = signal(null);
  loading: WritableSignal<boolean> = signal(true);
  error: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this._http.get<IStats>('https://localhost:7245/api/analytics/artisan-dashboard').subscribe({
      next: (s) => { this.stats.set(s); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set(true); },
    });
  }
}
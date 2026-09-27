import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PatientDashboardService } from '../../core/services/patient-dashboard.service';
import { PatientProfileService } from '../../core/services/patient-profile.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-patient-dashboard',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard implements OnInit {
  readonly _dash = inject(PatientDashboardService);
  readonly _profile = inject(PatientProfileService);
  readonly _reviews = inject(ReviewsService);
  private readonly _toast = inject(ToastService);

  ngOnInit(): void {
    this._dash.load();
    this._profile.getMine().subscribe();
    this._reviews.loadMine();
  }

  photoUrl(path: string): string {
    return this._profile.resolveUrl(path);
  }
}
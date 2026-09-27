import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../../core/services/reviews.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DoctorProfileService, IDoctorProfile } from '../../../doctor-profile.service';

@Component({
  selector: 'app-review-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _reviews = inject(ReviewsService);
  private readonly _profiles = inject(DoctorProfileService);
  private readonly _appts = inject(AppointmentsService);
  private readonly _toast = inject(ToastService);

  doctorId = signal('');
  doctorProfile = signal<IDoctorProfile | null>(null);

  rating = signal(0);
  hoverRating = signal(0);
  comment = signal('');
  appointmentId = signal<number | null>(null);

  saving = signal(false);
  readonly stars = [1, 2, 3, 4, 5];

  readonly ratingLabels: Record<number, string> = {
    1: 'سيء جداً',
    2: 'سيء',
    3: 'مقبول',
    4: 'جيد',
    5: 'ممتاز',
  };

  ngOnInit(): void {
    const queryDoctorId = this._route.snapshot.queryParamMap.get('doctorId');
    if (!queryDoctorId) {
      this._toast.show('لم يتم تحديد الطبيب', 'error');
      this._router.navigate(['/patient-dashboard']);
      return;
    }

    this.doctorId.set(queryDoctorId);

    this._profiles.getProfile(queryDoctorId).subscribe({
      next: (p) => this.doctorProfile.set(p),
    });

    this._appts.loadMyAppointments();
    setTimeout(() => {
      const apt = this._appts.appointments().find((a) => a.doctorName && a.status === 'Completed');
      if (apt) this.appointmentId.set(apt.id);
    }, 500);
  }

  onStarClick(star: number): void {
    this.rating.set(star);
  }

  onStarHover(star: number): void {
    this.hoverRating.set(star);
  }

  onStarLeave(): void {
    this.hoverRating.set(0);
  }

  activeRating(): number {
    return this.hoverRating() || this.rating();
  }

  resolvePhoto(): string {
    const url = this.doctorProfile()?.photoUrl ?? '';
    return this._profiles.resolveUrl(url);
  }

  onSubmit(): void {
    if (this.rating() === 0) {
      this._toast.show('اختر التقييم أولاً', 'error');
      return;
    }

    this.saving.set(true);
    this._reviews.create({
      doctorId: this.doctorId(),
      appointmentId: this.appointmentId() ?? undefined,
      rating: this.rating(),
      comment: this.comment(),
    }).subscribe({
      next: () => {
        this._toast.show('تم إرسال تقييمك، شكراً لك', 'success');
        this._router.navigate(['/patient-dashboard']);
      },
      error: (err) => {
        const m = err.error;
        this._toast.show(typeof m === 'string' ? m : 'تعذر إرسال التقييم', 'error');
        this.saving.set(false);
      },
    });
  }
}
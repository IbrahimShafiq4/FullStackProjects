import { Component, inject, OnInit, signal } from '@angular/core';

import { WorkoutService } from '../../../core/services/workout.service';
import { ToastService } from '../../../shared/services/toast.service';

import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

import { LogForm } from '../../workouts/log-form/log-form';
import { StatsDashboard } from '../stats-dashboard/stats-dashboard';
import { CoachRatingForm } from '../../coach/components/coach-rating-form/coach-rating-form';

@Component({
  selector: 'app-my-plans',
  standalone: true,
  imports: [
    RevealOnScrollDirective,
    LogForm,
    StatsDashboard,
    CoachRatingForm
  ],
  templateUrl: './my-plans.html',
})
export class MyPlans implements OnInit {

  workoutService = inject(WorkoutService);
  private toast = inject(ToastService);

  // كل مرة القيمة دي تتغير، الـ StatsDashboard يعمل refresh
  statsRefresh = signal(0);

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.workoutService.loadPlans();
  }

  isEnrolled(planId: number): boolean {
    const enrolled = JSON.parse(
      localStorage.getItem('enrolledPlans') || '[]'
    );

    return enrolled.includes(planId);
  }

  enroll(planId: number): void {
    this.workoutService.enroll(planId).subscribe({
      next: () => {
        this.toast.show(
          'تم الاشتراك في الخطة ✅',
          'success'
        );

        const enrolled = JSON.parse(
          localStorage.getItem('enrolledPlans') || '[]'
        );

        if (!enrolled.includes(planId)) {
          enrolled.push(planId);

          localStorage.setItem(
            'enrolledPlans',
            JSON.stringify(enrolled)
          );
        }

        this.loadPlans();
      },

      error: (err) => {
        this.toast.show(
          err.error?.message || 'فشل الاشتراك',
          'error'
        );
      }
    });
  }

  onPlansUpdated(): void {
    // نعمل reload للخطط
    this.loadPlans();

    // ونطلب من StatsDashboard يعمل refresh
    this.statsRefresh.update(value => value + 1);
  }
}
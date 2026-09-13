import { Component, inject, OnInit } from '@angular/core';
import { LogForm } from '../log-form/log-form';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { WorkoutService } from '../../../core/services/workout.service';
import { ToastService } from '../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [LogForm, RevealOnScrollDirective],
  selector: 'app-plan-list',
  templateUrl: './plan-list.html',
})
export class PlanList implements OnInit {
  public _WorkoutService = inject(WorkoutService);
  private _ToastService = inject(ToastService);

  showVideoId: number | null = null;

  ngOnInit(): void {
    this._WorkoutService.loadPlans();
  }

  onEnroll(planId: number): void {
    this._WorkoutService.enroll(planId).subscribe({
      next: () => {
        this._ToastService.show('تم الإشتراك فى الخطة', 'success');
        this._WorkoutService.loadPlans();
      },
      error: (error: HttpErrorResponse) => {
        this._ToastService.show(error.error?.message || error.error || 'حصل خطأ', 'error');
      },
    });
  }

  toggleVideo(id: number): void {
    this.showVideoId = this.showVideoId === id ? null : id;
  }
}
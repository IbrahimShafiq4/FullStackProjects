import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkoutService } from '../../../../core/services/workout.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-create-plan-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <input
        [(ngModel)]="title"
        name="title"
        type="text"
        placeholder="عنوان الخطة"
        class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pulse outline-none transition"
        required
      />
      <textarea
        [(ngModel)]="description"
        name="description"
        placeholder="وصف الخطة (اختياري)"
        rows="2"
        class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pulse outline-none transition"
      ></textarea>
      <button
        type="submit"
        [disabled]="isSubmitting()"
        class="bg-pulse text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {{ isSubmitting() ? 'جاري الإنشاء...' : 'إنشاء خطة جديدة' }}
      </button>
    </form>
  `,
})
export class CreatePlanForm {
  private workoutService = inject(WorkoutService);
  private toast = inject(ToastService);

  title = '';
  description = '';
  isSubmitting = signal(false);

  onSubmit(): void {
    if (!this.title.trim()) {
      this.toast.show('يرجى إدخال عنوان للخطة', 'error');
      return;
    }

    this.isSubmitting.set(true);
    this.workoutService.createPlans(this.title.trim(), this.description.trim()).subscribe({
      next: () => {
        this.toast.show('تم إنشاء الخطة بنجاح ✅', 'success');
        this.isSubmitting.set(false);
        this.title = '';
        this.description = '';
        this.workoutService.loadPlans();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || err.error || 'فشل إنشاء الخطة';
        this.toast.show(msg, 'error');
      },
    });
  }
}
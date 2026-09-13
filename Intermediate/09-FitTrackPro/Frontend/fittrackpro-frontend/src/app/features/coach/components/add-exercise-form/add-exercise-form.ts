import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkoutService } from '../../../../core/services/workout.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-add-exercise-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
      <input
        [(ngModel)]="name"
        name="name"
        type="text"
        placeholder="اسم التمرين"
        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse outline-none transition"
        required
      />
      <div class="flex gap-2">
        <input
          [(ngModel)]="targetSets"
          name="targetSets"
          type="number"
          placeholder="مجموعات"
          class="w-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse outline-none transition"
          required
          min="1"
        />
        <input
          [(ngModel)]="targetReps"
          name="targetReps"
          type="number"
          placeholder="تكرارات"
          class="w-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pulse outline-none transition"
          required
          min="1"
        />
      </div>
      <input
        type="file"
        (change)="onFileSelected($event)"
        accept="video/*"
        class="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pulse file:text-white hover:file:opacity-90 transition"
      />
      <button
        type="submit"
        [disabled]="isSubmitting()"
        class="bg-pulse text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {{ isSubmitting() ? 'جاري الرفع...' : 'إضافة تمرين' }}
      </button>
    </form>
  `,
})
export class AddExerciseForm {
  private workoutService = inject(WorkoutService);
  private toast = inject(ToastService);

  planId = input.required<number>();

  name = '';
  targetSets = 3;
  targetReps = 10;
  selectedFile: File | null = null;
  isSubmitting = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.name.trim() || !this.targetSets || !this.targetReps || !this.selectedFile) {
      this.toast.show('يرجى ملء جميع الحقول واختيار فيديو', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.name.trim());
    formData.append('TargetSets', String(this.targetSets));
    formData.append('TargetReps', String(this.targetReps));
    formData.append('demoVideo', this.selectedFile);

    this.isSubmitting.set(true);
    this.workoutService.addExercise(this.planId(), formData).subscribe({
      next: () => {
        this.toast.show('تم إضافة التمرين بنجاح 🎥', 'success');
        this.isSubmitting.set(false);
        this.name = '';
        this.targetSets = 3;
        this.targetReps = 10;
        this.selectedFile = null;
        this.workoutService.loadPlans();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || err.error || 'فشل إضافة التمرين';
        this.toast.show(msg, 'error');
      },
    });
  }
}
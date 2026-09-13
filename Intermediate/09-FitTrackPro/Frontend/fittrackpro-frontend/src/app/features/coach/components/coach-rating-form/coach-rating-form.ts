import { Component, ElementRef, inject, input, InputSignal, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../../core/services/rating.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-coach-rating-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm" #card>
      @if (!hasRated()) {
        <h4 class="font-medium text-gray-800 dark:text-white mb-2">قيّم المدرب</h4>
        <div class="flex items-center gap-2 mb-3">
          <div class="flex text-2xl">
            @for (star of [1,2,3,4,5]; track star) {
              <button
                type="button"
                (click)="setRating(star)"
                class="transition-transform hover:scale-110"
                [class.text-yellow-400]="star <= rating()"
                [class.text-gray-300]="star > rating()"
              >★</button>
            }
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ rating() }}/5</span>
        </div>
        <textarea
          [(ngModel)]="comment"
          name="comment"
          placeholder="اكتب رأيك (اختياري)"
          rows="2"
          class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pulse outline-none transition mb-2"
        ></textarea>
        <button
          type="button"
          (click)="submit()"
          [disabled]="isSubmitting()"
          class="bg-pulse text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {{ isSubmitting() ? 'جاري الإرسال...' : 'إرسال التقييم' }}
        </button>
      } @else {
        <p class="text-green-600 dark:text-green-400 font-medium">✓ لقد قيّمت هذا المدرب</p>
      }
    </div>
  `
})
export class CoachRatingForm {
  private _RatingService: RatingService = inject(RatingService);
  private _ToastService: ToastService = inject(ToastService);

  coachId = input.required<string>();
  workoutPlanId = input<number | undefined>();

  rating = signal(5);
  comment = '';
  isSubmitting = signal(false);
  hasRated = signal(false);
  cardRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('card');

  ngOnInit() {
    this._RatingService.hasRated(this.coachId()).subscribe({
      next: (res) => this.hasRated.set(res.hasRated),
      error: () => this.hasRated.set(false)
    });
  }

  setRating(star: number): void {
    this.rating.set(star);
  }

  submit(): void {
    this.isSubmitting.set(true);
    this._RatingService.addRating(
      this.coachId(),
      this.rating(),
      this.comment.trim(),
      this.workoutPlanId()
    ).subscribe({
      next: () => {
        this._ToastService.show('تم إرسال التقييم بنجاح ⭐', 'success');
        this.isSubmitting.set(false);
        this.hasRated.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this._ToastService.show(err.error?.message || 'فشل إرسال التقييم', 'error');
      }
    });
  }
}
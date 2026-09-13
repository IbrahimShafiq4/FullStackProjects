import { Component, ElementRef, inject, input, InputFunction, InputSignal, output, OutputEmitterRef, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { WorkoutService } from '../../../core/services/workout.service';
import { ToastService } from '../../../shared/services/toast.service';
import gsap from 'gsap';

@Component({
  imports: [FormField, FormsModule],
  selector: 'app-log-form',
  templateUrl: './log-form.html',
})
export class LogForm {
  private _WorkoutService: WorkoutService = inject(WorkoutService);
  private _ToastsService: ToastService = inject(ToastService);

  exerciseId: InputSignal<number> = input.required<number>();
  private cardRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('card');

  exerciseUpdated: OutputEmitterRef<void> = output<void>();

  formModel:
    WritableSignal<{ reps: number, weight: number }> =
    signal<{ reps: number, weight: number }>({ reps: 0, weight: 0 });

  logForm = form(this.formModel, () => { });
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onSubmit(): void {
    const { reps, weight } = this.formModel();
    const formData = new FormData();

    formData.append('exerciseId', this.exerciseId().toString());
    formData.append('reps', reps.toString());
    formData.append('weight', weight.toString());

    this.isSubmitting.set(true);

    this._WorkoutService.logWorkout(formData).subscribe({
      next: () => {
        this._ToastsService.show('تم تسجيل التمرين 💪', 'success');
        this.isSubmitting.set(false);

        const card = this.cardRef()?.nativeElement;

        if (card) {
          gsap.fromTo(
            card,
            { scale: 1 },
            {
              scale: 1.05,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              ease: 'power1.inOut'
            }
          );
        }

        this.exerciseUpdated.emit();
      },
      error: () => this.isSubmitting.set(false),
    })
  }
}
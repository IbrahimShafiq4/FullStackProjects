import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { GigsService, IGig } from '../../../core/services/gigs-service';
import { ToastService } from '../../../core/services/toast-service';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-gig-form',
  styles: ``,
  templateUrl: './gig-form.html',
})
export class GigForm {
  private _GigsService: GigsService = inject(GigsService);
  private _ToastService: ToastService = inject(ToastService);

  gigCreated: OutputEmitterRef<void> = output<void>();

  formModel: WritableSignal<{ title: string, description: string, budget: number }> = signal<{ title: string, description: string, budget: number }>({ title: '', description: '', budget: 0 })
  gigForm = form(this.formModel, () => { });
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onSubmit(): void {
    const { title, description, budget } = this.formModel();

    if (!title.trim() || !description.trim() || budget <= 0) {
      this._ToastService.show('لازم تملى كل الحقول بشكل صحيح', 'error')
      return;
    }

    this.isSubmitting.set(true);

    this._GigsService.createGig(title, description, budget).subscribe({
      next: (gig: IGig) => {
        this._ToastService.show("تم نشر المهمة بنجاح", 'success');
        this.formModel.set({ title: '', description: '', budget: 0 });
        this.isSubmitting.set(false);
        this.gigCreated.emit();
      },
      error: (error: HttpErrorResponse) => {
        this._ToastService.show('حصل خطأ اثناء النشر', 'error');
        this.isSubmitting.set(false);
      }
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, inject, output, signal } from '@angular/core';
import { Toast } from '../../../core/Services/toast';
import { form, FormField, min, max } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
interface EntryModel {
  moodLevel: number;
  focusLevel: number;
  note: string;
}
@Component({
  selector: 'app-entry-form',
  imports: [FormField, FormsModule],
  templateUrl: './entry-form.html',
  styleUrl: './entry-form.scss',
})
export class EntryForm {
  private http = inject(HttpClient);
  private toast = inject(Toast);

  entrySaved = output<void>();

  private readonly API_URL = 'https://localhost:7102/api/entries';

  private entryModelRaw: EntryModel = {
    moodLevel: 5,
    focusLevel: 5,
    note: ''
  };

  private entryModelWatched = new Proxy(this.entryModelRaw, {
    set: (target, property, value) => {

      console.log(
        `تم تغيير ${String(property)} من ${target[property as keyof EntryModel]
        } إلى ${value}`
      );

      return Reflect.set(target, property, value);
    }
  });

  entryModel = signal(this.entryModelWatched);

  entryForm = form(this.entryModel, (path) => {
    min(path.moodLevel, 1);
    max(path.moodLevel, 10);

    min(path.focusLevel, 1);
    max(path.focusLevel, 10);
  });

  isSubmitting = signal(false);

  onSubmit() {
    const { moodLevel, focusLevel, note } = this.entryModel();

    this.isSubmitting.set(true);

    this.http.post(this.API_URL, { moodLevel, focusLevel, note }, { withCredentials: true }).subscribe({
      next: () => {
        this.toast.show('تم تسجيل نبضة اليوم بنجاح', 'success');
        this.isSubmitting.set(false);
        this.entrySaved.emit();
      },
      error: (err) => {
        const message = err.error ?? 'حصل خطأ أثناء الحفظ';
        this.toast.show(message, 'error');
        this.isSubmitting.set(false);
      }
    });
  }
}
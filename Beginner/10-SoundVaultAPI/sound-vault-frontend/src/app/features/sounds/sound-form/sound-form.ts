import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ISound, Sounds } from '../../../core/services/sounds';
import { Toast } from '../../../core/services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-sound-form',
  templateUrl: './sound-form.html',
})
export class SoundForm implements OnInit {
  private _Sounds = inject(Sounds);
  private _Toast = inject(Toast);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);

  isEditMode    = signal(false);
  soundId       = signal<number | null>(null);
  isSubmitting  = signal(false);

  model = {
    title: '',
    description: '',
    capturedAt: new Date().toISOString().slice(0, 10),
    category: 'Music',
    file: null as File | null
  };

  ngOnInit(): void {
    this.checkRoute();
  }

  checkRoute(): void {
    const idParam = this._ActivatedRoute.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      this.soundId.set(id);
      this.isEditMode.set(true);

      this.getSoundById(id);
    }
  }

  getSoundById(id: number): void {
    this._Sounds.getById(id).subscribe({
      next: (sound: ISound) => {
        this.model.title = sound.title;
        this.model.description = sound.description || '';
        this.model.capturedAt =
          new Date(sound.capturedAt).toISOString().slice(0, 10);
        this.model.category = sound.category;
      },

      error: () => {
        this._Toast.show('تعذر تحميل البيانات', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.model.file = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = this.formInitialization();

    if (!formData) {
      return;
    }

    const id = this.soundId();

    if (id !== null) {
      this.onEdit(id, formData);
    } else {
      this.onAdd(formData);
    }
  }

  formInitialization(): FormData | null {
    if (!this.model.title.trim()) {
      this._Toast.show('العنوان مطلوب', 'error');
      return null;
    }

    const formData = new FormData();

    formData.append('title', this.model.title);
    formData.append('description', this.model.description);
    formData.append('capturedAt', this.model.capturedAt);
    formData.append('category', this.model.category);

    if (this.model.file) {
      formData.append('file', this.model.file);
    }

    this.isSubmitting.set(true);

    return formData;
  }

  onEdit(id: number, formData: FormData): void {
    this._Sounds.update(id, formData).subscribe({
      next: () => {
        this._Toast.show('🎉 تم التحديث ✅', 'success');
        this._Router.navigate(['/sounds']);
      },

      error: (error: HttpErrorResponse) => {
        this._Toast.show(error.error || 'حدث خطأ', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  onAdd(formData: FormData): void {
    this._Sounds.create(formData).subscribe({
      next: () => {
        this._Toast.show('تم الإضافة', 'success');
        this._Router.navigate(['/sounds']);
      },

      error: (error: HttpErrorResponse) => {
        this._Toast.show(error.error || 'حدث خطأ', 'error');
        this.isSubmitting.set(false);
      }
    });
  }
}
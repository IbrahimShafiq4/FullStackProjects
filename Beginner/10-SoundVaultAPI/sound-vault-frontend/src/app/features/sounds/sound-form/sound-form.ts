import { Component, inject, OnInit, signal } from '@angular/core';
import { Sounds } from '../../../core/services/sounds';
import { Toast } from '../../../core/services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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
  isEditMode = signal(false);
  soundId = signal<number | null>(null);
  isSubmitting = signal(false);
  model = { title: '', description: '', capturedAt: new Date().toISOString().slice(0, 10), category: 'Music', file: null as File | null };

  ngOnInit(): void { this.checkRoute(); }

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
      next: (sound) => {
        this.model.title = sound.title;
        this.model.description = sound.description || '';
        this.model.capturedAt = new Date(sound.capturedAt).toISOString().slice(0, 10);
        this.model.category = sound.category;
      },
      error: () => this._Toast.show('تعذر تحميل البيانات', 'error')
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.model.file = input.files[0];
  }

  onSubmit(): void {
    const formData = this.buildFormData();
    if (!formData) return;
    const id = this.soundId();
    if (id !== null) this.updateSound(id, formData);
    else this.createSound(formData);
  }

  buildFormData(): FormData | null {
    if (!this.model.title.trim()) {
      this._Toast.show('العنوان مطلوب', 'error');
      return null;
    }
    const fd = new FormData();
    fd.append('title', this.model.title);
    fd.append('description', this.model.description);
    fd.append('capturedAt', this.model.capturedAt);
    fd.append('category', this.model.category);
    if (this.model.file) fd.append('file', this.model.file);
    this.isSubmitting.set(true);
    return fd;
  }

  updateSound(id: number, fd: FormData): void {
    this._Sounds.update(id, fd).subscribe({
      next: () => { this._Toast.show('تم التحديث', 'success'); this._Router.navigate(['/sounds']); },
      error: (err) => { this._Toast.show(err.error || 'حدث خطأ', 'error'); this.isSubmitting.set(false); }
    });
  }

  createSound(fd: FormData): void {
    this._Sounds.create(fd).subscribe({
      next: () => { this._Toast.show('تم الإضافة', 'success'); this._Router.navigate(['/sounds']); },
      error: (err) => { this._Toast.show(err.error || 'حدث خطأ', 'error'); this.isSubmitting.set(false); }
    });
  }
}
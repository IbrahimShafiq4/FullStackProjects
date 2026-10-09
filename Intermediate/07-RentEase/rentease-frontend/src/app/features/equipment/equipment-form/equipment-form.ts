import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EquipmentService } from '../../../core/services/equipment.service';
import { ToastService } from '../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, RouterLink, FormsModule],
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.html',
})
export class EquipmentForm {
  private readonly _EquipmentService = inject(EquipmentService);
  private readonly _ToastService = inject(ToastService);
  private readonly _Router = inject(Router);

  formModel: WritableSignal<{ name: string; category: string; pricePerDay: number }> =
    signal({ name: '', category: '', pricePerDay: 0 });

  equipmentForm = form(this.formModel, () => { });
  selectedPhoto: WritableSignal<File | null> = signal<File | null>(null);
  isSubmitting: WritableSignal<boolean> = signal(false);

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.selectedPhoto.set(input.files?.[0] ?? null);
  }

  onSubmit(): void {
    const { name, category, pricePerDay } = this.formModel();
    if (!name.trim() || !category.trim()) {
      this._ToastService.show('Equipment name and category are required.', 'error');
      return;
    }

    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', category);
    fd.append('pricePerDay', pricePerDay.toString());
    const photo = this.selectedPhoto();
    if (photo) fd.append('photo', photo);

    this.isSubmitting.set(true);

    this._EquipmentService.createEquipment(fd).subscribe({
      next: () => {
        this._ToastService.show('Asset published. It is now available.', 'success');
        this._Router.navigate(['/equipment']);
      },
      error: () => {
        this._ToastService.show('Failed to publish the asset.', 'error');
        this.isSubmitting.set(false);
      },
    });
  }
}
import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { EquipmentService, ICreate } from '../../../core/services/equipment.service';
import { ToastService } from '../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule],
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.html',
})
export class EquipmentForm {
  private _EquipmentService: EquipmentService = inject(EquipmentService);
  private _ToastService: ToastService = inject(ToastService);

  equipmentAdded: OutputEmitterRef<void> = output<void>();

  formModel:
    WritableSignal<{ name: string, category: string, pricePerDay: number }>
    = signal<{ name: string, category: string, pricePerDay: number }>
      ({ name: '', category: '', pricePerDay: 0 });

  equipmentForm = form(this.formModel, () => { });
  selectedPhoto: WritableSignal<File | null> = signal<File | null>(null);
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedPhoto.set(input.files?.[0] ?? null);
  }

  onSubmit(): void {
    const { name, category, pricePerDay } = this.formModel();
    if (!name.trim() || !category.trim()) {
      this._ToastService.show('لازم تملى الاسم والفئة', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('pricePerDay', pricePerDay.toString());
    const photo = this.selectedPhoto();
    if (photo) formData.append('photo', photo);

    this.isSubmitting.set(true);

    this._EquipmentService.createEquipment(formData).subscribe({
      next: () => {
        this._ToastService.show('تم إضافة المعدة بنجاح', 'success');
        this.formModel.set({ name: '', category: '', pricePerDay: 0 });
        this.selectedPhoto.set(null);
        this.isSubmitting.set(false);
        this.equipmentAdded.emit();
      },
      error: () => {
        this._ToastService.show('حصل خطأ أثناء الإضافة', 'error');
        this.isSubmitting.set(false);
      }
    });
  }
}

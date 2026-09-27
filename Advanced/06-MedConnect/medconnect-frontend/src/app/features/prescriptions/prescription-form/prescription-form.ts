import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AppointmentsService,
  IPrescriptionMedication,
} from '../../../core/services/appointments.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [FormsModule],
  selector: 'app-prescription-form',
  styleUrl: './prescription-form.css',
  templateUrl: './prescription-form.html',
})
export class PrescriptionForm {
  private readonly _appointments = inject(AppointmentsService);
  private readonly _toast = inject(ToastService);

  appointmentId: InputSignal<number> = input.required<number>();
  medications: WritableSignal<IPrescriptionMedication[]> = signal<IPrescriptionMedication[]>([]);
  notes: WritableSignal<string> = signal<string>('');

  addMedication(): void {
    this.medications.update((list) => [
      ...list,
      { name: '', dose: '', frequency: '', duration: '', notes: '' },
    ]);
  }

  removeMedication(index: number): void {
    this.medications.update((list) => list.filter((_, i) => i !== index));
  }

  updateMedication(index: number, field: keyof IPrescriptionMedication, value: string): void {
    this.medications.update((list) =>
      list.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  }

  onSubmit(): void {
    const valid = this.medications()
      .filter((m) => m.name.trim() !== '')
      .map((m) => ({
        name: m.name.trim(),
        dose: m.dose.trim(),
        frequency: m.frequency.trim(),
        duration: m.duration.trim(),
        notes: m.notes.trim(),
      }));

    if (valid.length === 0) {
      this._toast.show('أضف دواءً واحداً على الأقل', 'error');
      return;
    }

    this._appointments.issuePrescription(this.appointmentId(), valid, this.notes()).subscribe({
      next: () => this._toast.show('تم إصدار الروشتة بنجاح', 'success'),
      error: () => this._toast.show('تعذر إصدار الروشتة', 'error'),
    });
  }
}
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { PatientProfileService } from '../../../core/services/patient-profile.service';

@Component({
  selector: 'app-patient-profile-edit',
  imports: [FormsModule],
  templateUrl: './patient-profile-edit.html',
  styleUrl: './patient-profile-edit.css',
})
export class PatientProfileEdit implements OnInit {
  private readonly _service = inject(PatientProfileService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  photoUrl = signal('');
  bloodType = signal('');
  dateOfBirth = signal('');
  gender = signal('');
  phone = signal('');
  address = signal('');
  emergencyContact = signal('');
  emergencyPhone = signal('');

  chronicDiseasesText = signal('');
  allergiesText = signal('');
  currentMedicationsText = signal('');

  saving = signal(false);
  uploading = signal(false);

  readonly bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  readonly genders = ['ذكر', 'أنثى'];

  ngOnInit(): void {
    this._service.getMine().subscribe({
      next: (p) => {
        this.photoUrl.set(p.photoUrl || '');
        this.bloodType.set(p.bloodType || '');
        this.dateOfBirth.set(p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '');
        this.gender.set(p.gender || '');
        this.phone.set(p.phone || '');
        this.address.set(p.address || '');
        this.emergencyContact.set(p.emergencyContact || '');
        this.emergencyPhone.set(p.emergencyPhone || '');
        this.chronicDiseasesText.set((p.chronicDiseases || []).join(', '));
        this.allergiesText.set((p.allergies || []).join(', '));
        this.currentMedicationsText.set((p.currentMedications || []).join(', '));
      },
    });
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this._service.uploadPhoto(file).subscribe({
      next: (res) => {
        this.photoUrl.set(res.url);
        this._toast.show('تم رفع الصورة', 'success');
        this.uploading.set(false);
      },
      error: () => {
        this._toast.show('تعذر رفع الصورة', 'error');
        this.uploading.set(false);
      },
    });
  }

  parseList(text: string): string[] {
    return text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  onSave(): void {
    this.saving.set(true);

    this._service.updateMine({
      photoUrl: this.photoUrl(),
      bloodType: this.bloodType(),
      dateOfBirth: this.dateOfBirth() || null,
      gender: this.gender(),
      phone: this.phone(),
      address: this.address(),
      emergencyContact: this.emergencyContact(),
      emergencyPhone: this.emergencyPhone(),
      chronicDiseases: this.parseList(this.chronicDiseasesText()),
      allergies: this.parseList(this.allergiesText()),
      currentMedications: this.parseList(this.currentMedicationsText()),
    }).subscribe({
      next: () => {
        this._toast.show('تم حفظ بياناتك الطبية', 'success');
        this.saving.set(false);
        this._router.navigate(['/patient-dashboard']);
      },
      error: () => {
        this._toast.show('تعذر الحفظ', 'error');
        this.saving.set(false);
      },
    });
  }

  resolvePhoto(): string {
    return this._service.resolveUrl(this.photoUrl());
  }
}
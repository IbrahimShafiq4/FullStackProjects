import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorProfileService, IAchievement, ICertificate } from '../../../doctor-profile.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-doctor-profile-edit',
  imports: [FormsModule],
  templateUrl: './doctor-profile-edit.html',
  styleUrl: './doctor-profile-edit.css',
})
export class DoctorProfileEdit implements OnInit {
  private readonly _service = inject(DoctorProfileService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  photoUrl = signal('');
  bio = signal('');
  yearsOfExperience = signal(0);
  clinicName = signal('');
  clinicAddress = signal('');
  clinicPhone = signal('');
  clinicHours = signal('');
  examinationFee = signal(0);
  consultationFee = signal(0);
  currency = signal('EGP');
  languagesText = signal('');

  achievements = signal<IAchievement[]>([]);
  certificates = signal<ICertificate[]>([]);

  saving = signal(false);
  uploading = signal(false);

  ngOnInit(): void {
    this._service.loadMine();
    const p = this._service.myProfile();
    if (p) {
      this.photoUrl.set(p.photoUrl || '');
      this.bio.set(p.bio || '');
      this.yearsOfExperience.set(p.yearsOfExperience || 0);
      this.clinicName.set(p.clinicName || '');
      this.clinicAddress.set(p.clinicAddress || '');
      this.clinicPhone.set(p.clinicPhone || '');
      this.clinicHours.set(p.clinicHours || '');
      this.examinationFee.set(p.examinationFee || 0);
      this.consultationFee.set(p.consultationFee || 0);
      this.currency.set(p.currency || 'EGP');
      this.languagesText.set((p.languages || []).join(', '));
      this.achievements.set(p.achievements || []);
      this.certificates.set(p.certificates || []);
    } else {
      setTimeout(() => this.loadFromService(), 400);
    }
  }

  private loadFromService(): void {
    const p = this._service.myProfile();
    if (!p) return;
    this.photoUrl.set(p.photoUrl || '');
    this.bio.set(p.bio || '');
    this.yearsOfExperience.set(p.yearsOfExperience || 0);
    this.clinicName.set(p.clinicName || '');
    this.clinicAddress.set(p.clinicAddress || '');
    this.clinicPhone.set(p.clinicPhone || '');
    this.clinicHours.set(p.clinicHours || '');
    this.examinationFee.set(p.examinationFee || 0);
    this.consultationFee.set(p.consultationFee || 0);
    this.currency.set(p.currency || 'EGP');
    this.languagesText.set((p.languages || []).join(', '));
    this.achievements.set(p.achievements || []);
    this.certificates.set(p.certificates || []);
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

  addAchievement(): void {
    this.achievements.update((l) => [...l, { title: '', year: '', description: '' }]);
  }

  removeAchievement(i: number): void {
    this.achievements.update((l) => l.filter((_, idx) => idx !== i));
  }

  updateAchievement(i: number, field: keyof IAchievement, value: string): void {
    this.achievements.update((l) =>
      l.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    );
  }

  addCertificate(): void {
    this.certificates.update((l) => [...l, { title: '', issuer: '', year: '' }]);
  }

  removeCertificate(i: number): void {
    this.certificates.update((l) => l.filter((_, idx) => idx !== i));
  }

  updateCertificate(i: number, field: keyof ICertificate, value: string): void {
    this.certificates.update((l) =>
      l.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    );
  }

  onSave(): void {
    this.saving.set(true);
    const languages = this.languagesText()
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    this._service.updateMine({
      photoUrl: this.photoUrl(),
      bio: this.bio(),
      yearsOfExperience: this.yearsOfExperience(),
      clinicName: this.clinicName(),
      clinicAddress: this.clinicAddress(),
      clinicPhone: this.clinicPhone(),
      clinicHours: this.clinicHours(),
      examinationFee: this.examinationFee(),
      consultationFee: this.consultationFee(),
      currency: this.currency(),
      achievements: this.achievements().filter((a) => a.title.trim() !== ''),
      certificates: this.certificates().filter((c) => c.title.trim() !== ''),
      languages,
    }).subscribe({
      next: () => {
        this._toast.show('تم الحفظ بنجاح', 'success');
        this.saving.set(false);
        this._router.navigate(['/dashboard']);
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
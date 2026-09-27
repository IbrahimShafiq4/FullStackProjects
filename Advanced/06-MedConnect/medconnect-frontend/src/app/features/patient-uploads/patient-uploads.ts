import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RadiologyService, IRadiologyUpload } from '../../core/services/radiology.service';
import { PatientProfileService } from '../../core/services/patient-profile.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { ToastService } from '../../shared/services/toast.service';

interface ICategory {
  value: string;
  label: string;
  hint: string;
  icon: string;
  accepted: string;
}

@Component({
  selector: 'app-patient-uploads',
  imports: [FormsModule, UpperCasePipe, DatePipe],
  templateUrl: './patient-uploads.html',
  styleUrl: './patient-uploads.css',
})
export class PatientUploads implements OnInit {
  private readonly _radiology = inject(RadiologyService);
  private readonly _profile = inject(PatientProfileService);
  readonly _appts = inject(AppointmentsService);
  private readonly _toast = inject(ToastService);

  readonly categories: ICategory[] = [
    {
      value: 'Prescription',
      label: 'روشتة',
      hint: 'روشتة من طبيب خارجي',
      icon: 'R/',
      accepted: '.jpg,.jpeg,.png,.webp,.pdf',
    },
    {
      value: 'Radiology',
      label: 'أشعة',
      hint: 'صورة أو تقرير أشعة',
      icon: '◎',
      accepted: '.jpg,.jpeg,.png,.webp,.pdf,.dcm',
    },
    {
      value: 'LabResult',
      label: 'تحاليل',
      hint: 'نتائج تحاليل معملية',
      icon: '⊞',
      accepted: '.jpg,.jpeg,.png,.webp,.pdf',
    },
    {
      value: 'Video',
      label: 'فيديو',
      hint: 'فيديو جلسة أو أشعة',
      icon: '▶',
      accepted: 'video/*',
    },
    {
      value: 'Other',
      label: 'أخرى',
      hint: 'أي مستند طبي آخر',
      icon: '·',
      accepted: '.jpg,.jpeg,.png,.webp,.pdf',
    },
  ];

  category = signal('Prescription');
  doctorId = signal('');
  title = signal('');
  notes = signal('');
  file = signal<File | null>(null);
  uploading = signal(false);
  loading = signal(false);

  readonly activeCategory = computed(
    () => this.categories.find((c) => c.value === this.category()) ?? this.categories[0],
  );

  readonly acceptedTypes = computed(() => this.activeCategory().accepted);

  readonly uploads = computed(() => this._radiology.patientUploads());

  readonly filtered = computed(() =>
    this.uploads().filter((u) => u.category === this.category()),
  );

  readonly doctorsFromAppointments = computed(() => {
    const map = new Map<string, string>();
    for (const a of this._appts.appointments()) {
      if (!map.has(a.doctorId)) map.set(a.doctorId, a.doctorName);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  ngOnInit(): void {
    this.loading.set(true);
    this._profile.getMine().subscribe({
      next: (p) => {
        this._radiology.loadUploadsByPatient(p.patientId);
        setTimeout(() => this.loading.set(false), 400);
      },
      error: () => this.loading.set(false),
    });

    this._appts.loadMyAppointments();
    setTimeout(() => {
      const doctors = this.doctorsFromAppointments();
      if (doctors.length > 0 && !this.doctorId()) {
        this.doctorId.set(doctors[0].id);
      }
    }, 700);
  }

  setCategory(v: string): void {
    this.category.set(v);
    this.file.set(null);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;

    if (f.size > 100 * 1024 * 1024) {
      this._toast.show('حجم الملف أكبر من 100 ميجا', 'error');
      input.value = '';
      return;
    }

    this.file.set(f);
  }

  removeFile(): void {
    this.file.set(null);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  fileIcon(mimeType: string): string {
    if (!mimeType) return '·';
    if (mimeType.startsWith('image/')) return '◨';
    if (mimeType.startsWith('video/')) return '▶';
    if (mimeType === 'application/pdf') return 'P';
    return '·';
  }

  resolveUrl(path: string): string {
    return this._radiology.resolveUrl(path);
  }

  trackUpload(index: number, item: IRadiologyUpload): number {
    return item.id;
  }

  onUpload(): void {
    const f = this.file();
    if (!f) {
      this._toast.show('اختر ملف أولاً', 'error');
      return;
    }

    if (!this.doctorId()) {
      this._toast.show('حدد الطبيب المرتبط بالملف', 'error');
      return;
    }

    this.uploading.set(true);
    this._radiology
      .uploadFile(
        this.doctorId(),
        null,
        this.category(),
        this.title() || f.name,
        this.activeCategory().label,
        '',
        this.notes(),
        true,
        f,
      )
      .subscribe({
        next: () => {
          this._toast.show('تم رفع الملف بنجاح', 'success');
          this.file.set(null);
          this.title.set('');
          this.notes.set('');

          this._profile.getMine().subscribe({
            next: (p) => this._radiology.loadUploadsByPatient(p.patientId),
          });

          this.uploading.set(false);
        },
        error: (err) => {
          const m = err.error;
          this._toast.show(
            typeof m === 'string' ? m : 'تعذر رفع الملف',
            'error',
          );
          this.uploading.set(false);
        },
      });
  }
}
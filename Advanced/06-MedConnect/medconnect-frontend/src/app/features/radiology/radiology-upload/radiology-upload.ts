import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RadiologyService, IRadiologyRequest } from '../../../core/services/radiology.service';
import { PatientProfileService } from '../../../core/services/patient-profile.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-radiology-upload',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './radiology-upload.html',
  styleUrl: './radiology-upload.css',
})
export class RadiologyUploadPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _radiology = inject(RadiologyService);
  private readonly _profile = inject(PatientProfileService);
  private readonly _appts = inject(AppointmentsService);
  private readonly _toast = inject(ToastService);

  request = signal<IRadiologyRequest | null>(null);
  loading = signal(true);

  title = signal('');
  scanType = signal('');
  bodyPart = signal('');
  notes = signal('');

  selectedFile = signal<File | null>(null);
  uploading = signal(false);

  requestId = signal<number | null>(null);
  doctorId = signal('');

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('requestId');
    const requestId = Number(idParam);
    if (!requestId) {
      this._router.navigate(['/radiology']);
      return;
    }

    this.requestId.set(requestId);

    this._appts.loadMyAppointments();

    setTimeout(() => {
      const apts = this._appts.appointments();
      const anyDoctorId = apts.length > 0 ? apts[0].doctorId : '';
      if (anyDoctorId) this.doctorId.set(anyDoctorId);
    }, 600);

    this._profile.getMine().subscribe({
      next: (p) => this._loadRequest(requestId, p.patientId),
      error: () => {
        this._toast.show('تعذر تحميل بيانات المريض', 'error');
        this.loading.set(false);
      },
    });
  }

  private _loadRequest(requestId: number, patientId: number): void {
    this._radiology.loadRequestsByPatient(patientId);

    setTimeout(() => {
      const list = this._radiology.patientRequests();
      const found = list.find((r) => r.id === requestId);

      if (found) {
        this.request.set(found);
        this.title.set(`${found.scanType} — ${found.bodyPart}`);
        this.scanType.set(found.scanType);
        this.bodyPart.set(found.bodyPart);
      } else {
        this._toast.show('الطلب غير موجود', 'error');
      }

      this.loading.set(false);
    }, 600);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      this._toast.show('حجم الملف أكبر من 100 ميجا', 'error');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  fileIcon(mime: string): string {
    if (!mime) return '·';
    if (mime.startsWith('image/')) return '◨';
    if (mime.startsWith('video/')) return '▶';
    if (mime === 'application/pdf') return 'P';
    return '·';
  }

  onUpload(): void {
    const file = this.selectedFile();
    if (!file) {
      this._toast.show('اختر ملفاً أولاً', 'error');
      return;
    }

    if (!this.doctorId()) {
      this._toast.show('تعذر تحديد الطبيب', 'error');
      return;
    }

    this.uploading.set(true);
    this._radiology
      .uploadFile(
        this.doctorId(),
        this.requestId(),
        'Radiology',
        this.title(),
        this.scanType(),
        this.bodyPart(),
        this.notes(),
        false,
        file,
      )
      .subscribe({
        next: () => {
          this._toast.show('تم رفع الأشعة بنجاح', 'success');
          this._router.navigate(['/radiology']);
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
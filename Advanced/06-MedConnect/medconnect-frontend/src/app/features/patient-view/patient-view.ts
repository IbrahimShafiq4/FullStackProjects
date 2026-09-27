import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PatientProfileService, IPatientProfile } from '../../core/services/patient-profile.service';
import { MedicalRecordsService, IMedicalRecord } from '../../core/services/medical-records.service';
import { RadiologyService, IRadiologyUpload, IRadiologyRequest } from '../../core/services/radiology.service';

@Component({
  selector: 'app-patient-view',
  imports: [RouterLink, DatePipe],
  templateUrl: './patient-view.html',
  styleUrl: './patient-view.css',
})
export class PatientView implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  readonly _profile = inject(PatientProfileService);
  readonly _records = inject(MedicalRecordsService);
  readonly _radiology = inject(RadiologyService);

  profile = signal<IPatientProfile | null>(null);
  records = signal<IMedicalRecord[]>([]);
  uploads = signal<IRadiologyUpload[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('patientId');
    const patientId = Number(idParam);
    if (!patientId) return;

    this._profile.getById(patientId).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this._records.loadByPatient(patientId);
    this._radiology.loadUploadsByPatient(patientId);

    setTimeout(() => {
      this.records.set(this._records.patientRecords());
      this.uploads.set(this._radiology.patientUploads());
    }, 500);
  }

  photoUrl(): string {
    return this._profile.resolveUrl(this.profile()?.photoUrl ?? '');
  }

  uploadUrl(path: string): string {
    return this._radiology.resolveUrl(path);
  }

  age(): number | null {
    const dob = this.profile()?.dateOfBirth;
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Pending': return 'قيد الانتظار';
      case 'InProgress': return 'قيد التنفيذ';
      case 'Completed': return 'مكتمل';
      case 'Cancelled': return 'ملغي';
      default: return s;
    }
  }
}
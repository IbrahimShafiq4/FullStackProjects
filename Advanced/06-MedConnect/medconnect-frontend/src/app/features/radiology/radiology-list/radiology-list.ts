import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RadiologyService, IRadiologyUpload, IRadiologyRequest } from '../../../core/services/radiology.service';
import { PatientProfileService } from '../../../core/services/patient-profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-radiology-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './radiology-list.html',
  styleUrl: './radiology-list.css',
})
export class RadiologyList implements OnInit {
  readonly _radiology = inject(RadiologyService);
  readonly _profile = inject(PatientProfileService);
  readonly _auth = inject(AuthService);

  tab = signal<'uploads' | 'requests'>('uploads');

  readonly isPatient = computed(() => this._auth.currentUser()?.role === 'Patient');
  readonly isDoctor = computed(() => this._auth.currentUser()?.role === 'Doctor');

  ngOnInit(): void {
    this._profile.getMine().subscribe({
      next: (p) => {
        this._radiology.loadUploadsByPatient(p.patientId);
        this._radiology.loadRequestsByPatient(p.patientId);
      },
    });
  }

  setTab(t: 'uploads' | 'requests'): void {
    this.tab.set(t);
  }

  openFile(path: string): string {
    return this._radiology.resolveUrl(path);
  }

  requestStatusLabel(s: string): string {
    switch (s) {
      case 'Pending': return 'قيد الانتظار';
      case 'Fulfilled': return 'تم الرفع';
      case 'Cancelled': return 'ملغي';
      default: return s;
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentsService, IDoctor } from '../../../core/services/appointments.service';
import { RadiologyService } from '../../../core/services/radiology.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DoctorProfileService, IDoctorProfile } from '../../../doctor-profile.service';

interface ITimeChip {
  value: string;
  iso: string;
  booked: boolean;
}

interface IDayGroup {
  dateKey: string;
  dateLabel: string;
  dayLabel: string;
  isToday: boolean;
  isTomorrow: boolean;
  times: ITimeChip[];
  availableCount: number;
}

interface IAttachedFile {
  file: File;
  category: string;
  title: string;
  notes: string;
}

@Component({
  selector: 'app-book-appointment',
  imports: [FormsModule, RouterLink],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {
  readonly _appointments = inject(AppointmentsService);
  private readonly _radiology = inject(RadiologyService);
  private readonly _profiles = inject(DoctorProfileService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  readonly dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  readonly categories = [
    { value: 'Prescription', label: 'روشتة', icon: 'R/', hint: 'روشتة من طبيب خارجي' },
    { value: 'Radiology',    label: 'أشعة',   icon: '◎',  hint: 'صورة أو تقرير أشعة' },
    { value: 'LabResult',    label: 'تحاليل', icon: '⊞',  hint: 'نتائج تحاليل معملية' },
    { value: 'Video',        label: 'فيديو',  icon: '▶',  hint: 'فيديو جلسة أو أشعة' },
    { value: 'Other',        label: 'أخرى',   icon: '·',  hint: 'أي مستند طبي آخر' },
  ];

  readonly paymentMethods = [
    { value: 'Card',         label: 'بطاقة بنكية',    desc: 'Visa / Mastercard',        icon: '▣' },
    { value: 'OnlineWallet', label: 'محفظة إلكترونية', desc: 'Vodafone / Etisalat Cash', icon: '◈' },
    { value: 'BankTransfer', label: 'تحويل بنكي',     desc: 'InstaPay / Bank Transfer', icon: '⇄' },
  ];

  selectedDoctorId = signal('');
  selectedIso = signal('');
  specialtyFilter = signal('');
  complaint = signal('');
  busy = signal(false);

  attachedFiles = signal<IAttachedFile[]>([]);
  attachCategory = signal('Prescription');
  attachTitle = signal('');
  attachNotes = signal('');

  payOnline = signal(true);
  paymentMethod = signal('Card');

  doctorProfile = signal<IDoctorProfile | null>(null);

  readonly selectedDoctor = computed<IDoctor | undefined>(() =>
    this._appointments.doctors().find((d) => d.id === this.selectedDoctorId()),
  );

  readonly specialtyList = computed(() => {
    const set = new Set<string>();
    this._appointments.doctors().forEach((d) => {
      if (d.specialty) set.add(d.specialty);
    });
    return Array.from(set).sort();
  });

  readonly filteredDoctors = computed(() => {
    const f = this.specialtyFilter().trim();
    const all = this._appointments.doctors();
    return f ? all.filter((d) => d.specialty === f) : all;
  });

  readonly examFee = computed(() => this.doctorProfile()?.examinationFee ?? 0);
  readonly currency = computed(() => this.doctorProfile()?.currency ?? 'EGP');
  readonly hasFee = computed(() => this.examFee() > 0);

  private bookedIsoSet = computed(() => {
    const set = new Set<number>();
    const now = Date.now();
    for (const s of this._appointments.bookedSlots()) {
      const t = new Date(s.scheduledAt).getTime();
      if (t >= now - 60 * 60 * 1000) {
        const rounded = new Date(s.scheduledAt);
        rounded.setSeconds(0, 0);
        rounded.setMinutes(rounded.getMinutes() - (rounded.getMinutes() % 30));
        set.add(rounded.getTime());
      }
    }
    return set;
  });

  readonly dayGroups = computed<IDayGroup[]>(() => {
    const slots = this._appointments.doctorSlots();
    if (slots.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const booked = this.bookedIsoSet();

    const groups: IDayGroup[] = [];

    for (let i = 0; i < 14; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dow = day.getDay();

      const daySlots = slots.filter((s) => s.dayOfWeek === dow);
      if (daySlots.length === 0) continue;

      const times: ITimeChip[] = [];
      let available = 0;

      for (const slot of daySlots) {
        const start = this.toMinutes(slot.startTime);
        const end = this.toMinutes(slot.endTime);
        for (let m = start; m < end; m += 30) {
          const hh = Math.floor(m / 60);
          const mm = m % 60;
          const value = `${this.pad(hh)}:${this.pad(mm)}`;

          const isoDate = new Date(day);
          isoDate.setHours(hh, mm, 0, 0);
          if (isoDate.getTime() <= now.getTime()) continue;

          const isBooked = booked.has(isoDate.getTime());
          if (!isBooked) available++;

          times.push({ value, iso: isoDate.toISOString(), booked: isBooked });
        }
      }

      if (times.length === 0) continue;

      groups.push({
        dateKey: this.dateKey(day),
        dateLabel: this.dateLabel(day),
        dayLabel: this.dayNames[dow],
        isToday: i === 0,
        isTomorrow: i === 1,
        times,
        availableCount: available,
      });
    }

    return groups;
  });

  readonly selectedLabel = computed(() => {
    const iso = this.selectedIso();
    if (!iso) return '';
    const d = new Date(iso);
    const dow = d.getDay();
    return `${this.dayNames[dow]} · ${this.dateLabel(d)} · ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  });

  readonly attachCategoryLabel = computed(() => {
    const c = this.categories.find((x) => x.value === this.attachCategory());
    return c ? c.label : '';
  });

  constructor() {
    effect(() => {
      const id = this.selectedDoctorId();
      if (!id) {
        this._appointments.clearDoctorSlots();
        this.selectedIso.set('');
        this.doctorProfile.set(null);
        return;
      }
      this._appointments.loadDoctorSlots(id);
      this._appointments.loadBookedSlots(id);
      this._profiles.getProfile(id).subscribe({
        next: (p) => this.doctorProfile.set(p),
      });
      this.selectedIso.set('');
    });
  }

  ngOnInit(): void {
    this._appointments.loadDoctors();
  }

  onSpecialtyFilter(value: string): void {
    this.specialtyFilter.set(value);
    this._appointments.loadDoctors(value || undefined);
  }

  pickDoctor(id: string): void {
    this.selectedDoctorId.set(id);
  }

  pickTime(iso: string, booked: boolean): void {
    if (booked) return;
    this.selectedIso.set(iso);
  }

  onAttachFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;

    if (f.size > 100 * 1024 * 1024) {
      this._toast.show('حجم الملف أكبر من 100 ميجا', 'error');
      input.value = '';
      return;
    }

    const cat = this.categories.find((c) => c.value === this.attachCategory());
    this.attachedFiles.update((list) => [
      ...list,
      {
        file: f,
        category: this.attachCategory(),
        title: this.attachTitle() || f.name,
        notes: this.attachNotes(),
      },
    ]);

    this.attachTitle.set('');
    this.attachNotes.set('');
    input.value = '';
    this._toast.show(`تم إرفاق ${cat?.label ?? 'ملف'}`, 'success');
  }

  removeAttached(index: number): void {
    this.attachedFiles.update((list) => list.filter((_, i) => i !== index));
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

  onBook(): void {
    const doctorId = this.selectedDoctorId();
    const iso = this.selectedIso();

    if (!doctorId || !iso) {
      this._toast.show('اختر الطبيب والوقت', 'error');
      return;
    }

    if (this.hasFee() && this.payOnline() && !this.paymentMethod()) {
      this._toast.show('اختر طريقة الدفع', 'error');
      return;
    }

    this.busy.set(true);
    this._appointments
      .bookAppointment(
        doctorId,
        iso,
        this.complaint(),
        this.payOnline() ? this.paymentMethod() : null,
        this.payOnline() && this.hasFee(),
      )
      .subscribe({
        next: (res) => {
          this.uploadAttachedFiles(res.id, doctorId, res.invoiceId);
        },
        error: (err: HttpErrorResponse) => {
          const m = err.error;
          this._toast.show(
            typeof m === 'string' ? m : Array.isArray(m) ? m[0] : 'فشل الحجز',
            'error',
          );
          this.busy.set(false);
        },
      });
  }

  private uploadAttachedFiles(
    appointmentId: number,
    doctorId: string,
    invoiceId: number,
  ): void {
    const files = this.attachedFiles();

    if (files.length === 0) {
      this.finishBooking(invoiceId);
      return;
    }

    let completed = 0;
    let failed = 0;

    for (const f of files) {
      this._radiology
        .uploadFile(
          doctorId,
          null,
          f.category,
          f.title,
          f.category,
          '',
          f.notes,
          true,
          f.file,
        )
        .subscribe({
          next: () => {
            completed++;
            if (completed + failed === files.length) {
              this.showUploadSummary(completed, failed);
              this.finishBooking(invoiceId);
            }
          },
          error: () => {
            failed++;
            if (completed + failed === files.length) {
              this.showUploadSummary(completed, failed);
              this.finishBooking(invoiceId);
            }
          },
        });
    }
  }

  private showUploadSummary(completed: number, failed: number): void {
    if (failed === 0) {
      this._toast.show(`تم رفع ${completed} ملف بنجاح`, 'success');
    } else if (completed === 0) {
      this._toast.show('تعذر رفع الملفات', 'error');
    } else {
      this._toast.show(`تم رفع ${completed} من ${completed + failed} ملف`, 'info');
    }
  }

  private finishBooking(invoiceId: number): void {
    this._toast.show('تم حجز الموعد بنجاح', 'success');

    const shouldPayOnline = this.payOnline() && this.hasFee();
    const doctorId = this.selectedDoctorId();

    // reset
    this.attachedFiles.set([]);
    this.selectedIso.set('');
    this.complaint.set('');
    this.busy.set(false);

    if (doctorId) {
      this._appointments.loadDoctorSlots(doctorId);
      this._appointments.loadBookedSlots(doctorId);
    }

    // Navigate — payment first if online, else invoice
    if (shouldPayOnline) {
      this._router.navigate(['/payment', invoiceId]);
    } else {
      this._router.navigate(['/invoices', invoiceId]);
    }
  }

  initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('');
  }

  private toMinutes(t: string): number {
    const parts = t.split(':');
    const h = Number(parts[0] ?? 0);
    const m = Number(parts[1] ?? 0);
    return h * 60 + m;
  }

  private pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private dateKey(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  }

  private dateLabel(d: Date): string {
    return `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}`;
  }
}
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationsService, Applicant } from '../../../core/services/applications.service';
import { JobsService } from '../../../core/services/jobs.service';
import { ToastService } from '../../../shared/services/toast.service';

type StatusFilter = 'all' | 'Pending' | 'Reviewd' | 'Accepted' | 'Rejected';

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-applicants.html',
  styleUrl: './job-applicants.css',
})
export class JobApplicants implements OnInit {
  private route = inject(ActivatedRoute);
  private appsSvc = inject(ApplicationsService);
  private jobsSvc = inject(JobsService);
  private toast = inject(ToastService);

  jobId = signal<number>(0);
  readonly applicants = this.appsSvc.applicants;
  readonly loading = this.appsSvc.loading;
  readonly error = this.appsSvc.error;

  readonly filter = signal<StatusFilter>('all');
  readonly updatingId = signal<number | null>(null);

  readonly job = computed(() => this.jobsSvc.findById(this.jobId()));

  readonly filtered = computed(() => {
    const f = this.filter();
    const list = this.applicants();
    if (f === 'all') return list;
    return list.filter((a) => a.status === f);
  });

  readonly stats = computed(() => {
    const list = this.applicants();
    return {
      total: list.length,
      high: list.filter((a) => a.matchScore >= 80).length,
      shortlisted: list.filter((a) => a.status === 'Accepted').length,
      pending: list.filter((a) => a.status === 'Pending').length,
    };
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.jobId.set(id);

    // Prime job cache if it's empty
    if (this.jobsSvc.jobs().length === 0) {
      await this.jobsSvc.load();
    }
    await this.appsSvc.loadApplicants(id);
  }

  async updateStatus(a: Applicant, status: 'Reviewd' | 'Accepted' | 'Rejected'): Promise<void> {
    if (this.updatingId() === a.id) return;
    this.updatingId.set(a.id);
    try {
      await this.appsSvc.updateStatus(a.id, status);
      const label = status === 'Accepted' ? 'قائمة مختصرة'
        : status === 'Rejected' ? 'مرفوض'
          : 'قيد المراجعة';
      this.toast.show(`تم تحديث حالة ${a.candidateName}: ${label}`, 'success');
    } catch {
      this.toast.show('تعذّر تحديث الحالة.', 'error');
    } finally {
      this.updatingId.set(null);
    }
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Pending': return 'قيد الانتظار';
      case 'Reviewd': return 'قيد المراجعة';
      case 'Accepted': return 'قائمة مختصرة';
      case 'Rejected': return 'مرفوض';
      default: return s;
    }
  }

  matchClass(score: number): string {
    if (score >= 80) return 'text-signal';
    if (score >= 50) return 'text-route-amber';
    return 'text-concrete';
  }

  trackById(_: number, a: Applicant): number { return a.id; }
}
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, catchError, map } from 'rxjs';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { ToastService } from '../../../shared/services/toast.service';

interface JobWithCounts {
  job: Job;
  total: number;
  high: number;
}

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class EmployerJobs implements OnInit {
  private jobsSvc = inject(JobsService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private readonly API = 'https://localhost:7067/api';

  private _rows = signal<JobWithCounts[]>([]);
  readonly rows = this._rows.asReadonly();

  readonly loading = this.jobsSvc.loading;
  readonly error = this.jobsSvc.error;

  readonly confirmingId = signal<number | null>(null);

  readonly totalCount = computed(() => this._rows().length);
  readonly totalApps = computed(() =>
    this._rows().reduce((s, r) => s + r.total, 0)
  );

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    await this.jobsSvc.load();
    const jobs = this.jobsSvc.jobs();
    if (jobs.length === 0) {
      this._rows.set([]);
      return;
    }

    const calls = jobs.map((job) =>
      this.http
        .get<{ matchScore: number }[]>(`${this.API}/applications/job/${job.id}`)
        .pipe(
          map((apps): JobWithCounts => ({
            job,
            total: apps.length,
            high: apps.filter((a) => a.matchScore >= 80).length,
          })),
          catchError(() => of<JobWithCounts>({ job, total: 0, high: 0 }))
        )
    );

    const result = await new Promise<JobWithCounts[]>((resolve) => {
      forkJoin(calls).subscribe((list) => resolve(list));
    });
    this._rows.set(result);
  }

  askDelete(id: number): void {
    this.confirmingId.set(id);
  }

  cancelDelete(): void {
    this.confirmingId.set(null);
  }

  async confirmDelete(id: number): Promise<void> {
    try {
      await this.jobsSvc.remove(id);
      this._rows.update((list) => list.filter((r) => r.job.id !== id));
      this.toast.show('تم حذف الوجهة.', 'success');
    } catch {
      this.toast.show('تعذّر حذف الوجهة.', 'error');
    } finally {
      this.confirmingId.set(null);
    }
  }
}
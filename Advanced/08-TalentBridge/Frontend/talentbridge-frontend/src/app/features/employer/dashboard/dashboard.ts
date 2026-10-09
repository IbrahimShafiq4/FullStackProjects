import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { AuthService } from '../../../core/services/auth.service';

interface ApplicantRow {
  id: number;
  candidateId: string;
  matchScore: number;
  status: string;
  appliedAt: string;
}

interface JobStat {
  job: Job;
  total: number;
  high: number;   
  shortlist: number; 
  interviews: number;
}

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class EmployerDashboard implements OnInit {
  public auth = inject(AuthService);
  private jobsSvc = inject(JobsService);
  private http = inject(HttpClient);

  private readonly API = 'https://localhost:7067/api';

  readonly jobs = this.jobsSvc.jobs;
  readonly loading = this.jobsSvc.loading;
  readonly error = this.jobsSvc.error;

  private _stats = signal<JobStat[]>([]);
  readonly stats = this._stats.asReadonly();

  readonly totals = computed(() => {
    const rows = this._stats();
    return {
      jobs: rows.length,
      applications: rows.reduce((s, r) => s + r.total, 0),
      highMatch: rows.reduce((s, r) => s + r.high, 0),
      shortlisted: rows.reduce((s, r) => s + r.shortlist, 0),
    };
  });

  async ngOnInit(): Promise<void> {
    await this.jobsSvc.load();
    await this.loadStats();
  }

  private async loadStats(): Promise<void> {
    const mine = this.jobs().slice(0, 20);
    if (mine.length === 0) {
      this._stats.set([]);
      return;
    }

    const calls = mine.map((job) =>
      this.http
        .get<ApplicantRow[]>(`${this.API}/applications/job/${job.id}`)
        .pipe(
          map((rows): JobStat => ({
            job,
            total: rows.length,
            high: rows.filter((r) => r.matchScore >= 80).length,
            shortlist: rows.filter((r) => r.status === 'Accepted').length,
            interviews: rows.filter((r) => r.status === 'Reviewd').length,
          })),
          catchError(() =>
            of<JobStat>({
              job,
              total: 0,
              high: 0,
              shortlist: 0,
              interviews: 0,
            })
          )
        )
    );

    const result = await new Promise<JobStat[]>((resolve) => {
      forkJoin(calls).subscribe((list) => resolve(list));
    });

    this._stats.set(result);
  }

  trackJob(_: number, s: JobStat): number {
    return s.job.id;
  }

  activityLevel(s: JobStat): 'quiet' | 'moving' | 'busy' {
    if (s.total === 0) return 'quiet';
    if (s.total < 5) return 'moving';
    return 'busy';
  }
}
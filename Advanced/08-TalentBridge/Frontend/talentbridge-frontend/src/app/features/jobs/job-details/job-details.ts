import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

interface MatchBreakdownRow {
  skill: string;
  importance: 'MustHave' | 'NiceToHave';
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private jobsSvc = inject(JobsService);
  private appsSvc = inject(ApplicationsService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private http = inject(HttpClient);

  private readonly API = 'https://localhost:7067/api';

  readonly job = signal<Job | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly applying = signal(false);
  readonly applied = signal(false);
  readonly matchResult = signal<number | null>(null);

  readonly isCandidate = this.auth.isCandidate;
  readonly isEmployer = this.auth.isEmployer;

  readonly requirementRows = computed<MatchBreakdownRow[]>(() => {
    const j = this.job();
    if (!j) return [];
    const must = j.mustHaveSkills.map((s) => ({
      skill: s,
      importance: 'MustHave' as const,
    }));
    const nice = j.niceToHaveSkills.map((s) => ({
      skill: s,
      importance: 'NiceToHave' as const,
    }));
    return [...must, ...nice];
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    await this.jobsSvc.load();
    const found = this.jobsSvc.findById(id);

    if (!found) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.job.set(found);
    this.loading.set(false);
  }

  async apply(): Promise<void> {
    const j = this.job();
    if (!j || this.applying()) return;

    this.applying.set(true);
    try {
      const res = await this.appsSvc.apply(j.id);
      this.matchResult.set(res.matchScore);
      this.applied.set(true);
      this.toast.show(
        `تم إرسال الرحلة. نسبة التوافق ${res.matchScore}%`,
        'success'
      );
    } catch (err: any) {
      const msg =
        typeof err?.error === 'string'
          ? err.error
          : err?.error?.message ?? 'تعذّر إتمام التقديم.';
      this.toast.show(msg, 'error');
    } finally {
      this.applying.set(false);
    }
  }

  matchTone(score: number): 'hot' | 'warm' | 'cold' {
    if (score >= 80) return 'hot';
    if (score >= 50) return 'warm';
    return 'cold';
  }
}
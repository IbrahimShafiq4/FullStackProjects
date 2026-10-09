import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { RouteLine } from '../../../shared/components/route-line/route-line';

interface RecommendedJob {
  job: Job;
  matchScore: number;
}

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteLine],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class CandidateDashboard implements OnInit {
  public auth = inject(AuthService);
  private jobsSvc = inject(JobsService);
  public notifSvc = inject(NotificationsService);

  readonly loading = this.jobsSvc.loading;
  readonly error = this.jobsSvc.error;

  readonly recommended = signal<RecommendedJob[]>([]);
  readonly hasProfile = signal(false);

  readonly journeyStages = [
    { code: 'PRO', label: 'الملف جاهز' },
    { code: 'APL', label: 'التقديم' },
    { code: 'REV', label: 'مراجعة' },
    { code: 'ITV', label: 'مقابلة' },
    { code: 'OFR', label: 'عرض' },
    { code: 'HIR', label: 'تعيين' },
  ];

  readonly journeyStations = computed(() =>
    this.journeyStages.map((s, i) => ({
      code: s.code,
      label: s.label,
      active: i === 0,
      current: i === 0,
    }))
  );

  readonly firstName = computed(() => {
    const name = this.auth.currentUser()?.fullName ?? '';
    return name.split(' ')[0] ?? '';
  });

  async ngOnInit(): Promise<void> {
    await this.jobsSvc.load();
    this.notifSvc.load(true);
    this.computeRecommended();
  }

  private computeRecommended(): void {
    const jobs = this.jobsSvc.jobs().slice(0, 4);
    const rows: RecommendedJob[] = jobs.map((job) => ({
      job,
      matchScore: 0,
    }));
    this.recommended.set(rows);
  }
}
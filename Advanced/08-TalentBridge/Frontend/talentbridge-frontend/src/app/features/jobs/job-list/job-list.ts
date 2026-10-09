import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { AuthService } from '../../../core/services/auth.service';

type SortKey = 'recent' | 'title';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList implements OnInit {
  private jobsSvc = inject(JobsService);
  public auth = inject(AuthService);

  readonly loading = this.jobsSvc.loading;
  readonly error = this.jobsSvc.error;

  readonly query = signal('');
  readonly workMode = signal<'all' | 'OnSite' | 'Hybrid' | 'Remote'>('all');
  readonly skillFilter = signal<string | null>(null);
  readonly sort = signal<SortKey>('recent');

  readonly allSkills = computed(() => {
    const set = new Set<string>();
    for (const j of this.jobsSvc.jobs()) {
      for (const s of j.mustHaveSkills) set.add(s);
    }
    return Array.from(set).sort();
  });

  readonly results = computed<Job[]>(() => {
    const q = this.query().trim().toLowerCase();
    const mode = this.workMode();
    const skill = this.skillFilter();
    const sortKey = this.sort();

    let list = this.jobsSvc.jobs();

    if (q) {
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.employerName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.mustHaveSkills.some((s) => s.toLowerCase().includes(q)) ||
          j.niceToHaveSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (mode !== 'all') {
      list = list.filter((j) => j.workMode === mode);
    }

    if (skill) {
      list = list.filter(
        (j) =>
          j.mustHaveSkills.includes(skill) ||
          j.niceToHaveSkills.includes(skill)
      );
    }

    if (sortKey === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    // 'recent' — already sorted desc by backend

    return list;
  });

  readonly isEmployer = this.auth.isEmployer;
  readonly isCandidate = this.auth.isCandidate;

  async ngOnInit(): Promise<void> {
    await this.jobsSvc.load();
  }

  clearAll(): void {
    this.query.set('');
    this.workMode.set('all');
    this.skillFilter.set(null);
    this.sort.set('recent');
  }

  setSkill(skill: string): void {
    this.skillFilter.set(this.skillFilter() === skill ? null : skill);
  }

  workModeLabel(mode: string): string {
    switch (mode) {
      case 'OnSite': return 'من المكتب';
      case 'Hybrid': return 'هجين';
      case 'Remote': return 'عن بُعد';
      default: return mode;
    }
  }

  salaryLabel(j: Job): string {
    if (j.salaryMin && j.salaryMax)
      return `${j.salaryMin}–${j.salaryMax}K`;
    if (j.salaryMin) return `من ${j.salaryMin}K`;
    if (j.salaryMax) return `حتى ${j.salaryMax}K`;
    return '—';
  }

  anyFilterActive(): boolean {
    return !!(this.query() || this.workMode() !== 'all' || this.skillFilter());
  }
}
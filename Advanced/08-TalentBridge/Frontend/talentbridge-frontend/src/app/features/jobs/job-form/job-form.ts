import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobsService, WorkMode } from '../../../core/services/jobs.service';
import { ToastService } from '../../../shared/services/toast.service';

interface SkillReq {
  skillName: string;
  importance: 'MustHave' | 'NiceToHave';
}

type Step = 1 | 2 | 3;

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  private jobsSvc = inject(JobsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly step = signal<Step>(1);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  // Step 1
  title = signal('');
  description = signal('');
  location = signal('');
  workMode = signal<WorkMode>('OnSite');

  // Step 2
  skills = signal<SkillReq[]>([{ skillName: '', importance: 'MustHave' }]);

  // Step 3
  salaryMin = signal<number | null>(null);
  salaryMax = signal<number | null>(null);

  readonly mustHaveSkills = computed(() =>
    this.skills().filter((s) => s.importance === 'MustHave' && s.skillName.trim())
  );
  readonly niceToHaveSkills = computed(() =>
    this.skills().filter((s) => s.importance === 'NiceToHave' && s.skillName.trim())
  );
  readonly validSkillsCount = computed(() =>
    this.skills().filter((s) => s.skillName.trim()).length
  );

  readonly canContinueStep1 = computed(() => this.title().trim().length >= 3);
  readonly canContinueStep2 = computed(() => this.validSkillsCount() >= 1);

  goTo(s: Step): void {
    if (s === 2 && !this.canContinueStep1()) return;
    if (s === 3 && !this.canContinueStep2()) return;
    this.step.set(s);
    this.error.set(null);
  }

  next(): void {
    const s = this.step();
    if (s === 1 && this.canContinueStep1()) this.step.set(2);
    else if (s === 2 && this.canContinueStep2()) this.step.set(3);
  }

  back(): void {
    const s = this.step();
    if (s === 2) this.step.set(1);
    else if (s === 3) this.step.set(2);
  }

  // Skills
  addSkill(): void {
    this.skills.update((list) => [...list, { skillName: '', importance: 'MustHave' }]);
  }

  removeSkill(i: number): void {
    this.skills.update((list) => list.filter((_, idx) => idx !== i));
  }

  updateSkillName(i: number, value: string): void {
    this.skills.update((list) =>
      list.map((s, idx) => (idx === i ? { ...s, skillName: value } : s))
    );
  }

  updateSkillImportance(i: number, value: 'MustHave' | 'NiceToHave'): void {
    this.skills.update((list) =>
      list.map((s, idx) => (idx === i ? { ...s, importance: value } : s))
    );
  }

  updateSkillKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      // Focus stays; user can tab to next. Add convenience if on last empty row:
      const list = this.skills();
      const last = list[list.length - 1];
      if (last && !last.skillName.trim()) return;
      this.addSkill();
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('[data-skill-input]');
        inputs[inputs.length - 1]?.focus();
      }, 0);
    }
  }

  async publish(): Promise<void> {
    if (!this.canContinueStep1() || !this.canContinueStep2()) {
      this.error.set('أكمل الخطوات المطلوبة قبل النشر.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    try {
      const id = await this.jobsSvc.create({
        title: this.title().trim(),
        description: this.description().trim(),
        location: this.location().trim(),
        workMode: this.workMode(),
        salaryMin: this.salaryMin(),
        salaryMax: this.salaryMax(),
        requiredSkills: this.skills()
          .filter((s) => s.skillName.trim())
          .map((s) => ({ skillName: s.skillName.trim(), importance: s.importance })),
      });
      this.toast.show('تم فتح الوجهة ونشرها.', 'success');
      this.router.navigate(['/jobs', id]);
    } catch (err: any) {
      const msg =
        typeof err?.error === 'string'
          ? err.error
          : err?.error?.message ?? 'تعذّر نشر الوجهة.';
      this.error.set(msg);
    } finally {
      this.submitting.set(false);
    }
  }

  workModeLabel(m: WorkMode): string {
    return m === 'OnSite' ? 'من المكتب' : m === 'Hybrid' ? 'هجين' : 'عن بُعد';
  }
}
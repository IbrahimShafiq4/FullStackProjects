import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatesService } from '../../../core/services/candidates.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  public auth = inject(AuthService);
  private candidatesSvc = inject(CandidatesService);
  private toast = inject(ToastService);

  bio = signal('');
  skillsInput = signal('');
  skills = signal<string[]>([]);
  submitting = signal(false);
  loading = signal(true);
  savedAt = signal<Date | null>(null);

  async ngOnInit(): Promise<void> {
    const p = await this.candidatesSvc.loadProfile();
    if (p) {
      this.bio.set(p.bio ?? '');
      this.skills.set(p.skills ?? []);
    }
    this.loading.set(false);
  }

  addSkill(raw: string): void {
    const value = raw.trim();
    if (!value) return;
    if (value.length > 40) return;
    if (this.skills().some((s) => s.toLowerCase() === value.toLowerCase())) {
      this.skillsInput.set('');
      return;
    }
    this.skills.update((list) => [...list, value]);
    this.skillsInput.set('');
  }

  removeSkill(skill: string): void {
    this.skills.update((list) => list.filter((s) => s !== skill));
  }

  onSkillsKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ',') {
      ev.preventDefault();
      this.addSkill(this.skillsInput());
    } else if (
      ev.key === 'Backspace' &&
      !this.skillsInput() &&
      this.skills().length
    ) {
      const last = this.skills()[this.skills().length - 1];
      this.removeSkill(last);
    }
  }

  async save(): Promise<void> {
    const bio = this.bio().trim();
    const skills = this.skills();

    if (!bio && skills.length === 0) {
      this.toast.show('أضف نبذة أو مهارة واحدة على الأقل.', 'error');
      return;
    }

    this.submitting.set(true);
    try {
      await this.candidatesSvc.updateProfile({ bio, skills });
      this.savedAt.set(new Date());
      this.toast.show('تم تحديث الجواز المهني.', 'success');
    } catch {
      this.toast.show('تعذّر تحديث الملف.', 'error');
    } finally {
      this.submitting.set(false);
    }
  }

  readonly user = this.auth.currentUser;
}
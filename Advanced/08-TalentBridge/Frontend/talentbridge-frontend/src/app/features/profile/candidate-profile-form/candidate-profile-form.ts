import { Component, inject, signal, WritableSignal } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [],
  selector: 'app-candidate-profile-form',
  styleUrl: './candidate-profile-form.css',
  templateUrl: './candidate-profile-form.html',
})
export class CandidateProfileForm {
  private _JobsService: JobsService = inject(JobsService);
  private _ToastService: ToastService = inject(ToastService);

  bio: WritableSignal<string> = signal<string>('');
  skillsInput: WritableSignal<string> = signal<string>('');

  onSubmit(): void {
    const skills = this.skillsInput().split(',').map((s) => s.trim()).filter(Boolean);
    this._JobsService.updateProfile(this.bio(), skills).subscribe({
      next: () => this._ToastService.show('تم تحديث البروفايل', 'success')
    })
  }
}

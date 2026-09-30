import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { JobsService } from '../../../core/services/jobs.service';
import { ToastService } from '../../../shared/services/toast.service';

interface ISkillReq {
  skillName: string;
  importance: string;
}

@Component({
  imports: [FormField, FormsModule],
  selector: 'app-job-form',
  styleUrl: './job-form.css',
  templateUrl: './job-form.html',
})
export class JobForm {
  private _JobsService: JobsService = inject(JobsService);
  private _ToastService: ToastService = inject(ToastService);

  jobAdded: OutputEmitterRef<void> = output<void>();

  formModel: WritableSignal<{ title: string, description: string }> = signal<{ title: string, description: string }>({ title: '', description: '' })
  jobForm = form(this.formModel, () => { });
  skills: WritableSignal<ISkillReq[]> = signal<ISkillReq[]>([{ skillName: '', importance: 'MustHave' }])

  addSkill() {
    this.skills.update((skills: ISkillReq[]) => [...skills, { skillName: '', importance: 'MustHave' }])
  }

  removeSkill(i: number) {
    this.skills.update((skills: ISkillReq[]) => skills.filter((_, idx) => idx !== i))
  }

  updateSkillName(i: number, name: string) {
    this.skills.update((list) =>
      list.map((s, idx) => (idx === i ? { ...s, skillName: name } : s)
      )
    );
  }

  updateSkillImportance(i: number, importance: string) {
    this.skills.update((list) =>
      list.map((s, idx) => (idx === i ? { ...s, importance } : s)
      )
    );
  }

  onSubmit() {
    const { title, description } = this.formModel();
    const validSkills = this.skills().filter((s) => s.skillName.trim());

    if (!title.trim() || validSkills.length === 0) {
      this._ToastService.show('لازم عنوان الوظيفة ومهارة واحدة على الأقل', 'error');
      return;
    }

    this._JobsService.createJob(title, description, validSkills).subscribe({
      next: () => { this._ToastService.show('تم نشر الوظيفة بنجاح', 'success'); this.jobAdded.emit(); }
    });
  }
}
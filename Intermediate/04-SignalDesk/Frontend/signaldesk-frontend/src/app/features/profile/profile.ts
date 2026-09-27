import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { ToastService } from '../../core/services/toast.service';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, HandwrittenUnderline],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileService = inject(ProfileService);
  private toast = inject(ToastService);

  fullName = signal('');
  currentPassword = signal('');
  newPassword = signal('');

  ngOnInit() {
    this.profileService.load().subscribe({
      next: p => this.fullName.set(p.fullName),
    });
  }

  roleLabel(role: string): string {
    return role === 'Agent' ? 'وكيل دعم' : 'عميل';
  }

  saveProfile() {
    const name = this.fullName().trim();
    if (!name) {
      this.toast.show('الاسم مينفعش يبقى فاضي', 'error');
      return;
    }

    this.profileService.update(name).subscribe({
      next: p => {
        this.profileService.profile.set(p);
        this.toast.show('البيانات اتحدّثت', 'success');
      },
      error: () => this.toast.show('حصل خطأ في الحفظ', 'error'),
    });
  }

  changePassword() {
    const cur = this.currentPassword();
    const nw = this.newPassword();

    if (!cur || !nw) {
      this.toast.show('املا كلمة المرور الحالية والجديدة', 'error');
      return;
    }

    if (nw.length < 6) {
      this.toast.show('كلمة المرور الجديدة ٦ حروف على الأقل', 'error');
      return;
    }

    this.profileService.changePassword(cur, nw).subscribe({
      next: () => {
        this.toast.show('كلمة المرور اتغيّرت', 'success');
        this.currentPassword.set('');
        this.newPassword.set('');
      },
      error: (e) => this.toast.show(e.error?.message ?? 'حصل خطأ', 'error'),
    });
  }
}
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private readonly _profile = inject(ProfileService);
  private readonly _auth = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  protected readonly profile = this._profile.profile;

  // ─── info form ───
  protected infoModel: WritableSignal<{ fullName: string; phoneNumber: string }> =
    signal({ fullName: '', phoneNumber: '' });
  protected infoForm = form(this.infoModel, () => { });
  protected savingInfo: WritableSignal<boolean> = signal(false);

  // ─── password form ───
  protected pwdModel: WritableSignal<{ currentPassword: string; newPassword: string }> =
    signal({ currentPassword: '', newPassword: '' });
  protected pwdForm = form(this.pwdModel, () => { });
  protected savingPwd: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this._profile.load();
    // hydrate info form when loaded
    setTimeout(() => {
      const p = this.profile();
      if (p) this.infoModel.set({ fullName: p.fullName, phoneNumber: p.phoneNumber ?? '' });
    }, 200);
  }

  protected onSaveInfo(): void {
    const { fullName, phoneNumber } = this.infoModel();
    if (!fullName.trim()) {
      this._toast.show('Full name is required.', 'error');
      return;
    }

    this.savingInfo.set(true);
    this._profile.update({ fullName, phoneNumber: phoneNumber || null }).subscribe({
      next: () => {
        this._toast.show('Profile updated.', 'success');
        this._profile.load();
        // update the header display
        this._auth.currentUser.set({ fullName });
        this.savingInfo.set(false);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to update profile.', 'error');
        this.savingInfo.set(false);
      },
    });
  }

  protected onChangePassword(): void {
    const { currentPassword, newPassword } = this.pwdModel();
    if (!currentPassword || !newPassword) {
      this._toast.show('Both password fields are required.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      this._toast.show('New password must be at least 6 characters.', 'error');
      return;
    }

    this.savingPwd.set(true);
    this._profile.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this._toast.show('Password changed.', 'success');
        this.pwdModel.set({ currentPassword: '', newPassword: '' });
        this.savingPwd.set(false);
      },
      error: (err) => {
        const msg = Array.isArray(err.error) ? err.error[0] : 'Failed to change password.';
        this._toast.show(msg, 'error');
        this.savingPwd.set(false);
      },
    });
  }

  protected onLogout(): void {
    this._auth.logout();
  }
}
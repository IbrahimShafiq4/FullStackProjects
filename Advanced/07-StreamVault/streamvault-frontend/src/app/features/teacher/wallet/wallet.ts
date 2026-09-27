import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalletsService } from '../../../core/services/wallets.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ITeacherWallet } from '../../../core/models';

interface IProviderOption {
  name: string;
  icon: string;
  color: string;
  placeholder: string;
}

@Component({
  selector: 'app-teacher-wallet',
  imports: [FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css'
})
export class TeacherWallet implements OnInit {
  public readonly _WalletsService: WalletsService = inject(WalletsService);
  public readonly _ToastService: ToastService = inject(ToastService);

  public wallets: WritableSignal<ITeacherWallet[]> = signal<ITeacherWallet[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public showForm: WritableSignal<boolean> = signal<boolean>(false);
  public isSaving: WritableSignal<boolean> = signal<boolean>(false);
  public editingId: WritableSignal<number | null> = signal<number | null>(null);

  public providers: IProviderOption[] = [
    { name: 'فودافون كاش', icon: '📱', color: '#e60000', placeholder: '01012345678' },
    { name: 'إنستاباي', icon: '💳', color: '#8b3a8b', placeholder: 'username@instapay' },
    { name: 'اتصالات كاش', icon: '📞', color: '#00a651', placeholder: '01112345678' },
    { name: 'أورنج كاش', icon: '🧡', color: '#ff7900', placeholder: '01212345678' },
    { name: 'وي باي', icon: '👛', color: '#7c3aed', placeholder: '01012345678' },
    { name: 'تحويل بنكي', icon: '🏦', color: '#1e3a5c', placeholder: 'IBAN: EG380019...' }
  ];

  public provider: string = 'فودافون كاش';
  public walletNumber: string = '';
  public accountName: string = '';
  public instructions: string = '';
  public isDefault: boolean = false;

  public ngOnInit(): void {
    this._load();
  }

  private _load(): void {
    this._WalletsService.getMyWallets().subscribe({
      next: (data: ITeacherWallet[]) => {
        this.wallets.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  public openAdd(): void {
    this.editingId.set(null);
    this.provider = 'فودافون كاش';
    this.walletNumber = '';
    this.accountName = '';
    this.instructions = '';
    this.isDefault = this.wallets().length === 0;
    this.showForm.set(true);
  }

  public openEdit(w: ITeacherWallet): void {
    this.editingId.set(w.id);
    this.provider = w.provider;
    this.walletNumber = w.walletNumber;
    this.accountName = w.accountName;
    this.instructions = w.instructions;
    this.isDefault = w.isDefault;
    this.showForm.set(true);
  }

  public onCancel(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  public onSubmit(): void {
    if (!this.walletNumber.trim() || !this.accountName.trim()) {
      this._ToastService.show('اكتب رقم المحفظة واسم صاحب الحساب', 'error');
      return;
    }

    this.isSaving.set(true);

    const dto = {
      provider: this.provider,
      walletNumber: this.walletNumber,
      accountName: this.accountName,
      instructions: this.instructions,
      isDefault: this.isDefault
    };

    const editingId = this.editingId();

    if (editingId !== null) {
      this._WalletsService.updateWallet(editingId, dto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this.editingId.set(null);
          this._ToastService.show('تم تحديث طريقة الدفع', 'success');
          this._load();
        },
        error: () => {
          this.isSaving.set(false);
          this._ToastService.show('فشل الحفظ', 'error');
        }
      });
    } else {
      this._WalletsService.addWallet(dto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showForm.set(false);
          this._ToastService.show('تم إضافة طريقة الدفع', 'success');
          this._load();
        },
        error: () => {
          this.isSaving.set(false);
          this._ToastService.show('فشل الحفظ', 'error');
        }
      });
    }
  }

  public onDelete(w: ITeacherWallet): void {
    if (!confirm(`متأكد إنك عايز تمسح طريقة الدفع "${w.provider}"؟`)) return;

    this._WalletsService.deleteWallet(w.id).subscribe({
      next: () => {
        this._ToastService.show('تم حذف طريقة الدفع', 'success');
        this._load();
      },
      error: () => this._ToastService.show('فشل الحذف', 'error')
    });
  }

  public getProviderIcon(provider: string): string {
    const found = this.providers.find((p) => p.name === provider);
    return found?.icon ?? '💰';
  }

  public getProviderColor(provider: string): string {
    const found = this.providers.find((p) => p.name === provider);
    return found?.color ?? '#8b5a2b';
  }

  public getCurrentPlaceholder(): string {
    const found = this.providers.find((p) => p.name === this.provider);
    return found?.placeholder ?? '';
  }
}
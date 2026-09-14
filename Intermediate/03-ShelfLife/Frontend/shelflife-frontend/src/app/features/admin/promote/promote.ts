import { Component, inject, OnInit } from '@angular/core';
import { AdminService, IUser } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
  imports: [],
  selector: 'app-admin-promote',
  templateUrl: './promote.html',
  styles: `
    .pr-page {
      min-height: 100vh;
      padding: 24px 20px 60px;
      direction: rtl;
      background: var(--bg);
      background-image:
        linear-gradient(45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bg-2) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bg-2) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .pr-inner { max-width: 900px; margin: 0 auto; }

    .pr-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--ink);
      flex-wrap: wrap;
    }

    .pr-title {
      font-family: var(--font-pixel-ar);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 4px;
    }

    .pr-sub {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--muted);
      margin: 0;
    }

    .pr-stats {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 17px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--orange);
      letter-spacing: 1px;
    }

    .pr-stats-num { color: var(--gold); font-weight: 700; }

    .pr-list { display: flex; flex-direction: column; gap: 10px; }

    .pr-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      transition: all 0.1s steps(2);
    }

    .pr-user:hover {
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
    }

    .pr-user-admin {
      border-color: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .pr-avatar {
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--surface);
      background: var(--orange);
      border: 2.5px solid var(--ink);
      flex-shrink: 0;
    }

    .pr-user-admin .pr-avatar {
      background: var(--olive);
    }

    .pr-body { flex: 1; min-width: 0; }

    .pr-name {
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 3px;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pr-email {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      margin: 0;
      line-height: 1.4;
      direction: ltr;
      text-align: start;
    }

    .pr-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      font-family: var(--font-pixel-en);
      font-size: 12px;
      letter-spacing: 1px;
      line-height: 1.4;
      border: 2px solid var(--ink);
      background: var(--gold);
      color: var(--ink);
    }

    .pr-badge-you {
      background: var(--orange);
      color: var(--surface);
    }

    .pr-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .pr-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1;
    }

    .pr-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .pr-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 var(--ink);
    }

    .pr-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 2px 2px 0 var(--ink);
    }

    .pr-btn-promote {
      background: var(--olive);
      color: var(--surface);
    }

    .pr-btn-promote:hover {
      background: var(--olive-2);
    }

    .pr-btn-demote {
      background: var(--danger);
      color: var(--surface);
    }

    .pr-btn-demote:hover {
      background: #8a2f24;
    }

    .pr-empty {
      padding: 40px 20px;
      text-align: center;
      border: 3px dashed var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
    }

    .pr-loading {
      padding: 40px 20px;
      text-align: center;
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
    }

    @media (max-width: 640px) {
      .pr-page { padding: 16px 14px 40px; }
      .pr-user { flex-wrap: wrap; }
      .pr-actions { width: 100%; }
      .pr-btn { flex: 1; justify-content: center; }
    }
  `
})
export class Promote implements OnInit {
  private _admin = inject(AdminService);
  private _toast = inject(ToastService);
  private _confirm = inject(ConfirmService);

  public service = this._admin;

  ngOnInit(): void {
    this._admin.loadUsers();
  }

  async promote(user: IUser): Promise<void> {
    const ok = await this._confirm.open({
      title: 'ترقية لأدمن',
      message: `هل تريد ترقية "${user.fullName}" لأدمن؟ سيتمكن من إدارة التحديات والمستخدمين.`,
      confirmText: 'ترقية',
      cancelText: 'إلغاء',
      tone: 'olive'
    });

    if (!ok) return;

    this._admin.promote(user.id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._admin.loadUsers();
      },
      error: (err) => this._toast.show(err.error?.message || 'فشلت الترقية', 'error')
    });
  }

  async demote(user: IUser): Promise<void> {
    const ok = await this._confirm.open({
      title: 'إلغاء صلاحيات الأدمن',
      message: `هل أنت متأكد من إلغاء صلاحيات الأدمن لـ "${user.fullName}"؟ سيفقد الوصول لصفحات الإدارة.`,
      confirmText: 'إلغاء الصلاحيات',
      cancelText: 'رجوع',
      tone: 'danger'
    });

    if (!ok) return;

    this._admin.demote(user.id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._admin.loadUsers();
      },
      error: (err) => this._toast.show(err.error?.message || 'فشل الإلغاء', 'error')
    });
  }

  adminCount(): number {
    return this.service.users().filter(u => u.isAdmin).length;
  }
}
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cpu-zone',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="cpu-zone" dir="rtl">

      <header class="cpu-zone__head">
        <span class="hw-serial">CPU · IDENTITY PROCESSOR</span>
        <h2 class="cpu-zone__title">مُعالج الهوية</h2>
        <p class="cpu-zone__deck">
          كل عملية مصادقة في النظام بتمر من هنا — تسجيل الدخول، إنشاء حساب، وإدارة الجلسة.
        </p>
      </header>

      <!-- Core grid — each core is a sub-feature -->
      <div class="cpu-zone__grid">

        <!-- Core 1: Register -->
        <a class="core" routerLink="/register">
          <span class="core__num hw-serial">CORE · 01</span>
          <span class="core__title">إنشاء حساب</span>
          <span class="core__deck">افتح ورشتك الجديدة.</span>
          <span class="core__led hw-led hw-led--on"></span>
        </a>

        <!-- Core 2: Login -->
        <a class="core" routerLink="/login">
          <span class="core__num hw-serial">CORE · 02</span>
          <span class="core__title">تسجيل الدخول</span>
          <span class="core__deck">ادخل بياناتك للوصول.</span>
          <span class="core__led hw-led hw-led--on"></span>
        </a>

        <!-- Cache: Session -->
        <div class="core core--cache">
          <span class="core__num hw-serial">CACHE · L1</span>
          <span class="core__title">الجلسة الحالية</span>
          @if (auth.currentUser(); as u) {
            <span class="core__deck core__deck--ok">✓ {{ u.storeName }}</span>
          } @else {
            <span class="core__deck">لا يوجد مستخدم مُسجَّل</span>
          }
          <span class="core__led hw-led"
                [class.hw-led--on]="auth.currentUser()"
                [class.hw-led--err]="!auth.currentUser()"></span>
        </div>

        <!-- Registers: logout -->
        <div class="core core--register">
          <span class="core__num hw-serial">REG · FLAGS</span>
          <span class="core__title">الحالة</span>
          <span class="core__deck">
            @if (auth.currentUser()) { مُفعَّل · AUTHENTICATED }
            @else { غير مُفعَّل · GUEST }
          </span>
          @if (auth.currentUser()) {
            <button class="hw-btn hw-btn--ghost hw-btn--sm" (click)="auth.logout()" type="button">خروج</button>
          }
        </div>
      </div>

      <footer class="cpu-zone__foot hw-serial">
        <span>CORES · 02</span>
        <span>CACHE · 01</span>
        <span>REGISTERS · 08</span>
        <span>STATUS · ONLINE</span>
      </footer>
    </div>
  `,
  styles: [`
    .cpu-zone { display: flex; flex-direction: column; gap: 22px; height: 100%; }

    .cpu-zone__head {
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border-hair);
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: right;
    }
    .cpu-zone__title {
      font-family: 'Aref Ruqaa', serif;
      font-size: 30px;
      color: var(--fg-base);
      line-height: 1;
    }
    .cpu-zone__deck {
      font-family: 'Amiri', serif;
      font-style: italic;
      font-size: 14px;
      color: var(--fg-muted);
      max-width: 60ch;
    }

    .cpu-zone__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      flex: 1;
    }

    .core {
      position: relative;
      padding: 20px;
      background: var(--bg-panel-soft);
      border: 2px solid var(--border-strong);
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      transition: all 220ms ease;
      min-height: 160px;
    }
    .core:hover {
      transform: translate(-3px, -3px);
      border-color: var(--accent);
      box-shadow: 4px 4px 0 var(--accent), var(--glow-accent);
    }
    .core--cache, .core--register { cursor: default; }
    .core--cache:hover, .core--register:hover { transform: none; border-color: var(--border-strong); box-shadow: none; }

    .core__num { color: var(--accent); }
    .core__title {
      font-family: 'Amiri', serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--fg-base);
    }
    .core__deck { font-size: 13px; color: var(--fg-muted); }
    .core__deck--ok { color: var(--ok); }
    .core__led { position: absolute; top: 12px; inset-inline-end: 12px; }

    .cpu-zone__foot {
      display: flex;
      gap: 20px;
      padding-top: 12px;
      border-top: 1px solid var(--border-hair);
      color: var(--fg-muted);
      font-size: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
  `],
})
export class CpuZone {
  public auth = inject(AuthService);
}
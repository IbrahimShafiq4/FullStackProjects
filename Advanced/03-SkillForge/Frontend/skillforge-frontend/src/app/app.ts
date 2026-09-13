import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, DynamicPopup, ToastContainer],
    template: `
    <div class="shell">
      @if (showChrome()) {
        <header class="chrome">
          <div class="chrome-in">
            <a routerLink="/" class="brand">
              <span class="brand-mark">SF</span>
              <span class="brand-name">SkillForge</span>
            </a>

            <nav class="nav">
              @if (auth.currentUser()?.role === 'Employer') {
                <a routerLink="/quizzes" class="nav-item">
                  <span class="nav-num">01</span>
                  <span>لوحة التحكم</span>
                </a>
                <a routerLink="/testimonials" class="nav-item">
                  <span class="nav-num">02</span>
                  <span>آراء العملاء</span>
                </a>
              } @else if (auth.currentUser()?.role === 'Candidate') {
                <a routerLink="/candidate/quizzes" class="nav-item">
                  <span class="nav-num">01</span>
                  <span>الاختبارات</span>
                </a>
              }
            </nav>

            <div class="chrome-actions">
              @if (auth.currentUser(); as user) {
                <div class="who">
                  <span class="who-role">{{ user.role === 'Employer' ? 'شركة' : 'مرشح' }}</span>
                  <span class="who-name">{{ user.fullName }}</span>
                </div>
                <button class="btn btn-ghost" (click)="auth.logout()">خروج</button>
              } @else {
                <a routerLink="/login" class="btn btn-ghost">دخول</a>
                <a routerLink="/register" class="btn btn-solid">تسجيل</a>
              }
            </div>
          </div>
        </header>
      }

      <router-outlet />
      <app-toast-container />
      <app-dynamic-popup />
    </div>
  `,
    styles: `
    .shell {
      min-height: 100vh;
      background: var(--paper);
      color: var(--ink);
      font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
      direction: rtl;
    }

    .chrome {
      position: sticky;
      top: 0;
      z-index: 90;
      background: var(--paper);
      border-bottom: 2px solid var(--line);
    }

    .chrome-in {
      max-width: 1280px;
      margin: 0 auto;
      padding: 12px 20px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ink);
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      background: var(--ink);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 15px;
    }

    .brand-name {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-weight: 800;
      font-size: 19px;
      letter-spacing: -0.5px;
    }

    .nav {
      display: flex;
      gap: 6px;
      justify-content: center;
    }

    .nav-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      text-decoration: none;
      color: var(--ink);
      font-size: 14px;
      font-weight: 500;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }

    .nav-item:hover {
      border-color: var(--line);
      background: var(--paper-2);
    }

    .nav-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted);
    }

    .chrome-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .who {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 4px 12px;
      border: 1px solid var(--line);
      background: var(--paper-2);
      line-height: 1.15;
    }

    .who-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .who-name {
      font-size: 13.5px;
      font-weight: 600;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: 2px solid var(--line);
      cursor: pointer;
      transition: all 0.15s ease;
      background: transparent;
      color: var(--ink);
    }

    .btn-solid { background: var(--ink); color: var(--paper); }

    .btn-solid:hover { background: var(--blue); border-color: var(--blue); }

    .btn-ghost:hover { background: var(--ink); color: var(--paper); }

    @media (max-width: 900px) {
      .chrome-in {
        padding: 10px 16px;
        grid-template-columns: auto auto;
        gap: 12px;
      }
      .nav { display: none; }
      .who-name { display: none; }
    }
  `
})
export class App {
    public auth = inject(AuthService);
    private _Router: Router = inject(Router);

    showChrome = signal<boolean>(true);

    constructor() {
        this._Router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
            const url = (e as NavigationEnd).urlAfterRedirects;
            const hide = url === '/' || url.startsWith('/login') || url.startsWith('/register');
            this.showChrome.set(!hide);
        });
    }
}
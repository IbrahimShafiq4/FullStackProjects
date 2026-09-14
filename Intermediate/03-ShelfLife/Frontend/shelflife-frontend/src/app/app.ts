import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth-service';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastContainer, ConfirmDialog],
  template: `
    <div class="shell">

      @if (showNav()) {
      <nav class="top-nav">
        <div class="top-nav-inner">
          <a routerLink="/" class="top-brand">
            <span class="top-brand-mark">SL</span>
            <span class="top-brand-texts">
              <span class="top-brand-name">ShelfLife</span>
              <span class="top-brand-tag">KITCHEN JOURNAL</span>
            </span>
          </a>

          <div class="top-nav-links">
            <a routerLink="/products" class="top-nav-link">مخزوني</a>

            @if (auth.currentUser()) {
            <a routerLink="/testimonial" class="top-nav-link">شاركنا رأيك</a>
            }

            @if (auth.currentUser()?.isAdmin) {
            <a routerLink="/admin/challenges" class="top-nav-link">التحديات</a>
            <a routerLink="/admin/testimonials" class="top-nav-link">الآراء</a>
            <a routerLink="/admin/promote" class="top-nav-link">الأدمن</a>
            }
          </div>

          <div class="top-nav-actions">
            @if (auth.currentUser(); as user) {
            <span class="top-user">
              <span class="top-user-dot"></span>
              <span class="top-user-name">{{ user.fullName }}</span>
              @if (user.isAdmin) {
              <span class="top-user-admin">ADMIN</span>
              }
            </span>
            <button type="button" class="top-btn top-btn-danger" (click)="auth.logout()">
              <span>خروج</span>
            </button>
            } @else {
            <a routerLink="/login" class="top-btn">دخول</a>
            <a routerLink="/register" class="top-btn top-btn-orange">
              <span>ابدأ</span>
              <span>←</span>
            </a>
            }
          </div>
        </div>
      </nav>
      }

      <router-outlet />
      <app-toast-container />
      <app-confirm-dialog />
    </div>
  `,
  styles: `
    .shell {
      min-height: 100vh;
      direction: rtl;
      color: var(--ink);
      font-family: var(--font-pixel-ar);
      background: transparent;
    }

    /* ═══════════ NAV ═══════════ */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 90;
      background: var(--surface);
      border-bottom: 3px solid var(--ink);
      box-shadow: 0 4px 0 rgba(26, 28, 20, 0.12);
    }

    .top-nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* ═══════════ BRAND ═══════════ */
    .top-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ink);
      flex-shrink: 0;
    }

    .top-brand-mark {
      width: 34px;
      height: 34px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 24px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .top-brand-texts {
      display: flex;
      flex-direction: column;
      line-height: 1;
      gap: 2px;
    }

    .top-brand-name {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1;
    }

    .top-brand-tag {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--orange-2);
      line-height: 1;
    }

    /* ═══════════ LINKS ═══════════ */
    .top-nav-links {
      display: flex;
      gap: 6px;
      flex: 1;
      justify-content: center;
    }

    .top-nav-link {
      padding: 6px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink-2);
      text-decoration: none;
      background: transparent;
      border: 2px solid transparent;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .top-nav-link:hover {
      background: var(--ink);
      color: var(--surface);
      border-color: var(--ink);
    }

    /* ═══════════ ACTIONS ═══════════ */
    .top-nav-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }

    .top-user {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      background: var(--olive-soft);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--olive-2);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .top-user-dot {
      width: 6px;
      height: 6px;
      background: var(--olive);
      animation: pixel-blink 1.6s steps(2) infinite;
      flex-shrink: 0;
    }

    .top-user-name {
      line-height: 1.2;
    }

    .top-user-admin {
      display: inline-block;
      padding: 2px 6px;
      background: var(--gold);
      color: var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 12px;
      letter-spacing: 1px;
      border: 1.5px solid var(--ink);
      line-height: 1.3;
      margin-inline-start: 4px;
    }

    .top-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      background: var(--surface);
      color: var(--ink);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .top-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .top-btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .top-btn-orange {
      background: var(--orange);
      color: var(--surface);
    }

    .top-btn-orange:hover { background: var(--orange-2); }

    .top-btn-danger {
      background: var(--danger);
      color: var(--surface);
      border-color: var(--ink);
    }

    .top-btn-danger:hover { background: #8a2f24; }

    /* ═══════════ RESPONSIVE ═══════════ */
    @media (max-width: 900px) {
      .top-nav-links { display: none; }
    }

    @media (max-width: 640px) {
      .top-nav-inner { padding: 8px 14px; gap: 10px; }
      .top-brand-name { font-size: 16px; }
      .top-brand-tag { font-size: 12px; }
      .top-brand-mark { width: 28px; height: 28px; font-size: 20px; }
      .top-btn { padding: 6px 10px; font-size: 12px; }
      .top-user { padding: 4px 8px; font-size: 12px; }
      .top-user-name { display: none; }
    }
  `
})
export class App {
  public auth = inject(AuthService);
  private readonly _router = inject(Router);

  showNav = signal<boolean>(true);

  constructor() {
    this._router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        const hide =
          url === '/' ||
          url.startsWith('/login') ||
          url.startsWith('/register');
        this.showNav.set(!hide);
      });
  }
}
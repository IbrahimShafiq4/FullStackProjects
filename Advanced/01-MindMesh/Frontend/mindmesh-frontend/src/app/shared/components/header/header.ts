import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-border">
      <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="text-2xl font-black tracking-tight text-brand-600">MindMesh</a>
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a routerLink="/" class="hover:text-brand-600 transition-colors">الرئيسية</a>
            <a routerLink="/boards" class="hover:text-brand-600 transition-colors">لوحاتي</a>
            @if (_AuthService.currentUser()) {
              <a routerLink="/me" class="hover:text-brand-600 transition-colors">ملفي</a>
            }
          </nav>
          <div class="flex items-center gap-3">
            @if (_AuthService.currentUser(); as user) {
              <span class="text-sm text-gray-700 hidden sm:inline font-medium">{{ user.fullName }}</span>
              <button (click)="logout()" class="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg border border-surface-border hover:border-rose-300">تسجيل خروج</button>
            } @else {
              <a routerLink="/login" class="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">دخول</a>
              <a routerLink="/register" class="text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 transition-colors px-4 py-1.5 rounded-lg shadow-apple">حساب جديد</a>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class Header {
  _AuthService = inject(AuthService);
  logout() { this._AuthService.logout(); }
}
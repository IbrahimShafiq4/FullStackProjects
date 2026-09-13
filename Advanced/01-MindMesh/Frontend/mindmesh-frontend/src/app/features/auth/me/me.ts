import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService, IUserDetails } from '../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="min-h-screen bg-surface-muted px-4 py-10" dir="rtl">
      <div class="max-w-3xl mx-auto">
        @if (user(); as user) {
          <div class="bg-white rounded-lg shadow-apple-lg border border-surface-border overflow-hidden">
            <div class="bg-gradient-to-r from-brand-500 to-brand-400 px-6 py-8 text-white">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-2xl font-black">{{ user.fullName.charAt(0) }}</div>
                <div>
                  <h1 class="text-xl font-bold">{{ user.fullName }}</h1>
                  <p class="text-white/80 text-sm">{{ user.email }}</p>
                </div>
              </div>
            </div>
            <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-surface-border">
              <div class="flex flex-col items-start">
                <p class="text-sm text-gray-500">تاريخ الانضمام</p>
                <p class="font-semibold text-gray-900">{{ user.createdAt | date:'mediumDate' }}</p>
              </div>
              <div class="flex flex-col items-start">
                <p class="text-sm text-gray-500">عدد اللوحات</p>
                <p class="font-semibold text-gray-900">{{ user.boardsCount }}</p>
              </div>
              <div class="flex flex-col items-start">
                <p class="text-sm text-gray-500">إجمالي البطاقات</p>
                <p class="font-semibold text-gray-900">{{ user.cardsCount }}</p>
              </div>
            </div>
            <div class="p-5">
              <h2 class="text-lg text-start font-bold text-gray-900 mb-4">آخر اللوحات</h2>
              @if (user.recentBoards.length) {
                <ul class="space-y-2">
                  @for (board of user.recentBoards; track board.id) {
                    <li>
                      <a [routerLink]="['/boards', board.id, 'details']" class="block bg-surface-muted hover:bg-surface-border rounded-lg p-3 transition-colors">
                        <div class="flex justify-between items-center">
                          <span class="font-medium text-gray-900">{{ board.title }}</span>
                          <span class="text-xs text-gray-500">{{ board.cardsCount }} بطاقة</span>
                        </div>
                        <p class="text-xs text-gray-400">{{ board.createdAt | date:'short' }}</p>
                      </a>
                    </li>
                  }
                </ul>
              } @else {
                <p class="text-gray-400 text-sm">لا توجد لوحات بعد.</p>
              }
            </div>
          </div>
        } @else {
          <div class="text-center text-gray-500 py-16">جاري التحميل...</div>
        }
      </div>
    </div>
  `
})
export class Me implements OnInit {
  private authService = inject(AuthService);
  user = signal<IUserDetails | null>(null);

  ngOnInit() {
    this.authService.getMeDetails().subscribe({
      next: (data) => this.user.set(data),
      error: () => console.error('Failed to load user details')
    });
  }
}
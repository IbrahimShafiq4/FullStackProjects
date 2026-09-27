import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-vital-bar',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './vital-bar.html',
  styleUrl: './vital-bar.css',
})
export class VitalBar {
  readonly _auth = inject(AuthService);

  readonly navLinks = computed(() => {
    const user = this._auth.currentUser();
    if (!user) return [];
    if (user.role === 'Doctor') {
      return [{ path: '/dashboard', label: 'لوحة الطبيب', tone: 'signal' }];
    }
    return [{ path: '/book', label: 'حجز موعد', tone: 'cell' }];
  });
}
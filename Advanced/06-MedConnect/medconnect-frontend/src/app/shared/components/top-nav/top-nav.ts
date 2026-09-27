import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { NotificationBell } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-top-nav',
  imports: [RouterLink, RouterLinkActive, ThemeToggle, NotificationBell],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  readonly _auth = inject(AuthService);

  readonly navLinks = computed(() => {
    const user = this._auth.currentUser();
    if (!user) return [];

    if (user.role === 'Doctor') {
      return [
        { path: '/dashboard', label: 'DASHBOARD', floor: 'F-01', color: 'green' },
        { path: '/my-appointments', label: 'APPOINTMENTS', floor: 'F-02', color: 'orange' },
        { path: '/radiology', label: 'RADIOLOGY', floor: 'F-03', color: 'red' },
      ];
    }

    return [
      { path: '/patient-dashboard', label: 'HOME', floor: 'F-02-00', color: 'green' },
      { path: '/book', label: 'BOOK', floor: 'F-02-01', color: 'orange' },
      { path: '/my-appointments', label: 'APPOINTMENTS', floor: 'F-02-02', color: 'orange' },
      { path: '/patient-uploads', label: 'FILES', floor: 'F-02-03', color: 'blue' },
      { path: '/invoices', label: 'INVOICES', floor: 'F-02-04', color: 'blue' },
      { path: '/radiology', label: 'RADIOLOGY', floor: 'F-02-05', color: 'red' },
    ];
  });

  readonly initials = computed(() => {
    const user = this._auth.currentUser();
    if (!user) return '';
    return user.fullName.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('');
  });
}
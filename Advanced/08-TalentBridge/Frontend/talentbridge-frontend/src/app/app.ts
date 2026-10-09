import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { NotificationBell } from './features/notifications/notification-bell/notification-bell';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';

interface NavStation {
  code: string;
  label: string;
  route: string;
  role: 'Candidate' | 'Employer' | 'any';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationBell,
    ThemeToggle,
    ToastContainer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly isAuthed = computed(() => this.user() !== null);

  readonly candidateStations: NavStation[] = [
    { code: 'H', label: 'الرئيسية', route: '/candidate/dashboard', role: 'Candidate' },
    { code: 'D', label: 'الوجهات', route: '/candidate/jobs', role: 'Candidate' },
    { code: 'J', label: 'رحلاتي', route: '/candidate/applications', role: 'Candidate' },
    { code: 'N', label: 'الإشعارات', route: '/notifications', role: 'Candidate' },
    { code: 'P', label: 'الجواز', route: '/candidate/profile', role: 'Candidate' },
  ];

  readonly employerStations: NavStation[] = [
    { code: 'H', label: 'الرئيسية', route: '/employer/dashboard', role: 'Employer' },
    { code: 'D', label: 'الوجهات', route: '/employer/jobs', role: 'Employer' },
    { code: 'N', label: 'الإشعارات', route: '/notifications', role: 'Employer' },
  ];

  readonly stations = computed<NavStation[]>(() => {
    const role = this.user()?.role;
    if (role === 'Candidate') return this.candidateStations;
    if (role === 'Employer') return this.employerStations;
    return [];
  });

  readonly roleCode = computed(() => {
    const role = this.user()?.role;
    return role === 'Candidate' ? 'CND' : role === 'Employer' ? 'EMP' : 'GUEST';
  });
}
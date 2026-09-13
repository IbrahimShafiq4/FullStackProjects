import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth';
import { Toast } from './core/services/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly auth = inject(AuthService);
  readonly toast = inject(Toast);
  private readonly router = inject(Router);

  hideNav = signal<boolean>(true);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        const hidden =
          url === '/' ||
          url === '' ||
          url.startsWith('/login') ||
          url.startsWith('/register');
        this.hideNav.set(hidden);
      });
  }
}
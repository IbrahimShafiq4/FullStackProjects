import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, ThemeToggle, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public readonly _AuthService = inject(AuthService);
  public readonly _Router = inject(Router);

  isLandingPageActive = true;

  constructor() {
    this._Router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLandingPageActive =
          this._Router.url.split('?')[0].split('#')[0] === '/';
      });
  }
}
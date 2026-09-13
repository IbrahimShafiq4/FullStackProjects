import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { AuthService } from './core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastContainer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly auth = inject(AuthService);
  private readonly _Router = inject(Router);

  showTaskbar = signal<boolean>(true);

  constructor() {
    this._Router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      const hide = url === '/' || url.startsWith('/login') || url.startsWith('/register');
      this.showTaskbar.set(!hide);
    });
  }
}
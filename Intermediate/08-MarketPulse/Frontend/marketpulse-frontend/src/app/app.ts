import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  _auth = inject(AuthService);
  year = new Date().getFullYear();
}
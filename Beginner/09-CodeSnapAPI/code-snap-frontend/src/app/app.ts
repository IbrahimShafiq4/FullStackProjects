import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(Auth);
}

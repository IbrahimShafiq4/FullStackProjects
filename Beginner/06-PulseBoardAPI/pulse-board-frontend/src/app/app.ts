import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle';
import { Auth } from './core/Services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(Auth);
}

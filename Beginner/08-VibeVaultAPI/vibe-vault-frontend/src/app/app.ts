import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/auth/login/login";
import { Auth } from './core/services/auth';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  auth: Auth = inject(Auth);
}

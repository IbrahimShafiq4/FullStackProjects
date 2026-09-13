import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeToggle } from "./shared/components/theme-toggle/theme-toggle";
import { ToastContainer } from "./shared/components/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
}

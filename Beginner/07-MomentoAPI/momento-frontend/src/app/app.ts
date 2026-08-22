import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ToastContainer } from "./shared/toast-container/toast-container";
import { MemoryUploadFormComponent } from "./features/timeline/memory-upload-form.component";
import { ThemeToggle } from './shared/theme-toggle/theme-toggle';
import { Auth } from './core/Services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(Auth);
  ;
}

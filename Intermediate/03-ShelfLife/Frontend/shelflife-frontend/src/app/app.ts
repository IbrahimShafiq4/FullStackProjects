import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceRecorder } from "./features/products/voice-recorder/voice-recorder";
import { AuthService } from './core/services/auth-service';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeToggle, ToastContainer],
  templateUrl: './app.html',
})
export class AppComponent {
  authService = inject(AuthService);
}
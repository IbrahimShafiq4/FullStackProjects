import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainer, DynamicPopup],
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
}
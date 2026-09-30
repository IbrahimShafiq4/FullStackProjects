import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainer, DynamicPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  ngOnInit(): void {
    this.authService.hydrate();
  }
}
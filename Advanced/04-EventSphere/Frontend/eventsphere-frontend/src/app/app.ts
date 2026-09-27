import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, DynamicPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  public _AuthService: AuthService = inject(AuthService);
  public theme = inject(ThemeService);

  ngOnInit(): void {
    this._AuthService.loadCurrentUser().subscribe({ error: () => { } });
  }
}
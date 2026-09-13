import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, DynamicPopup],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { _AuthService: AuthService = inject(AuthService); }

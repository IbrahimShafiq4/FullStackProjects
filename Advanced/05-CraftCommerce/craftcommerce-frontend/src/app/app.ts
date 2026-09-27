import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, DynamicPopup],
  template: `
    <router-outlet />
    <app-toast-container />
    <app-dynamic-popup />
  `,
})
export class App implements OnInit {
  private _AuthService: AuthService = inject(AuthService);
  ngOnInit(): void { this._AuthService.loadCurrentUser(); }
}
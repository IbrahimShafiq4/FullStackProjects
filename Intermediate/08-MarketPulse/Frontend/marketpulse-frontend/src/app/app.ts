import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Login } from "./features/auth/login/login";
import { AuthService } from './core/services/auth.service';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle, ToastContainer, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { public _AuthService: AuthService = inject(AuthService); }

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VitalBar } from './shared/components/vital-bar/vital-bar';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { ThemeService } from './core/services/theme.service';
import { TopNav } from './shared/components/top-nav/top-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, DynamicPopup, TopNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly _theme = inject(ThemeService);
}
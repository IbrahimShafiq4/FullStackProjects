import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ToastContainer, DynamicPopup],
  template: `
    <div class="flex flex-col min-h-screen bg-surface-muted">
      <app-header />
      <main class="flex-1"><router-outlet /></main>
      <app-footer />
    </div>
    <app-toast-container />
    <app-dynamic-popup />
  `
})
export class App { }
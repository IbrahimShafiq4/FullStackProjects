import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformCardLayout } from './shared/layouts/platform-card-layout/platform-card-layout';

@Component({
  selector: 'app-root',
  imports: [PlatformCardLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('R_FIRFrontend');
}

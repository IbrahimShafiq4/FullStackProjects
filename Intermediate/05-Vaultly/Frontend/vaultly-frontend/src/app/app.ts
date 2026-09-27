import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { PharaonicBg } from './features/pharaonic-bg/pharaonic-bg';
import { SandParticles } from './features/sand-particles/sand-particles';
import { HieroglyphStrip } from './features/hieroglyph-strip/hieroglyph-strip';
import { TempleScene } from './features/temple-scene/temple-scene';
import { MummySarcophagus } from './features/mummy-sarcophagus/mummy-sarcophagus';
import { TimeTravelBg } from './features/time-travel-bg/time-travel-bg';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink,
    ThemeToggle, ToastContainer, DynamicPopup,
    PharaonicBg, SandParticles, HieroglyphStrip,
    TempleScene,
    MummySarcophagus,
    TimeTravelBg
],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public _AuthService: AuthService = inject(AuthService);
  year: number = new Date().getFullYear();
}
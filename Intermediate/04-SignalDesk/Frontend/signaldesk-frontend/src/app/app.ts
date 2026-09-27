import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { NotebookService } from './core/services/notebook.service';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { OWNER } from './core/models/notebook.model';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainer, ThemeToggle, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  notebook = inject(NotebookService);
  themes = inject(ThemeService);
  auth = inject(AuthService);
  private router = inject(Router);

  readonly owner = OWNER;

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) return;
    if (e.key === 'ArrowLeft') this.step(1);
    if (e.key === 'ArrowRight') this.step(-1);
  }

  private step(dir: number) {
    const list = this.notebook.pages();
    const idx = list.findIndex(p => p.path === this.notebook.currentUrl());
    const next = list[idx + dir];
    if (next) this.router.navigateByUrl(next.path);
  }

  logout() {
    this.auth.logout();
  }
}
import { Component, Input, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  @Input() section = '';
  @Input() serial  = 'RIG-001';

  public theme = inject(ThemeService);
  public auth  = inject(AuthService);
  public cart  = inject(CartService);

  readonly year = new Date().getFullYear();
  readonly isLogged = computed(() => !!this.auth.currentUser());

  tickerItems: string[] = [
    'CRAFTCOMMERCE · RIG-001',
    'AUTH · OK',
    'SESSION · COOKIE-SECURE',
    'CAIRO · 30.04N 31.23E',
    'STATUS · ONLINE',
  ];
}
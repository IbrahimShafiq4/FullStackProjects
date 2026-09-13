import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DarkModeToggle } from '../dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, DarkModeToggle],
  templateUrl: './header.html'
})
export class Header {
  public authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
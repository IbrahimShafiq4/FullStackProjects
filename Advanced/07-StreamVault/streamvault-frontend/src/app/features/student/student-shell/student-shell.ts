import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastContainer } from '../../../shared/components/toast-container/toast-container';
import { DynamicPopup } from '../../../shared/components/dynamic-popup/dynamic-popup';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-student-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainer, DynamicPopup, ThemeToggle],
  templateUrl: './student-shell.html',
  styleUrl: './student-shell.css'
})
export class StudentShell {
  public readonly _AuthService: AuthService = inject(AuthService);
  private _Router: Router = inject(Router);
  logout(): void {
    this._AuthService.logout().subscribe(() => {
      this._AuthService.currentUser.set(null);
      this._Router.navigate(['/login'])
    })
  }
}
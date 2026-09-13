import { Component, inject } from '@angular/core';
import { DarkModeService } from '../../../core/services/dark-mode.service';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.html'
})
export class DarkModeToggle {
  public darkModeService = inject(DarkModeService);

  toggle(): void {
    this.darkModeService.toggle();
  }
}
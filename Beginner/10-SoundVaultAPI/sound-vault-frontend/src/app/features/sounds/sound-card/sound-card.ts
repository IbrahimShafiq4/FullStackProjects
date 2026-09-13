import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Toast } from '../../../core/services/toast';
import { ISound, Sounds } from '../../../core/services/sounds';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-sound-card',
  templateUrl: './sound-card.html',
})
export class SoundCard {
  private _Toast: Toast = inject(Toast);
  private _Sounds: Sounds = inject(Sounds);
  private _Router: Router = inject(Router);
  sound: InputSignal<ISound> = input.required<ISound>();
  mediaFullUrl: InputSignal<string> = input.required<string>();
  onDelete: OutputEmitterRef<number> = output<number>();

  copyTitle() {
    navigator.clipboard.writeText(this.sound().title)
      .then(() => this._Toast.show('تم نسخ العنوان', 'success'))
      .catch(() => this._Toast.show('فشل النسخ', 'error'));
  }

  toggleLike() {
    this._Sounds.toggleLike(this.sound().id).subscribe({
      next: () => {
        this._Sounds.loadSounds();
      },
      error: () => this._Toast.show('حدث خطأ', 'error')
    });
  }

  openComments() {
    this._Router.navigate(['/sounds', this.sound().id]);
  }
}
import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Toast } from '../../../core/services/toast';
import { ISound } from '../../../core/services/sounds';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-sound-card',
  templateUrl: './sound-card.html',
  styles: [`
      audio, video { width: 100%; border-radius: 0.5rem; }
    `]
})
export class SoundCard {
  private _Toast: Toast                     = inject(Toast);
  sound:          InputSignal<ISound>       = input.required<ISound>();
  mediaFullUrl:   InputSignal<string>       = input.required<string>();
  onDelete:       OutputEmitterRef<number>  = output<number>();

  copyTitle() {
    navigator.clipboard.writeText(this.sound().title)
      .then(() => this._Toast.show('تم نسخ العنوان', 'success'))
      .catch(() => this._Toast.show('فشل النسخ', 'error'));
  }
}

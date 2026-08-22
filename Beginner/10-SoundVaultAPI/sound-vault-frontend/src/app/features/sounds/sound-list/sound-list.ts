import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Sounds, IDelete } from '../../../core/services/sounds';
import { Toast } from '../../../core/services/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { SoundCard } from "../sound-card/sound-card";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [SoundCard, FormsModule, RouterLink],
  selector: 'app-sound-list',
  templateUrl: './sound-list.html',
})
export class SoundList implements OnInit {
  public  _Sounds : Sounds  = inject(Sounds);
  private _Toast  : Toast   = inject(Toast); 

  searchTerm      :WritableSignal<string> = signal<string>('')
  selectedCategory:WritableSignal<string> = signal<string>('')

  ngOnInit(): void {
    this._Sounds.loadSounds();
  }

  onFilter(): void {
    this._Sounds.loadSounds(this.searchTerm() || undefined, this.selectedCategory() || undefined);
  }

  onDelete(id: number): void {
    if(!confirm('هل أنت متأكد من الحذف ؟',)) return;
    this._Sounds.delete(id).subscribe({
      next: (sound: IDelete) => {
        this._Toast.show('تم الحذف', 'success');
        this.onFilter();
      },
      error: (error: HttpErrorResponse) => this._Toast.show('فشل الحذف', 'error'),
    })
  }
}

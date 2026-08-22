import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SnippetCard } from '../snippet-card/snippet-card';
import { RouterLink } from '@angular/router';
import { IDelete, Snippets } from '../../../core/services/snippets';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-snippet-list',
  imports: [FormsModule, SnippetCard, RouterLink],
  templateUrl: './snippet-list.html',
  styleUrl: './snippet-list.scss',
})
export class SnippetList implements OnInit {
  _Snippet:       Snippets  = inject(Snippets);
  private _Toast: Toast     = inject(Toast);

  searchTerm:       WritableSignal<string> = signal<string>('');
  selectedLanguage: WritableSignal<string> = signal<string>('');

  ngOnInit() {
    this._Snippet.loadSnippets();
  }

  onSearch(): void {
    this._Snippet.loadSnippets(this.selectedLanguage() || undefined, this.searchTerm() || undefined)
  }

  onDelete(id: number): void {
    this._Snippet.delete(id).subscribe({
      next: (res: IDelete) => {
        this._Toast.show(res.message, 'success');
        this.onSearch()
      },
      error: () => this._Toast.show('حصل خطأ اثناء الحذف', 'error')
    })
  }
}

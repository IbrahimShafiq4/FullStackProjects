import { Component, inject } from '@angular/core';
import { Notes } from '../../../core/services/notes';
import { NoteForm } from '../note-form/note-form';

@Component({
  selector: 'app-note-list',
  imports: [NoteForm],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css',
})
export class NoteList {
  protected _NotesService: Notes = inject(Notes);

  ngOnInit() {
    this._NotesService.loadNotes();
  }

  onDelete(id: number): void {
    this._NotesService.deleteNote(id).subscribe({
      next: (res: { message: string }) => {
        this._NotesService.loadNotes();
      }
    })
  }
}

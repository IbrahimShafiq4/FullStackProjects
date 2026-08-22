import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Notes } from '../../../core/services/notes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-form',
  imports: [FormField, FormsModule],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css',
})
export class NoteForm {
  private notesService = inject(Notes);

  noteModel = signal({ title: '', content: '' });
  noteForm = form(this.noteModel, () => { });

  errorMessage = signal<string | null>(null);

  onSubmit() {
    const { title, content } = this.noteModel();

    if (!title.trim() || !content.trim()) {
      this.errorMessage.set('لازم تكتب العنوان والمحتوى');
      return;
    }

    this.notesService.addNote(title, content).subscribe({
      next: () => {
        this.noteModel.set({ title: '', content: '' });
        this.errorMessage.set(null);
        this.notesService.loadNotes();
      },
      error: () => this.errorMessage.set('حصل خطأ أثناء الإضافة')
    });
  }
}

import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ISnippet, Snippets } from '../../../core/services/snippets';
import { Toast } from '../../../core/services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-snippet-form',
  imports: [FormsModule, FormField],
  templateUrl: './snippet-form.html',
  styleUrl: './snippet-form.scss',
})
export class SnippetForm implements OnInit {
  private _Snippet:         Snippets        = inject(Snippets);
  private _Toast:           Toast           = inject(Toast);
  private _ActivatedRoute:  ActivatedRoute  = inject(ActivatedRoute)
  private _Router:          Router          = inject(Router);

  snippetId:  WritableSignal<number | null> = signal<number | null>(null);
  isEditMode: WritableSignal<boolean>       = signal<boolean>(false);

  formModel: WritableSignal<{ title: string; code: string; language: string }> = signal({ title: '', code: '', language: '' });
  snippetForm = form(this.formModel, () => {  })

  selectedFile: WritableSignal<File | null> = signal<File | null>(null);
  isSubmitting: WritableSignal<boolean>     = signal<boolean>(false);

  ngOnInit(): void {
    const idParam: number = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    if (idParam) {
      this.snippetId.set(idParam);
      this.isEditMode.set(true);

      this._Snippet.getById(idParam).subscribe({
        next: (snippet: ISnippet) => {
          this.formModel.set({
            title: snippet.title,
            code: snippet.code,
            language: snippet.language
          });
        },
        error: () => this._Toast.show('تعذر تحميل بيانات ال snippet', 'error')
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null)
  }

  onSubmit(): void {
    const { title, code, language } = this.formModel();

    if (!title.trim() || !code.trim()) {
      this._Toast.show('لازم تكتب عنوان وكود', 'error')
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('code', code);
    formData.append('language', language);

    const file = this.selectedFile();
    if (file) { formData.append('screenshot', file); }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode() ? this._Snippet.update(this.snippetId()!, formData) : this._Snippet.create(formData);

    request$.subscribe({
      next: () => {
        this._Toast.show(this.isEditMode() ? 'تم تحديث ال snippet': 'تم إنشاء ال snippet', 'success');
        this._Router.navigate(['/snippets'])
      },
      error: (error: HttpErrorResponse) => {
        this._Toast.show(error.error ?? 'حصل خطأ', 'error');
        this.isSubmitting.set(false);
      }
    })
  }
}

import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../core/services/courses.service';
import { StudyFilesService } from '../../../core/services/study-files.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ICourse, IStudyFile } from '../../../core/models';

@Component({
  selector: 'app-teacher-study-files',
  imports: [FormsModule],
  templateUrl: './study-files.html',
  styleUrl: './study-files.css'
})
export class TeacherStudyFiles implements OnInit {
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _StudyFilesService: StudyFilesService = inject(StudyFilesService);
  public readonly _ToastService: ToastService = inject(ToastService);

  public courses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public files: WritableSignal<IStudyFile[]> = signal<IStudyFile[]>([]);
  public selectedCourseId: WritableSignal<number> = signal<number>(0);
  public showUpload: WritableSignal<boolean> = signal<boolean>(false);
  public isUploading: WritableSignal<boolean> = signal<boolean>(false);
  public uploadProgress: WritableSignal<number> = signal<number>(0);

  public uploadTitle: string = '';
  public uploadDescription: string = '';
  public uploadPrice: number = 0;
  public uploadIsFree: boolean = true;
  public selectedFile: File | null = null;

  public ngOnInit(): void {
    this._CoursesService.getCourses().subscribe({
      next: (data: ICourse[]) => {
        this.courses.set(data);
        if (data.length > 0) {
          this.selectedCourseId.set(data[0].id);
          this._loadFiles(data[0].id);
        }
      }
    });
  }

  public onCourseChange(courseId: number): void {
    this.selectedCourseId.set(courseId);
    this._loadFiles(courseId);
  }

  private _loadFiles(courseId: number): void {
    this._StudyFilesService.getFilesByCourse(courseId).subscribe({
      next: (data: IStudyFile[]) => this.files.set(data)
    });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  public onSubmit(): void {
    if (!this.selectedFile || !this.uploadTitle) {
      this._ToastService.show('لازم تحدد ملف وعنوان', 'error');
      return;
    }

    this.isUploading.set(true);

    this._StudyFilesService.upload({
      title: this.uploadTitle,
      description: this.uploadDescription,
      price: this.uploadIsFree ? 0 : this.uploadPrice,
      isFree: this.uploadIsFree,
      courseId: this.selectedCourseId()
    }, this.selectedFile).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.showUpload.set(false);
        this._resetForm();
        this._ToastService.show('تم رفع المذكرة', 'success');
        this._loadFiles(this.selectedCourseId());
      },
      error: () => {
        this.isUploading.set(false);
        this._ToastService.show('فشل رفع الملف', 'error');
      }
    });
  }

  public onDelete(fileId: number): void {
    if (!confirm('متأكد إنك عايز تحذف الملف ده؟')) return;

    this._StudyFilesService.delete(fileId).subscribe({
      next: () => {
        this._ToastService.show('تم حذف الملف', 'success');
        this._loadFiles(this.selectedCourseId());
      }
    });
  }

  private _resetForm(): void {
    this.uploadTitle = '';
    this.uploadDescription = '';
    this.uploadPrice = 0;
    this.uploadIsFree = true;
    this.selectedFile = null;
  }

  public getFileIcon(contentType: string): string {
    if (contentType.includes('pdf')) return '📕';
    if (contentType.includes('word') || contentType.includes('document')) return '📘';
    if (contentType.includes('presentation') || contentType.includes('powerpoint')) return '📙';
    if (contentType.includes('image')) return '🖼️';
    return '📄';
  }

  public getFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
  }
}
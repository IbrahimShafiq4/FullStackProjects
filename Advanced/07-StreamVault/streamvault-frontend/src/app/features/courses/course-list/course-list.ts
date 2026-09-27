import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../core/services/courses.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ICourse } from '../../../core/models';

@Component({
  selector: 'app-course-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _ToastService: ToastService = inject(ToastService);

  public courses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public filteredCourses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public searchTerm: string = '';
  public viewMode: 'shelf' | 'list' = 'shelf';

  public ngOnInit(): void {
    this._CoursesService.getCourses().subscribe({
      next: (data: ICourse[]) => {
        this.courses.set(data);
        this.filteredCourses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('تعذر تحميل الكورسات', 'error');
      }
    });
  }

  public onSearch(): void {
    const term: string = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCourses.set(this.courses());
      return;
    }
    const filtered = this.courses().filter((c) =>
      c.title.toLowerCase().includes(term)
      || c.instructorName.toLowerCase().includes(term)
    );
    this.filteredCourses.set(filtered);
  }

  public setViewMode(mode: 'shelf' | 'list'): void {
    this.viewMode = mode;
  }

  public getBookColor(index: number): string {
    const palette: string[] = ['#4a5c4e', '#5f3d1c', '#1e2836', '#8b5a2b', '#6d4b1e', '#3d4a52'];
    return palette[index % palette.length];
  }

  public getCourseStatusLabel(status: string): string {
    const map: Record<string, string> = {
      live: 'الآن',
      upcoming: 'قريبًا',
      study: 'دراسة',
      exam: 'امتحان',
      locked: 'مقفول',
      completed: 'مكتمل'
    };
    return map[status] ?? 'دراسة';
  }
}
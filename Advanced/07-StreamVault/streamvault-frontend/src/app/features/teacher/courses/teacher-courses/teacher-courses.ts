import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ICourse, IFloor } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { FloorsService } from '../../../../core/services/floors.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-teacher-courses',
  imports: [FormsModule, RouterLink],
  templateUrl: './teacher-courses.html',
  styleUrl: './teacher-courses.css'
})
export class TeacherCourses implements OnInit {
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _FloorsService: FloorsService = inject(FloorsService);
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _ToastService: ToastService = inject(ToastService);

  public courses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public floors: WritableSignal<IFloor[]> = signal<IFloor[]>([]);
  public showCreate: WritableSignal<boolean> = signal<boolean>(false);
  public isCreating: WritableSignal<boolean> = signal<boolean>(false);
  public isEditing: WritableSignal<number | null> = signal<number | null>(null);

  public newTitle: string = '';
  public newDescription: string = '';
  public selectedFloorId: number = 0;
  public selectedClassroomNumber: number = 1;

  public ngOnInit(): void {
    this._loadCourses();
    this._loadFloors();
  }

  private _loadCourses(): void {
    this._CoursesService.getCourses().subscribe({
      next: (data: ICourse[]) => {
        const mine = data.filter((c) => c.instructorName === this._AuthService.currentUser()?.fullName);
        this.courses.set(mine);
      }
    });
  }

  private _loadFloors(): void {
    this._FloorsService.getFloors().subscribe({
      next: (data: IFloor[]) => {
        this.floors.set(data);
        if (data.length > 0) {
          this.selectedFloorId = data[0].id;
        }
      }
    });
  }

  public openCreate(): void {
    this.isEditing.set(null);
    this.newTitle = '';
    this.newDescription = '';
    this.selectedClassroomNumber = 1;
    this.showCreate.set(true);
  }

  public openEdit(course: ICourse): void {
    this.isEditing.set(course.id);
    this.newTitle = course.title;
    this.newDescription = course.description;
    this.selectedFloorId = course.floorId ?? 0;
    this.selectedClassroomNumber = course.classroomNumber;
    this.showCreate.set(true);
  }

  public onCancel(): void {
    this.showCreate.set(false);
    this.isEditing.set(null);
  }

  public onSubmit(): void {
    if (!this.newTitle.trim()) {
      this._ToastService.show('لازم تكتب عنوان الكورس', 'error');
      return;
    }

    if (!this.selectedFloorId) {
      this._ToastService.show('اختار الأرضية الأول', 'error');
      return;
    }

    this.isCreating.set(true);

    const dto = {
      title: this.newTitle,
      description: this.newDescription,
      floorId: this.selectedFloorId,
      classroomNumber: this.selectedClassroomNumber
    };

    const editingId = this.isEditing();

    if (editingId !== null) {
      this._CoursesService.updateCourse(editingId, dto).subscribe({
        next: () => {
          this.isCreating.set(false);
          this.showCreate.set(false);
          this.isEditing.set(null);
          this._ToastService.show('تم تعديل الكورس', 'success');
          this._loadCourses();
        },
        error: () => {
          this.isCreating.set(false);
          this._ToastService.show('فشل التعديل', 'error');
        }
      });
    } else {
      this._CoursesService.createCourse(dto).subscribe({
        next: () => {
          this.isCreating.set(false);
          this.showCreate.set(false);
          this._ToastService.show('تم إنشاء الكورس', 'success');
          this._loadCourses();
        },
        error: () => {
          this.isCreating.set(false);
          this._ToastService.show('فشل الإنشاء', 'error');
        }
      });
    }
  }

  public onDelete(courseId: number): void {
    if (!confirm('متأكد إنك عايز تحذف الكورس ده؟')) return;

    this._CoursesService.deleteCourse(courseId).subscribe({
      next: () => {
        this._ToastService.show('تم حذف الكورس', 'success');
        this._loadCourses();
      },
      error: () => this._ToastService.show('فيه مشكلة في الحذف — يمكن عليه مبيعات', 'error')
    });
  }

  public getBookColor(index: number): string {
    const palette: string[] = ['#4a5c4e', '#5f3d1c', '#1e2836', '#8b5a2b', '#6d4b1e', '#3d4a52'];
    return palette[index % palette.length];
  }
}
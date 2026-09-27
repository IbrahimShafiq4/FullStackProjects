import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../../core/services/courses.service';
import { StudyFilesService } from '../../../core/services/study-files.service';
import { VideosService } from '../../../core/services/videos.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { ICourse, IStudyFile, IVideo } from '../../../core/models';

@Component({
  selector: 'app-classroom',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './classroom.html',
  styleUrl: './classroom.css'
})
export class Classroom implements OnInit {
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _StudyFilesService: StudyFilesService = inject(StudyFilesService);
  public readonly _VideosService: VideosService = inject(VideosService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);

  public course: WritableSignal<ICourse | null> = signal<ICourse | null>(null);
  public files: WritableSignal<IStudyFile[]> = signal<IStudyFile[]>([]);
  public videos: WritableSignal<IVideo[]> = signal<IVideo[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);

  public sampleAnswer: WritableSignal<string> = signal<string>('');
  public sampleResult: WritableSignal<'idle' | 'correct' | 'wrong'> = signal<'idle' | 'correct' | 'wrong'>('idle');
  public showAttendance: WritableSignal<boolean> = signal<boolean>(false);

  public ngOnInit(): void {
    const classroomId: number = Number(this._Route.snapshot.paramMap.get('classroomId'));
    this._CoursesService.getCourse(classroomId).subscribe({
      next: (data: ICourse) => {
        this.course.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('الفصل غير موجود', 'error');
      }
    });
    this._StudyFilesService.getFilesByCourse(classroomId).subscribe({
      next: (data: IStudyFile[]) => this.files.set(data)
    });
    this._VideosService.getCourseVideos(classroomId).subscribe({
      next: (data: IVideo[]) => this.videos.set(data)
    });
  }

  public submitAnswer(): void {
    const answer: string = this.sampleAnswer().trim();
    if (!answer) return;

    if (answer.toLowerCase() === '22') {
      this.sampleResult.set('correct');
    } else {
      this.sampleResult.set('wrong');
    }
  }

  public resetAnswer(): void {
    this.sampleAnswer.set('');
    this.sampleResult.set('idle');
  }

  public getStatusLabel(status: string): string {
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
import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';
import { CoursesService } from '../../../core/services/courses.service';
import { AuthService } from '../../../core/services/auth.service';
import { ITeacherStatistics, ICourse, IPayment } from '../../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class TeacherDashboard implements OnInit {
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _AuthService: AuthService = inject(AuthService);

  public stats: WritableSignal<ITeacherStatistics | null> = signal<ITeacherStatistics | null>(null);
  public courses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public recentSales: WritableSignal<IPayment[]> = signal<IPayment[]>([]);

  public ngOnInit(): void {
    this._PaymentsService.getTeacherStatistics().subscribe({
      next: (data: ITeacherStatistics) => this.stats.set(data)
    });
    this._CoursesService.getCourses().subscribe({
      next: (data: ICourse[]) => this.courses.set(data.slice(0, 3))
    });
    this._PaymentsService.getReceivedPayments().subscribe({
      next: (data: IPayment[]) => this.recentSales.set(data.slice(0, 4))
    });
  }

  public getBookColor(index: number): string {
    const palette: string[] = ['#4a5c4e', '#5f3d1c', '#1e2836'];
    return palette[index % palette.length];
  }
}
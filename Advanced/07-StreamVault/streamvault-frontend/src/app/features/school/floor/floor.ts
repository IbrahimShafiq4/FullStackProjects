import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloorsService } from '../../../core/services/floors.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { IFloorWithClassrooms, IFloorClassroom } from '../../../core/models';

@Component({
  selector: 'app-floor',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './floor.html',
  styleUrl: './floor.css'
})
export class Floor implements OnInit {
  public readonly _FloorsService: FloorsService = inject(FloorsService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router: Router = inject(Router);

  public floor: WritableSignal<IFloorWithClassrooms | null> = signal<IFloorWithClassrooms | null>(null);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public openingDoorId: WritableSignal<number | null> = signal<number | null>(null);
  public hoveredDoorId: WritableSignal<number | null> = signal<number | null>(null);

  public ngOnInit(): void {
    const floorId: number = Number(this._Route.snapshot.paramMap.get('floorId'));
    this._FloorsService.getFloor(floorId).subscribe({
      next: (data: IFloorWithClassrooms) => {
        this.floor.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('الأرضية غير موجودة', 'error');
      }
    });
  }

  public getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      live: 'مباشر',
      upcoming: 'قريب',
      study: 'دراسة',
      exam: 'امتحان',
      locked: 'مقفول',
      completed: 'مكتمل'
    };
    return map[status] ?? 'دراسة';
  }

  public getClassroomSlots(classrooms: IFloorClassroom[]): (IFloorClassroom | null)[] {
    const slots: (IFloorClassroom | null)[] = [null, null, null];
    classrooms.forEach((c: IFloorClassroom) => {
      const idx: number = Math.max(0, Math.min(2, c.classroomNumber - 1));
      slots[idx] = c;
    });
    return slots;
  }

  public onDoorClick(event: Event, classroomId: number): void {
    event.preventDefault();
    if (this.openingDoorId()) return;

    this.openingDoorId.set(classroomId);

    setTimeout(() => {
      this._Router.navigate(['/school/classrooms', classroomId]);
    }, 750);
  }

  public onEmptyDoorClick(): void {
    this._ToastService.show('الفصل ده فاضي — كلم مدرس عشان ينشئ كورس فيه', 'info');
  }
}
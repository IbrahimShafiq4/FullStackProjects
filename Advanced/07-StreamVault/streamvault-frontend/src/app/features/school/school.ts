import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FloorsService } from '../../core/services/floors.service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';
import { IFloor } from '../../core/models';

@Component({
  selector: 'app-school',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './school.html',
  styleUrl: './school.css'
})
export class School implements OnInit {
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _FloorsService: FloorsService = inject(FloorsService);

  public floors: WritableSignal<IFloor[]> = signal<IFloor[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public hoveredFloor: WritableSignal<number | null> = signal<number | null>(null);

  public ngOnInit(): void {
    this._FloorsService.getFloors().subscribe({
      next: (data: IFloor[]) => {
        this.floors.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  public getFloorClassrooms(floor: IFloor): number {
    return floor.classroomCount || 3;
  }
}
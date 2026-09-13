import { Component, computed, inject, OnInit } from '@angular/core';
import { WorkoutService } from '../../../core/services/workout.service';
import { AuthService } from '../../../core/services/auth.service';
import { AddExerciseForm } from "../components/add-exercise-form/add-exercise-form";
import { CreatePlanForm } from "../components/create-plan-form/create-plan-form";
import { CoachStats } from '../../workouts/coach-stats/coach-stats';

@Component({
  imports: [AddExerciseForm, CreatePlanForm, CoachStats],
  selector: 'app-dashboard',
  styles: ``,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.workoutService.loadPlans();
  }

  myPlans = computed(() => {
    const coachName = this.authService.currentUser()?.fullName;
    if (!coachName) return [];
    return this.workoutService.plans().filter(plan => plan.coachName === coachName);
  });
}
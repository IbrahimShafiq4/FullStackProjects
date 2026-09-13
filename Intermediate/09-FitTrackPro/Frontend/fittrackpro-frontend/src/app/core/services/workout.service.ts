import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IExercise {
    id          : number;
    name        : string;
    targetSets  : number;
    targetReps  : number;
    demoVideoUrl: string | null;
}

export interface IWorkoutPlan {
    id          : number;
    title       : string;
    description : string;
    coachId     : number;
    coachName   : string;
    exercises   : IExercise[];
}

@Service()
export class WorkoutService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    
    private readonly API_URL    : string     = "https://localhost:7000/api/v1/workoutplans";
    private readonly LOGS_URL   : string     = "https://localhost:7000/api/v1/workoutlogs";
    private readonly SERVER_ROOT: string     = "https://localhost:7000";

    plans: WritableSignal<IWorkoutPlan[]>    = signal<IWorkoutPlan[]>([]);

    loadPlans(): void {
        this._HttpClient.get<IWorkoutPlan[]>(this.API_URL).subscribe({
            next: (plan: IWorkoutPlan[]) => this.plans.set(plan),
        })
    }

    createPlans(title: string, description: string): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(this.API_URL, { title, description });
    }

    addExercise(planId: number, formData: FormData) {
        return this._HttpClient.post(`${this.API_URL}/${planId}/exercises`, formData);
    }

    enroll(planId: number) {
        return this._HttpClient.post(`${this.API_URL}/${planId}/enroll`, {  });
    }

    logWorkout(formData: FormData) {
        return this._HttpClient.post(`${this.LOGS_URL}/log`, formData);
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}/${relativeUrl}`;
    }
}
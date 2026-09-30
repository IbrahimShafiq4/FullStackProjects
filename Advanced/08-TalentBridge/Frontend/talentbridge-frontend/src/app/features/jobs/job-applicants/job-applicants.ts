import { Component, inject, OnInit } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  imports: [DatePipe, NgClass],
  selector: 'app-job-applicants',
  styleUrl: './job-applicants.css',
  templateUrl: './job-applicants.html',
})
export class JobApplicants implements OnInit {
  public _JobsService: JobsService = inject(JobsService);
  private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const jobId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    this._JobsService.loadApplicants(jobId);
  }

  getScoreColorClass(score: number): string {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
  }


}

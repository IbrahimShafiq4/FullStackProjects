import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Auth } from '../../../core/Services/auth';
import { EntryForm } from '../entry-form/entry-form';
import { PulseChart } from '../pulse-chart/pulse-chart';

interface IChartData {
  labels: string[];
  moodData: number[];
  focusData: number[];
}

@Component({
  selector: 'app-dashboard',
  imports: [EntryForm, PulseChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private _HttpClient: HttpClient = inject(HttpClient);
  private _Auth: Auth = inject(Auth);

  chartData: WritableSignal<IChartData | null> = signal<IChartData | null>(null);

  private readonly API_URL = "https://localhost:7102/api/entries";

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this._HttpClient
      .get<IChartData>(`${this.API_URL}/chart-data`, {
        withCredentials: true
      })
      .subscribe({
        next: (res: IChartData) => {
          this.chartData.set(res);
        },
        error: (err) => {
          console.log('Chart Data Error:', err);
        }
      });
  }
}

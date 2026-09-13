import { AfterViewInit, Component, ElementRef, inject, OnInit, Signal, viewChild } from '@angular/core';
import { LedgerService } from '../../../core/services/ledger.service';
import { ToastService } from '../../../shared/services/toast.service';
import Chart from 'chart.js/auto';

@Component({
    imports: [],
    selector: 'app-monthly-report',
    templateUrl: './monthly-report.html',
})
export class MonthlyReport implements OnInit, AfterViewInit {
    public _LedgerService: LedgerService = inject(LedgerService);
    private _ToastService: ToastService = inject(ToastService);
    private canvasRef: Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

    currentYear: number = new Date().getFullYear();
    isExporting: boolean = false;

    ngOnInit(): void {
        this._LedgerService.loadMonthlyReport(this.currentYear);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.renderChart(), 500);
    }

    private renderChart(): void {
        const canvas = this.canvasRef()?.nativeElement;
        const data = this._LedgerService.monthlyReport();
        if (!canvas || data.length === 0) return;

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map((d) => `شهر ${d.month}`),
                datasets: [
                    { label: 'إيرادات', data: data.map((d) => d.totalRevenue), backgroundColor: '#059669' },
                    { label: 'مصروفات', data: data.map((d) => d.totalExpenses), backgroundColor: '#DC2626' }
                ]
            },
            options: { responsive: true }
        });
    }

    onExportExcel(): void {
        this.isExporting = true;
        this._LedgerService.exportReport(this.currentYear).subscribe({
            next: (blob: Blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `report-${this.currentYear}.xlsx`;
                link.click();
                URL.revokeObjectURL(link.href);
                this.isExporting = false;
                this._ToastService.show('تم التصدير بنجاح', 'success');
            },
            error: () => {
                this.isExporting = false;
                this._ToastService.show('فشل التصدير', 'error');
            }
        });
    }
}
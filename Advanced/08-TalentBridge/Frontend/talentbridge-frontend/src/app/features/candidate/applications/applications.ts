import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouteLine, Station } from '../../../shared/components/route-line/route-line';
import { ApplicationsService, MyApplication } from '../../../core/services/applications.service';

interface ApplicationRow extends MyApplication {
  stages: Station[];
}

const STAGE_TEMPLATE: { code: string; label: string }[] = [
  { code: 'APL', label: 'أُرسل' },
  { code: 'REV', label: 'مراجعة' },
  { code: 'ITV', label: 'مقابلة' },
  { code: 'OFR', label: 'عرض' },
  { code: 'HIR', label: 'تعيين' },
];

@Component({
  selector: 'app-candidate-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteLine],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {
  private appsSvc = inject(ApplicationsService);

  readonly loading = this.appsSvc.mineLoading;
  readonly filter = signal<'all' | 'active' | 'closed'>('all');

  private _rows = signal<ApplicationRow[]>([]);
  readonly rows = this._rows.asReadonly();

  readonly filtered = computed(() => {
    const f = this.filter();
    const rows = this._rows();
    if (f === 'all') return rows;
    if (f === 'active')
      return rows.filter((r) => r.status === 'Pending' || r.status === 'Reviewd');
    return rows.filter((r) => r.status === 'Accepted' || r.status === 'Rejected');
  });

  readonly stats = computed(() => {
    const rows = this._rows();
    return {
      total: rows.length,
      active: rows.filter((r) => r.status === 'Pending' || r.status === 'Reviewd').length,
      closed: rows.filter((r) => r.status === 'Accepted' || r.status === 'Rejected').length,
    };
  });

  async ngOnInit(): Promise<void> {
    await this.appsSvc.loadMine();
    this._rows.set(
      this.appsSvc.mine().map((r) => ({ ...r, stages: this.stagesFor(r.status) }))
    );
  }

  private stagesFor(status: string): Station[] {
    const map: Record<string, number> = {
      Pending: 0,
      Reviewd: 1,
      Accepted: 3,
      Rejected: -1,
    };
    const reached = map[status] ?? 0;
    return STAGE_TEMPLATE.map((s, i) => ({
      code: s.code,
      label: s.label,
      active: reached >= i,
      current: reached === i,
    }));
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Pending': return 'قيد الانتظار';
      case 'Reviewd': return 'قيد المراجعة';
      case 'Accepted': return 'قائمة مختصرة';
      case 'Rejected': return 'مرفوض';
      default: return status;
    }
  }
}
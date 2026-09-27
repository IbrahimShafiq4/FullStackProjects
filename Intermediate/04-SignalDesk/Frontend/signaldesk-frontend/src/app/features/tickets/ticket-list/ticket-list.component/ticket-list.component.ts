import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ITicket, ITicketFilter } from '../../../../core/models/ticket';
import { TicketsService } from '../../../../core/services/tickets.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HandwrittenUnderline } from '../../../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HandwrittenUnderline],
  templateUrl: './ticket-list.component.html',
  styles: `
  :host { display: block; }

.head-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--s-2);
  gap: var(--s-3);
  flex-wrap: wrap;
}

.btn-small { padding: var(--s-2) var(--s-4); font-size: var(--t-xs); }

.composer {
  border: 1px solid var(--line-blue);
  background: var(--paper-aged);
  padding: var(--s-5);
  margin-bottom: var(--s-5);
}

.composer-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--s-3);
  margin-bottom: var(--s-4);
  border-bottom: 1px dashed var(--line-blue-soft);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  gap: var(--s-3);
  flex-wrap: wrap;
}

.composer-id { color: var(--ink-blue); font-weight: 500; }
.composer-hint { color: var(--ink-red); }

.composer-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-4);
  margin-bottom: var(--s-5);
}

.field-wide { grid-column: 1 / -1; }
.composer-foot { display: flex; justify-content: flex-end; }

.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: var(--s-3);
  align-items: end;
  padding: var(--s-4);
  border: 1px solid var(--line-blue-soft);
  background: var(--paper-aged);
  margin-bottom: var(--s-5);
}

.filter-search,
.filter-cell,
.filter-toggle { display: flex; flex-direction: column; gap: var(--s-2); }

.chip {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  border: 1px solid var(--line-blue);
  padding: var(--s-2) var(--s-4);
  background: var(--paper);
  transition: background-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
  line-height: 1.5 !important;
  white-space: nowrap;
}

.chip-active { background: var(--ink-blue); color: var(--paper); border-color: var(--ink-blue); }

.register {
  border: 1px solid var(--line-blue-soft);
  background: var(--paper);
  overflow: hidden;
}

.register-head,
.register-row {
  display: grid;
  grid-template-columns: 80px 2.4fr 1.2fr 0.9fr 0.9fr 1fr;
  gap: var(--s-3);
  align-items: center;
  padding: var(--s-3) var(--s-4);
}

.register-head {
  background: var(--paper-aged);
  border-bottom: 1px solid var(--line-blue-soft);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  letter-spacing: 0.06em;
}

.register-head span { line-height: 1.4 !important; color: var(--ink-blue); }

.register-row {
  border-bottom: 1px dotted var(--line-blue-soft);
  transition: background-color var(--duration-fast) var(--ease-out);
}

.register-row:last-child { border-bottom: none; }
.register-row:hover { background: var(--paper-aged); }
.register-row:hover .reg-subject { color: var(--ink-red); }

.reg-id {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-red);
  font-weight: 500;
  line-height: 1.5 !important;
}

.reg-subject {
  font-size: var(--t-sm);
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5 !important;
  transition: color var(--duration-fast) var(--ease-out);
}

.reg-tags {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--pencil);
  font-weight: 400;
}

.reg-customer {
  font-size: var(--t-sm);
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5 !important;
}

.reg-status {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  border: 1px solid var(--line-blue-soft);
  padding: 2px var(--s-2);
  background: var(--paper-aged);
  text-align: center;
  white-space: nowrap;
  line-height: 1.5 !important;
}

.reg-priority {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--pencil);
  white-space: nowrap;
  line-height: 1.5 !important;
}

.reg-time {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.5 !important;
}

.reg-time-warning { color: var(--ink-amber); }

.reg-time-overdue {
  color: var(--ink-red);
  border: 1px solid var(--ink-red);
  padding: 2px var(--s-2);
  text-align: center;
}

.register-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-8) var(--s-4);
}

.pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--line-blue-soft);
  background: var(--paper-aged);
  margin-top: var(--s-4);
  gap: var(--s-3);
  flex-wrap: wrap;
}

.pager-info {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--pencil);
  line-height: 1.5 !important;
}

.pager-actions { display: flex; gap: var(--s-2); }

.pager-btn {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  border: 1px solid var(--line-blue-soft);
  padding: var(--s-2) var(--s-4);
  background: var(--paper);
  transition: background-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
  line-height: 1.5 !important;
}

.pager-btn:hover:not(:disabled) { background: var(--ink-blue); color: var(--paper); }
.pager-btn:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 900px) {
  .composer-body { grid-template-columns: 1fr; }
  .filters { grid-template-columns: 1fr; }

  .register-head { display: none; }

  .register-row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "id time"
      "subject subject"
      "customer status"
      "priority priority";
    gap: var(--s-2);
    padding: var(--s-4);
  }

  .col-id { grid-area: id; }
  .col-time { grid-area: time; text-align: left; }
  .col-subject { grid-area: subject; white-space: normal; }
  .col-customer { grid-area: customer; }
  .col-status { grid-area: status; }
  .col-priority { grid-area: priority; }
  .reg-subject { white-space: normal; }
}
  `,
})
export class TicketListComponent implements OnInit {
  ticketsService = inject(TicketsService);
  private toast = inject(ToastService);

  subject = signal('');
  priority = signal('2');
  category = signal('1');
  description = signal('');
  tags = signal('');

  showComposer = signal(false);

  tickets = signal<ITicket[]>([]);
  totalCount = signal(0);
  totalPages = signal(0);
  hasNext = signal(false);
  hasPrev = signal(false);

  filter = signal<ITicketFilter>({
    search: '',
    status: '',
    priority: '',
    category: '',
    sortBy: 'created',
    sortDir: 'desc',
    page: 1,
    pageSize: 10,
  });

  private search$ = new Subject<string>();

  ngOnInit() {
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(v => {
      this.filter.update(f => ({ ...f, search: v, page: 1 }));
      this.reload();
    });
    this.reload();
  }

  onSearch(value: string) {
    this.search$.next(value);
  }

  applyFilter(patch: Partial<ITicketFilter>) {
    this.filter.update(f => ({ ...f, ...patch, page: 1 }));
    this.reload();
  }

  goToPage(delta: number) {
    this.filter.update(f => ({ ...f, page: (f.page ?? 1) + delta }));
    this.reload();
  }

  reload() {
    this.ticketsService.loadFiltered(this.filter()).subscribe({
      next: r => {
        this.tickets.set(r.items);
        this.totalCount.set(r.totalCount);
        this.totalPages.set(r.totalPages);
        this.hasNext.set(r.hasNext);
        this.hasPrev.set(r.hasPrev);
      },
    });
  }

  toggleComposer() {
    this.showComposer.update(v => !v);
  }

  onCreate() {
    const subject = this.subject().trim();
    if (!subject) {
      this.toast.show('لازم تكتب موضوع التذكرة', 'error');
      return;
    }

    this.ticketsService
      .createTicket(subject, +this.priority(), this.categoryName(this.category()), this.description(), this.tags())
      .subscribe({
        next: () => {
          this.toast.show('التذكرة اتفتحت', 'success');
          this.subject.set('');
          this.priority.set('2');
          this.category.set('1');
          this.description.set('');
          this.tags.set('');
          this.showComposer.set(false);
          this.reload();
          this.ticketsService.loadStats();
        },
      });
  }

  pad(id: number): string { return id.toString().padStart(3, '0'); }

  private categoryName(id: string): string {
    const map: Record<string, string> = { '1': 'Technical', '2': 'Billing', '3': 'Bug', '4': 'Feature', '5': 'Other' };
    return map[id] ?? 'Technical';
  }

  priorityLabel(p: string): string {
    const map: Record<string, string> = { Low: 'منخفضة', Medium: 'متوسطة', High: 'عالية', Urget: 'عاجلة' };
    return map[p] ?? p;
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = { Open: 'مفتوحة', InProgress: 'شغالة', Resolved: 'اتحلت', Closed: 'اتقفلت' };
    return map[s] ?? s;
  }

  remaining(deadline: string): string {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return 'منتهية';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}س ${m}د`;
  }
}
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HandwrittenUnderline } from '../../../shared/handwritten-underline/handwritten-underline';
import { CheckMark } from '../../../shared/check-mark/check-mark';
import { TicketsService } from '../../../core/services/tickets.service';
import { ILiveMessage, SignalrService } from '../../../core/services/signalr.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ITicket, ITicketNote, TicketStatus } from '../../../core/models/ticket';

@Component({
  selector: 'app-ticket-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule, HandwrittenUnderline],
  templateUrl: './ticket-conversation.html',
  styles: `
  
  :host { display: block; }

.head-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--s-3);
  flex-wrap: wrap;
  margin-bottom: var(--s-2);
}

.conn {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  line-height: 1.5 !important;
}

.conn-dot {
  width: 7px;
  height: 7px;
  background: var(--ink-amber);
  border-radius: 50%;
  animation: pulse 1.6s infinite;
}

.conn-off { color: var(--pencil); }
.conn-off .conn-dot { background: var(--pencil); animation: none; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.fact-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--s-3);
  margin: var(--s-4) 0;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--line-blue-soft);
  background: var(--paper-aged);
}

.fact-label { font-family: var(--font-mono); font-size: var(--t-xs); color: var(--pencil); line-height: 1.4 !important; }
.fact-value { font-size: var(--t-sm); font-weight: 500; color: var(--ink); line-height: 1.5 !important; }
.fact-overdue { color: var(--ink-red); }

.ticket-desc {
  max-width: 780px;
  padding: var(--s-3) var(--s-4);
  border-inline-start: 2px solid var(--ink-blue);
  background: var(--paper-aged);
  font-size: var(--t-sm);
  line-height: 1.8 !important;
  color: var(--ink-soft);
  margin-bottom: var(--s-4);
}

.agent-controls {
  display: grid;
  grid-template-columns: 200px 240px;
  gap: var(--s-4);
  padding: var(--s-4);
  border: 1px solid var(--line-blue);
  background: var(--paper-aged);
  margin-bottom: var(--s-4);
}

.control { display: flex; flex-direction: column; gap: var(--s-2); }

.control-label {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  line-height: 1.4 !important;
}

.control-input {
  background: var(--paper);
  border: 1px solid var(--line-blue);
  padding: var(--s-2) var(--s-3);
  color: var(--ink);
  font-size: var(--t-sm);
  line-height: 1.5 !important;
}

.control-input:focus { outline: none; border-color: var(--ink-blue); }

.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--s-5);
  align-items: start;
  margin-top: var(--s-5);
}

.log-section,
.notes-section {
  border: 1px solid var(--line-blue-soft);
  background: var(--paper);
  display: flex;
  flex-direction: column;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--s-3) var(--s-4) 0;
  gap: var(--s-3);
}

.panel-head .sub { flex: 1; margin-bottom: var(--s-3); }

.panel-count {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--pencil);
  line-height: 1.5 !important;
}

.log {
  max-height: 480px;
  overflow-y: auto;
  flex: 1;
  padding: 0 var(--s-4);
}

.log-entry {
  padding: var(--s-4) 0;
  border-bottom: 1px dotted var(--line-blue-soft);
}

.log-entry:last-child { border-bottom: none; }

.log-meta {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: var(--s-3);
  align-items: baseline;
  margin-bottom: var(--s-2);
}

.log-no { font-family: var(--font-mono); font-size: var(--t-xs); color: var(--ink-red); line-height: 1.5 !important; }
.log-sender { font-size: var(--t-sm); font-weight: 600; color: var(--ink); line-height: 1.5 !important; }
.log-time { font-family: var(--font-mono); font-size: var(--t-xs); color: var(--pencil); line-height: 1.5 !important; }

.log-body { padding-inline-start: 52px; }

.log-text { font-size: var(--t-sm); line-height: 1.8 !important; color: var(--ink-soft); }

.log-attachment {
  margin-top: var(--s-3);
  display: inline-flex;
  flex-direction: column;
  gap: var(--s-2);
  border: 1px solid var(--line-blue-soft);
  padding: var(--s-2);
  background: var(--paper-aged);
}

.log-image { max-width: 200px; max-height: 200px; object-fit: cover; display: block; }

.log-caption {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--pencil);
  letter-spacing: 0.1em;
  line-height: 1.4 !important;
}

.log-empty, .notes-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-7) var(--s-4);
}

.composer {
  padding: var(--s-4);
  border-top: 1px solid var(--line-blue-soft);
  background: var(--paper-aged);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.composer-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-3);
  flex-wrap: wrap;
}

.file-field {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
}

.file-label {
  border: 1px solid var(--line-blue-soft);
  padding: 2px var(--s-3);
  background: var(--paper);
  transition: background-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
  line-height: 1.5 !important;
}

.file-field:hover .file-label { background: var(--ink-blue); color: var(--paper); }

.file-input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

.file-name {
  color: var(--ink-red);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5 !important;
}

.btn-small { padding: var(--s-2) var(--s-4); font-size: var(--t-xs); }

.note-composer {
  padding: var(--s-4);
  border-bottom: 1px solid var(--line-blue-soft);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  background: var(--paper-aged);
}

.notes-list { max-height: 400px; overflow-y: auto; }

.note { padding: var(--s-3) var(--s-4); border-bottom: 1px dotted var(--line-blue-soft); }
.note:last-child { border-bottom: none; }

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--s-2);
}

.note-author { font-family: var(--font-mono); font-size: var(--t-xs); font-weight: 500; color: var(--ink-amber); line-height: 1.5 !important; }
.note-time { font-family: var(--font-mono); font-size: 10px; color: var(--pencil); line-height: 1.5 !important; }
.note-body { font-size: var(--t-sm); line-height: 1.8 !important; color: var(--ink-soft); }

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-9) var(--s-4);
}

.loading-mark {
  width: 40px;
  height: 1px;
  background: var(--ink-blue);
  animation: load-sweep 1.4s infinite;
}

.loading-text {
  font-family: var(--font-mono);
  font-size: var(--t-sm);
  color: var(--pencil);
  line-height: 1.5 !important;
}

@keyframes load-sweep {
  0%, 100% { width: 20px; opacity: 0.4; }
  50% { width: 80px; opacity: 1; }
}

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .agent-controls { grid-template-columns: 1fr; }
  .log-body { padding-inline-start: 0; }
  .composer-foot { flex-direction: column; align-items: stretch; }
  .btn-primary { width: 100%; }
}

  `,
})
export class TicketConversation {
  ticketsService = inject(TicketsService);
  signalr = inject(SignalrService);
  auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  messages: WritableSignal<ILiveMessage[]> = signal<ILiveMessage[]>([]);
  newMessage = signal('');
  attachment = signal<File | null>(null);

  ticket = signal<ITicket | null>(null);
  notes = signal<ITicketNote[]>([]);
  newNote = signal('');

  readonly isAgent = computed(() => this.auth.currentUser()?.role === 'Agent');
  readonly statusOptions: TicketStatus[] = ['Open', 'InProgress', 'Resolved', 'Closed'];

  get ticketId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  constructor() {
    effect(() => {
      const incoming = this.signalr.incomingMessage();
      if (incoming) this.messages.update(list => [...list, incoming]);
    });
  }

  async ngOnInit() {
    await this.signalr.connect(this.ticketId);
    this.loadTicket();
    if (this.isAgent()) {
      this.loadNotes();
      this.ticketsService.loadAgents();
    }
  }

  async ngOnDestroy() {
    await this.signalr.disconnect();
  }

  loadTicket() {
    this.ticketsService.loadFiltered({ page: 1, pageSize: 100 }).subscribe({
      next: r => {
        const found = r.items.find(t => t.id === this.ticketId);
        if (found) this.ticket.set(found);
      },
    });
  }

  loadNotes() {
    this.ticketsService.getNotes(this.ticketId).subscribe({ next: n => this.notes.set(n) });
  }

  pad(n: number): string { return n.toString().padStart(2, '0'); }

  statusLabel(s: string): string {
    const map: Record<string, string> = { Open: 'مفتوحة', InProgress: 'شغالة', Resolved: 'اتحلت', Closed: 'اتقفلت' };
    return map[s] ?? s;
  }

  priorityLabel(p: string): string {
    const map: Record<string, string> = { Low: 'منخفضة', Medium: 'متوسطة', High: 'عالية', Urget: 'عاجلة' };
    return map[p] ?? p;
  }

  categoryLabel(c: string): string {
    const map: Record<string, string> = { Technical: 'تقني', Billing: 'فواتير', Bug: 'خطأ', Feature: 'ميزة', Other: 'أخرى' };
    return map[c] ?? c;
  }

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.attachment.set(input.files?.[0] ?? null);
  }

  send() {
    const content = this.newMessage();
    if (!content.trim() && !this.attachment()) return;

    const fd = new FormData();
    fd.append('content', content);
    const file = this.attachment();
    if (file) fd.append('attachment', file);

    this.ticketsService.sendMessage(this.ticketId, fd).subscribe({
      next: () => {
        this.newMessage.set('');
        this.attachment.set(null);
      },
    });
  }

  changeStatus(status: string) {
    this.ticketsService.updateStatus(this.ticketId, status).subscribe({
      next: t => {
        this.ticket.set(t);
        this.toast.show('الحالة اتحدّثت', 'success');
      },
      error: () => this.toast.show('حصل خطأ في التحديث', 'error'),
    });
  }

  assign(agentId: string) {
    const value = agentId === '' ? null : agentId;
    this.ticketsService.assign(this.ticketId, value).subscribe({
      next: t => {
        this.ticket.set(t);
        this.toast.show(value ? 'اتخصّصت لك' : 'اتشالت المخصصة', 'success');
      },
    });
  }

  addNote() {
    const content = this.newNote().trim();
    if (!content) return;

    this.ticketsService.addNote(this.ticketId, content).subscribe({
      next: n => {
        this.notes.update(list => [n, ...list]);
        this.newNote.set('');
        this.toast.show('الملاحظة اتسجّلت', 'success');
      },
    });
  }
}
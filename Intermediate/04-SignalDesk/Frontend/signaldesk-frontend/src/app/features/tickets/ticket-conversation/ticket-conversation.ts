import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { TicketsService } from '../../../core/services/tickets.service';
import { ILiveMessage, SignalrService } from '../../../core/services/signalr.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-ticket-conversation',
  styles: ``,
  templateUrl: './ticket-conversation.html',
})
export class TicketConversation {
  public _TicketsService: TicketsService = inject(TicketsService);
  public signalr = inject(SignalrService);
  private _ActivatedRoute = inject(ActivatedRoute);

  messages: WritableSignal<ILiveMessage[]> = signal<ILiveMessage[]>([]);
    newMessageText = signal('');
  selectedAttachment = signal<File | null>(null);

  get ticketId(): number {
    return Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
  }

  constructor() {
    effect(() => {
      const incoming = this.signalr.incomingMessage();
      if (incoming) {
        this.messages.update((list) => [...list, incoming]);
      }
    });
  }

  async ngOnInit() {
    await this.signalr.connect(this.ticketId);
  }

  async ngOnDestroy() {
    await this.signalr.disconnect();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedAttachment.set(input.files?.[0] ?? null);
  }

  onSend() {
    const content = this.newMessageText();
    if (!content.trim() && !this.selectedAttachment()) return;

    const formData = new FormData();
    formData.append('content', content);

    const file = this.selectedAttachment();
    if (file) formData.append('attachment', file);

    this._TicketsService.sendMessage(this.ticketId, formData).subscribe({
      next: () => {
        this.newMessageText.set('');
        this.selectedAttachment.set(null);
      }
    });
  }
}

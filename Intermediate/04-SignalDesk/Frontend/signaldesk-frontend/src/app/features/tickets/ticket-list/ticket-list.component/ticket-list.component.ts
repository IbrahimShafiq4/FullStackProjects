import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { TicketsService } from '../../../../core/services/tickets.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormField, FormsModule],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  ticketsService = inject(TicketsService);
  private toast = inject(ToastService);

  formModel = signal({
    subject: '',
    priority: '2'
  });

  ticketForm = form(this.formModel, () => { });

  ngOnInit() {
    this.ticketsService.loadTickets();
  }

  onCreateTicket() {
    const { subject, priority } = this.formModel();

    if (!subject.trim()) {
      this.toast.show('لازم تكتب موضوع التذكرة', 'error');
      return;
    }

    this.ticketsService.createTicket(subject, +priority).subscribe({
      next: () => {
        this.toast.show('تم فتح التذكرة بنجاح', 'success');

        this.formModel.set({
          subject: '',
          priority: '2'
        });

        this.ticketsService.loadTickets();
      }
    });
  }

  getRemainingTime(deadline: string): string {
    const diffMs = new Date(deadline).getTime() - Date.now();

    if (diffMs <= 0) return 'منتهية';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}س ${minutes}د`;
  }
}
import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ITicket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    slaDeadline: string;
    isOverdue: boolean;
    isNearingDeadline: boolean;
    customerName: string;
    assignedAgentName: string | null;
}

@Service()
export class TicketsService {
    private readonly _HttpClient = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7150/api/tickets';
    readonly SERVER_ROOT = 'https://localhost:7150';
    tickets = signal<ITicket[]>([]);

    loadTickets() {
        this._HttpClient
            .get<ITicket[]>(this.API_URL)
            .subscribe({
                next: (data) => {
                    this.tickets.set(data);
                }
            });
    }

    createTicket(subject: string, priority: number) {
        return this._HttpClient.post<ITicket>(
            this.API_URL,
            {
                subject,
                priority
            }
        );
    }

    sendMessage(ticketId: number, formData: FormData) {
        return this._HttpClient.post(
            `${this.SERVER_ROOT}/api/messages/ticket/${ticketId}`,
            formData
        );
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }
}
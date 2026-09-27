import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    IAgent,
    IPagedResult,
    ITicket,
    ITicketFilter,
    ITicketNote,
    ITicketStats
} from '../models/ticket';

@Service()
export class TicketsService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'https://localhost:7150/api';
    readonly SERVER_ROOT = 'https://localhost:7150';

    tickets = signal<ITicket[]>([]);
    stats = signal<ITicketStats | null>(null);
    agents = signal<IAgent[]>([]);

    loadFiltered(filter: ITicketFilter) {
        return this.http.get<IPagedResult<ITicket>>(`${this.API_URL}/tickets`, {
            params: this.buildParams(filter),
            withCredentials: true,
        });
    }

    loadStats() {
        this.http.get<ITicketStats>(
            `${this.API_URL}/tickets/stats`,
            { withCredentials: true }
        ).subscribe({
            next: s => this.stats.set(s)
        });
    }

    loadAgents() {
        this.http.get<IAgent[]>(`${this.API_URL}/agents`, { withCredentials: true }).subscribe({
            next: a => this.agents.set(a)
        });
    }

    createTicket(subject: string, priority: number, category: string, description?: string, tags?: string) {
        return this.http.post<ITicket>(`${this.API_URL}/tickets`, {
            subject, priority, category, description, tags
        }, { withCredentials: true });
    }

    updateStatus(id: number, status: string) {
        return this.http.patch<ITicket>(`${this.API_URL}/tickets/${id}/status`, { status }, { withCredentials: true });
    }

    assign(id: number, agentId: string | null) {
        return this.http.patch<ITicket>(`${this.API_URL}/tickets/${id}/assign`, { agentId }, { withCredentials: true });
    }

    getNotes(ticketId: number) {
        return this.http.get<ITicketNote[]>(`${this.API_URL}/tickets/${ticketId}/notes`, { withCredentials: true });
    }

    addNote(ticketId: number, content: string) {
        return this.http.post<ITicketNote>(`${this.API_URL}/tickets/${ticketId}/notes`, { content }, { withCredentials: true });
    }

    sendMessage(ticketId: number, formData: FormData) {
        return this.http.post(`${this.API_URL}/messages/ticket/${ticketId}`, formData, { withCredentials: true });
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}${relativeUrl}`;
    }

    private buildParams(filter: ITicketFilter): HttpParams {
        let params = new HttpParams();
        const entries: [string, unknown][] = Object.entries(filter);
        for (const [k, v] of entries) {
            if (v !== undefined && v !== null && v !== '') {
                params = params.set(k, String(v));
            }
        }
        return params;
    }
}
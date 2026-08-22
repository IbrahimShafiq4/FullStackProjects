import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IProposal {
    id: number;
    proposedPrice: number;
    deliveryDays: number;
    message: string;
    status: string;
    freelancerName: string;
}

export interface IGig {
    id: number;
    title: string;
    description: string;
    budget: number;
    status: string;
    clientId: string;
    clientName: string;
    createdAt: string;
    proposals?: IProposal[];
}

@Service()
export class GigsService {
    private _HttpClient: HttpClient = inject(HttpClient);

    private readonly API_URL: string = 'https://localhost:7299/api/gigs';
    private readonly PROPOSALS_URL: string = 'https://localhost:7299/api/proposals';

    gigs: WritableSignal<IGig[]> = signal<IGig[]>([]);
    selectedGig: WritableSignal<IGig | null> = signal<IGig | null>(null);

    loadOpenGigs(): void {
        this._HttpClient.get<IGig[]>(`${this.API_URL}`).subscribe({ next: (gig: IGig[]) => this.gigs.set(gig), })
    }

    loadGigDetails(id: number): void {
        this._HttpClient.get<IGig>(`${this.API_URL}/${id}`).subscribe({ next: (gig: IGig) => this.selectedGig.set(gig), })
    }

    createGig(title: string, description: string, budget: number): Observable<IGig> {
        return this._HttpClient.post<IGig>(`${this.API_URL}`, { title, description, budget })
    }

    submitProposal(gigId: number, proposedPrice: number, deliveryDays: number, message: string): Observable<IProposal> {
        return this._HttpClient.post<IProposal>(`${this.PROPOSALS_URL}/gig/${gigId}`, {proposedPrice, deliveryDays, message})
    }

    acceptProposal(proposalId: number) {
        return this._HttpClient.patch(`${this.PROPOSALS_URL}/${proposalId}/accept`, {  });
    }
}

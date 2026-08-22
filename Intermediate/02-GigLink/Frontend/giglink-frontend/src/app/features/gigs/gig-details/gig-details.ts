import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GigsService, IProposal } from '../../../core/services/gigs-service';
import { AuthService } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { ActivatedRoute } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-gig-details',
  styles: ``,
  templateUrl: './gig-details.html',
})
export class GigDetails implements OnInit {
  public _GigsService: GigsService = inject(GigsService);
  public _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);

  proposalModel: WritableSignal<{ proposedPrice: number, deliveryDays: number, message: string }> = signal({ proposedPrice: 0, deliveryDays: 1, message: '' });
  proposalForm = form(this.proposalModel, () => { });

  get gigId(): number {
    return Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
  }

  get isOwner(): boolean {
    return this._GigsService.selectedGig()?.clientId ===
      this._AuthService.currentUser()?.id;
  }

  ngOnInit(): void {
    this._GigsService.loadGigDetails(this.gigId);
  }

  onSubmitProposal(): void {
    const { proposedPrice, deliveryDays, message } = this.proposalModel();

    this._GigsService.submitProposal(this.gigId, proposedPrice, deliveryDays, message).subscribe({
      next: (res: IProposal) => {
        this._ToastService.show('تم إرسال عرضك بنجاح', 'success');
        this._GigsService.loadGigDetails(this.gigId);
      },
      error: (err) => this._ToastService.show(err.error ?? 'حصل خطأ', 'error')
    });
  }

  onAcceptProposal(proposalId: number) {
    this._GigsService.acceptProposal(proposalId).subscribe({
      next: () => {
        this._ToastService.show('تم قبول العرض ورفض باقي العروض', 'success');
        this._GigsService.loadGigDetails(this.gigId);
      },
      error: (err) => this._ToastService.show(err.error ?? 'حصل خطأ', 'error')
    });
  }
}

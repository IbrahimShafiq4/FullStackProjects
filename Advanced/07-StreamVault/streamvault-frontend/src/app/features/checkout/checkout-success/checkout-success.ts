import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css'
})
export class CheckoutSuccess {
  public readonly _AuthService: AuthService = inject(AuthService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);

  public paymentId: number = 0;

  constructor() {
    this.paymentId = Number(this._Route.snapshot.paramMap.get('paymentId'));
  }
}
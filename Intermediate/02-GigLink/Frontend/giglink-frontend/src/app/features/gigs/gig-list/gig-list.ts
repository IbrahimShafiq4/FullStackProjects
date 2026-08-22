import { Component, inject, OnInit } from '@angular/core';
import { GigForm } from '../gig-form/gig-form';
import { RouterLink } from '@angular/router';
import { GigsService } from '../../../core/services/gigs-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [RouterLink, GigForm],
  selector: 'app-gig-list',
  styles: ``,
  templateUrl: './gig-list.html',
})
export class GigList implements OnInit {
  _GigsService: GigsService = inject(GigsService);
  _AuthService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._GigsService.loadOpenGigs();
  }
}
